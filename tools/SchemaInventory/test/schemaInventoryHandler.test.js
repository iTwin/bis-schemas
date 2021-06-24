/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const proxyquire = require('proxyquire')
const fs = require("fs-extra");
const path = require("path");
const readdirp = require("readdirp");

chai.use(chaiAsPromised);

describe.only('Schema Inventory Tests', function() {
  const outDir = path.normalize(__dirname + "/../../../testOut");
  const assetsDir = path.join(__dirname, "assets");
  const inventoryFile = path.join(outDir, "SchemaInventory.json");
  const assetsInventoryFile = path.join(assetsDir, "SchemaInventory.json");
  let inventoryHandler;

  before(() => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, {recursive: false});
    }
  });

  beforeEach(() => {
    process.env.BisRootPath = assetsDir;
    process.env.InventoryPath = outDir;
    fs.copyFileSync(assetsInventoryFile, inventoryFile);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('updateSchemaInventory tests (mocked)', function() {
    let fsExistsSyncStub;
    let fsReadFileSyncStub;
    let jsonParseStub;
    let readdirpPromiseStub;

    function mockSchemaInventory(json) {
      fsExistsSyncStub.withArgs(outDir).returns(true);
      fsExistsSyncStub.callThrough();
      let inventoryPath = path.join(outDir, "SchemaInventory.json");
      fsReadFileSyncStub.withArgs(inventoryPath).returns("TestJson");
      fsReadFileSyncStub.callThrough();
      jsonParseStub.withArgs("TestJson").returns(json);
      jsonParseStub.callThrough();
    }

    function mockRepoInventory(schemaInfo, schemaVersion = undefined) {
      for (const entry of schemaInfo) {
        schemaVersion = schemaVersion === undefined ? entry.version : schemaVersion;
        const schemaPath = path.join(assetsDir, entry.path);
        fsReadFileSyncStub.withArgs(schemaPath).returns(`"<ECSchema version="${schemaVersion}"`);
      }
      fsReadFileSyncStub.callThrough();
      readdirpPromiseStub.onFirstCall().resolves(schemaInfo);
      readdirpPromiseStub.callThrough();
    }

    this.beforeEach(() => {
      fsExistsSyncStub = sinon.stub(fs, "existsSync");
      fsReadFileSyncStub = sinon.stub(fs, "readFileSync")
      jsonParseStub = sinon.stub(JSON, "parse");
      readdirpPromiseStub = sinon.stub(readdirp, "promise");
      const computeChecksum = sinon.stub().returns("MockChecksum");
      inventoryHandler = proxyquire('../schemaInventoryHandler.js', {'./computeSchemaChecksum': computeChecksum});
    })

    it("New released schema, no schema entries, schema added to inventory", async function() {
      const repositorySchemas = [
        {
          basename: "TestSchema.01.00.00.ecschema.xml",
          path: "Test\\Released\\Path",
          version: "01.00.00",
        }
      ];
      mockSchemaInventory({});
      mockRepoInventory(repositorySchemas);

      await inventoryHandler.updateSchemaInventory();
      
      const inventory = JSON.parse(fs.readFileSync(inventoryFile));
      expect(Object.keys(inventory).length).to.equal(1);
      expect(inventory["TestSchema"]).to.not.be.undefined;
      expect(inventory["TestSchema"].length).to.equal(1);
      expect(inventory["TestSchema"][0].name).to.equal("TestSchema");
      expect(inventory["TestSchema"][0].path).to.equal("Test\\Released\\Path");
      expect(inventory["TestSchema"][0].version).to.equal("01.00.00");
      expect(inventory["TestSchema"][0].comment).to.equal("");
      expect(inventory["TestSchema"][0].released).to.be.true;
      expect(inventory["TestSchema"][0].sha1).to.equal("MockChecksum");
      expect(inventory["TestSchema"][0].date).to.equal((new Date()).toLocaleDateString('en-US'));
      expect(inventory["TestSchema"][0].verified).to.equal("No");
      expect(inventory["TestSchema"][0].verifier).to.equal("");
      expect(inventory["TestSchema"][0].author).to.equal(require("os").userInfo().username);
      expect(inventory["TestSchema"][0].approved).to.equal("No");
      expect(inventory["TestSchema"][0].dynamic).to.equal("No");
    });

    it("New released schema, WIP schema exists in inventory, schema added to inventory", async function() {
      const existingInventory = {
        TestSchema: [
          {
            name: "TestSchema",
            path: "Test\\Path", 
            released: false,
            version: "01.00.00",
            comment: "Working Copy",
            verifier: "", 
            sha1: "", 
            verified: "No", 
            author: "AuthorName", 
            date: "01/01/2020", 
            dynamic: "No", 
            approved: "No"
          }
        ]
      };
      const repositorySchemas = [
        {
          basename: "TestSchema.01.00.00.ecschema.xml",
          path: "Test\\Released\\Path",
          version: "01.00.00",
        }
      ];
      mockSchemaInventory(existingInventory);
      mockRepoInventory(repositorySchemas);

      await inventoryHandler.updateSchemaInventory();
      
      const inventory = JSON.parse(fs.readFileSync(inventoryFile));
      expect(Object.keys(inventory).length).to.equal(1);
      expect(inventory["TestSchema"]).to.not.be.undefined;
      expect(inventory["TestSchema"].length).to.equal(2);
      // WIP
      expect(inventory["TestSchema"][0].name).to.equal("TestSchema");
      expect(inventory["TestSchema"][0].path).to.equal("Test\\Path");
      expect(inventory["TestSchema"][0].version).to.equal("01.00.00");
      expect(inventory["TestSchema"][0].comment).to.equal("Working Copy");
      expect(inventory["TestSchema"][0].released).to.be.false;
      expect(inventory["TestSchema"][0].sha1).to.equal("");
      expect(inventory["TestSchema"][0].date).to.equal("01/01/2020");
      expect(inventory["TestSchema"][0].verified).to.equal("No");
      expect(inventory["TestSchema"][0].verifier).to.equal("");
      expect(inventory["TestSchema"][0].author).to.equal("AuthorName");
      expect(inventory["TestSchema"][0].approved).to.equal("No");
      expect(inventory["TestSchema"][0].dynamic).to.equal("No");
      // Released
      expect(inventory["TestSchema"][1].name).to.equal("TestSchema");
      expect(inventory["TestSchema"][1].path).to.equal("Test\\Released\\Path");
      expect(inventory["TestSchema"][1].version).to.equal("01.00.00");
      expect(inventory["TestSchema"][1].comment).to.equal("");
      expect(inventory["TestSchema"][1].released).to.be.true;
      expect(inventory["TestSchema"][1].sha1).to.equal("MockChecksum");
      expect(inventory["TestSchema"][1].date).to.equal((new Date()).toLocaleDateString('en-US'));
      expect(inventory["TestSchema"][1].verified).to.equal("No");
      expect(inventory["TestSchema"][1].verifier).to.equal("");
      expect(inventory["TestSchema"][1].author).to.equal(require("os").userInfo().username);
      expect(inventory["TestSchema"][1].approved).to.equal("No");
      expect(inventory["TestSchema"][1].dynamic).to.equal("No");
    });

    it("New WIP schema, no schema entries, schema added to inventory", async function() {
      const repositorySchemas = [
        {
          basename: "TestSchema.ecschema.xml",
          path: "Test\\Path",
          version: "01.00.00",
        }
      ];
      mockSchemaInventory({});
      mockRepoInventory(repositorySchemas);

      await inventoryHandler.updateSchemaInventory();
      
      const inventory = JSON.parse(fs.readFileSync(inventoryFile));
      expect(Object.keys(inventory).length).to.equal(1);
      expect(inventory["TestSchema"]).to.not.be.undefined;
      expect(inventory["TestSchema"].length).to.equal(1);
      expect(inventory["TestSchema"][0].name).to.equal("TestSchema");
      expect(inventory["TestSchema"][0].path).to.equal("Test\\Path");
      expect(inventory["TestSchema"][0].version).to.equal("01.00.00");
      expect(inventory["TestSchema"][0].comment).to.equal("Working Copy");
      expect(inventory["TestSchema"][0].released).to.be.false;
      expect(inventory["TestSchema"][0].sha1).to.equal("");
      expect(inventory["TestSchema"][0].date).to.equal("Unknown");
      expect(inventory["TestSchema"][0].verified).to.equal(undefined);
      expect(inventory["TestSchema"][0].verifier).to.equal(undefined);
      expect(inventory["TestSchema"][0].author).to.equal("");
      expect(inventory["TestSchema"][0].approved).to.equal("No");
      expect(inventory["TestSchema"][0].dynamic).to.equal("No");
    });

    it("New WIP schema, existing WIP with older version, schema inventory updated", async function() {
      const existingInventory = {
        TestSchema: [
          {
            name: "TestSchema",
            path: "Test\\Path", 
            released: false,
            version: "01.00.00",
            comment: "Working Copy",
            sha1: "", 
            author: "", 
            date: "Unknown", 
            dynamic: "No", 
            approved: "No"
          }
        ]
      };
      const repositorySchemas = [
        {
          basename: "TestSchema.ecschema.xml",
          path: "Test\\Path",
          version: "01.00.01",
        }
      ];
      mockSchemaInventory(existingInventory);
      mockRepoInventory(repositorySchemas);

      await inventoryHandler.updateSchemaInventory();
      
      const inventory = JSON.parse(fs.readFileSync(inventoryFile));
      expect(Object.keys(inventory).length).to.equal(1);
      expect(inventory["TestSchema"]).to.not.be.undefined;
      expect(inventory["TestSchema"].length).to.equal(1);
      expect(inventory["TestSchema"][0].name).to.equal("TestSchema");
      expect(inventory["TestSchema"][0].path).to.equal("Test\\Path");
      expect(inventory["TestSchema"][0].version).to.equal("01.00.01");
      expect(inventory["TestSchema"][0].comment).to.equal("Working Copy");
      expect(inventory["TestSchema"][0].released).to.be.false;
      expect(inventory["TestSchema"][0].sha1).to.equal("");
      expect(inventory["TestSchema"][0].date).to.equal("Unknown");
      expect(inventory["TestSchema"][0].verified).to.equal(undefined);
      expect(inventory["TestSchema"][0].verifier).to.equal(undefined);
      expect(inventory["TestSchema"][0].author).to.equal("");
      expect(inventory["TestSchema"][0].approved).to.equal("No");
      expect(inventory["TestSchema"][0].dynamic).to.equal("No");
    });

    it("BisRootPath not defined, default path (../..) does not exist, throws", async function() {
      delete process.env.BisRootPath;
      const stub = sinon.stub(fs, "pathExistsSync");
      // extra ../ needed for test
      const defaultPath = path.join(__dirname, "../../..");
      stub.withArgs(defaultPath).returns(false);
      stub.callThrough();
      await expect(inventoryHandler.updateSchemaInventory()).to.be.rejectedWith(Error, "Could not find BIS root path.")
    });

    it("Specified InventoryPath does not exist, throws", async function() {
      process.env.InventoryPath = "badPath";
      fsExistsSyncStub.withArgs("badPath\\SchemaInventory.json").returns(false);
      fsExistsSyncStub.callThrough();
      await expect(inventoryHandler.updateSchemaInventory()).to.be.rejectedWith(Error, "Could not find SchemaInventory.json.")
    });

    it("InventoryPath is undefined, default path (../../SchemaInventory.json) does not exist, throws", async function() {
      delete process.env.InventoryPath;
      fsExistsSyncStub.onCall(1).returns(false);
      // extra ../ needed for test
      const defaultPath = path.join(__dirname, "../../..", "SchemaInventory.json");
      fsExistsSyncStub.withArgs(defaultPath).returns(false);
      fsExistsSyncStub.callThrough();
      await expect(inventoryHandler.updateSchemaInventory()).to.be.rejectedWith(Error, "Could not find SchemaInventory.json.")
    });

    it("Schema version does not match file version, throws", async function () {
      const repositorySchemas = [
        {
          basename: "TestSchema.01.00.00.ecschema.xml",
          path: "Test\\Released\\Path",
          version: "01.00.00",
        }
      ];
      mockSchemaInventory({});
      mockRepoInventory(repositorySchemas, "01.00.01");
      await chai.expect(inventoryHandler.updateSchemaInventory()).to.be.rejectedWith(`The version in the file for schema Test\\Released\\Path 01.00.01 doesn't match the version recorded in the inventory 01.00.00.`);
    });

    it("Schema version not found in schema xml, throws", async function () {
      const repositorySchemas = [
        {
          basename: "TestSchema.01.00.00.ecschema.xml",
          path: "Test\\Path",
        }
      ];
      mockSchemaInventory({});
      mockRepoInventory(repositorySchemas, "");
      await chai.expect(inventoryHandler.updateSchemaInventory()).to.be.rejectedWith(`Could not find version in schema xml for file Test\\Path`);
    });

    it("Schema minor version not set in schema xml, full version properly set in inventory", async function () {
      const repositorySchemas = [
        {
          basename: "TestSchema.ecschema.xml",
          path: "Test\\Path",
        }
      ];
      mockSchemaInventory({});
      mockRepoInventory(repositorySchemas, "01.01");
      await inventoryHandler.updateSchemaInventory();
      const inventory = JSON.parse(fs.readFileSync(inventoryFile));

      chai.expect(inventory["TestSchema"][0].version).to.equal("01.00.01");
    });
  });

  describe('updateSchemaInventory tests (non mocked)', function() {
    it("Merge existing inventory, inventory file created properly", async function() {
      const date = new Date();
      fs.copyFileSync(assetsInventoryFile, inventoryFile);
      await inventoryHandler.updateSchemaInventory();
      const inventory = JSON.parse(fs.readFileSync(inventoryFile));
      
      chai.expect(Object.keys(inventory).length).to.equal(3);
      chai.expect(inventory["SchemaA"]).to.not.be.undefined;
      chai.expect(inventory["SchemaA"].length).to.equal(3);
      chai.expect(inventory["SchemaA"][0].version).to.equal("01.01.02");  
      chai.expect(inventory["SchemaA"][0].released).to.be.false;
      chai.expect(inventory["SchemaA"][0].comment).to.equal("Working Copy");  
      chai.expect(inventory["SchemaA"][1].version).to.equal("01.01.01");  
      chai.expect(inventory["SchemaA"][1].released).to.be.true;
      chai.expect(inventory["SchemaA"][1].sha1).to.equal("sha1A");
      chai.expect(inventory["SchemaA"][1].date).to.equal("01/01/2020");
      chai.expect(inventory["SchemaA"][1].verifier).to.equal("VerifierA");
      chai.expect(inventory["SchemaA"][1].author).to.equal("AuthorA");
      chai.expect(inventory["SchemaA"][2].version).to.equal("01.01.02");  
      chai.expect(inventory["SchemaA"][2].comment).to.equal("Known Bad");
      chai.expect(inventory["SchemaA"][2].sha1).to.equal("sha1B");
      chai.expect(inventory["SchemaA"][2].date).to.equal("01/02/2020");
      chai.expect(inventory["SchemaA"][2].verifier).to.equal("VerifierB");
      chai.expect(inventory["SchemaA"][2].author).to.equal("AuthorB");

      chai.expect(inventory["SchemaB"]).to.not.be.undefined;
      chai.expect(inventory["SchemaB"].length).to.equal(3);
      chai.expect(inventory["SchemaB"][0].version).to.equal("02.02.02");  
      chai.expect(inventory["SchemaB"][0].released).to.be.false;
      chai.expect(inventory["SchemaB"][0].comment).to.equal("Working Copy");  
      chai.expect(inventory["SchemaB"][1].version).to.equal("02.02.01");  
      chai.expect(inventory["SchemaB"][1].released).to.be.true;
      chai.expect(inventory["SchemaB"][1].sha1).to.equal("sha1C");
      chai.expect(inventory["SchemaB"][1].date).to.equal("01/03/2020");
      chai.expect(inventory["SchemaB"][1].verifier).to.equal("VerifierC");
      chai.expect(inventory["SchemaB"][1].author).to.equal("AuthorC");
      chai.expect(inventory["SchemaB"][2].version).to.equal("02.02.02");
      chai.expect(inventory["SchemaB"][2].comment).to.equal("Known Bad");
      chai.expect(inventory["SchemaB"][2].sha1).to.equal("sha1D");
      chai.expect(inventory["SchemaB"][2].date).to.equal("01/04/2020");
      chai.expect(inventory["SchemaB"][2].verifier).to.equal("VerifierD");
      chai.expect(inventory["SchemaB"][2].author).to.equal("AuthorD");

      chai.expect(inventory["SchemaC"]).to.not.be.undefined;
      chai.expect(inventory["SchemaC"].length).to.equal(1);
      chai.expect(inventory["SchemaC"][0].version).to.equal("03.00.00");  
      chai.expect(inventory["SchemaC"][0].released).to.be.true;
      chai.expect(inventory["SchemaC"][0].comment).to.equal("");  
      chai.expect(inventory["SchemaC"][0].approved).to.equal("No");  
      chai.expect(inventory["SchemaC"][0].author).to.equal(require("os").userInfo().username);  
      chai.expect(inventory["SchemaC"][0].comment).to.equal("");  
      chai.expect(inventory["SchemaC"][0].date).to.equal(date.toLocaleDateString('en-US'));
      chai.expect(inventory["SchemaC"][0].dynamic).to.equal("No");  
      chai.expect(inventory["SchemaC"][0].name).to.equal("SchemaC");
      chai.expect(inventory["SchemaC"][0].sha1).to.equal("MockChecksum");
    });
  });
});