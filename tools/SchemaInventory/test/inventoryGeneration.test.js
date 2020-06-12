const chai = require('chai');
const sinon = require('sinon');
const fs = require("fs-extra");
const path = require("path");
const inventoryHandler = require('../../SchemaInventory/schemaInventoryHandler.js');
chai.use(require('chai-as-promised'))

describe('Inventory Generation', function() {
  const outDir = path.normalize(__dirname + "/../../../testOut");
  const assetsDir = path.join(__dirname, "assets");
  const inventoryFile = path.join(outDir, "SchemaInventory.json");
  const assetsInventoryFile = path.join(assetsDir, "SchemaInventory.json");
  
  let checksumDump;
  let existingInventory;

  before(() => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, {recursive: false});
    }
  });

  beforeEach(() => {
    sinon.restore();
    fs.removeSync(inventoryFile);
    checksumDump = {
      schemas: [
        {
          comment: "01.01.01", 
          verifier: "VerifierName", 
          sha1: "testsha1", 
          verified: "Yes", 
          name: "TestSchema", 
          author: "AuthorName", 
          date: "01/01/2020", 
          dynamic: "No", 
          approved: "Yes"
        }, 
      ]
    };

    existingInventory = {
      TestSchema: [
        {
          name: "TestSchema",
          path: "TestPath", 
          released: true,
          version: "01.01.01",
          comment: "",
          verifier: "VerifierName", 
          sha1: "testsha1", 
          verified: "Yes", 
          author: "AuthorName", 
          date: "01/01/2020", 
          dynamic: "No", 
          approved: "Yes"
        }
      ]
    }
  });

  describe('generateInventory tests', function() {
    it("BIS checksum dump specified, inventory file created properly", async function() {
      await inventoryHandler.generateInventory(assetsDir, outDir, assetsDir);
      const inventory = JSON.parse(fs.readFileSync(inventoryFile));
      
      chai.expect(Object.keys(inventory).length).to.equal(3);
      chai.expect(inventory["SchemaA"]).to.not.be.undefined;
      chai.expect(inventory["SchemaA"].length).to.equal(3);
      chai.expect(inventory["SchemaA"][0].version).to.equal("01.01.02");  
      chai.expect(inventory["SchemaA"][0].released).to.be.false;
      chai.expect(inventory["SchemaA"][0].comment).to.equal("Working Copy");  
      chai.expect(inventory["SchemaA"][1].version).to.equal("01.01.01");  
      chai.expect(inventory["SchemaA"][1].released).to.be.true;
      chai.expect(inventory["SchemaB"][1].comment).to.equal("");  
      chai.expect(inventory["SchemaA"][1].sha1).to.equal("sha1A");
      chai.expect(inventory["SchemaA"][1].date).to.equal("01/01/2020");
      chai.expect(inventory["SchemaA"][1].verifier).to.equal("VerifierA");
      chai.expect(inventory["SchemaA"][1].author).to.equal("AuthorA");
      chai.expect(inventory["SchemaA"][2].version).to.equal("01.01.02");  
      chai.expect(inventory["SchemaA"][2].comment).to.equal("Known Bad");
      chai.expect(inventory["SchemaA"][2].released).to.be.true;
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
      chai.expect(inventory["SchemaB"][1].comment).to.equal("");  
      chai.expect(inventory["SchemaB"][1].sha1).to.equal("sha1C");
      chai.expect(inventory["SchemaB"][1].date).to.equal("01/03/2020");
      chai.expect(inventory["SchemaB"][1].verifier).to.equal("VerifierC");
      chai.expect(inventory["SchemaB"][1].author).to.equal("AuthorC");
      chai.expect(inventory["SchemaB"][2].version).to.equal("02.02.02");
      chai.expect(inventory["SchemaB"][2].comment).to.equal("Known Bad");
      chai.expect(inventory["SchemaB"][2].released).to.be.true;
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
      chai.expect(inventory["SchemaC"][0].author).to.equal("");  
      chai.expect(inventory["SchemaC"][0].comment).to.equal("");  
      chai.expect(inventory["SchemaC"][0].date).to.equal("Unknown");
      chai.expect(inventory["SchemaC"][0].dynamic).to.equal("No");  
      chai.expect(inventory["SchemaC"][0].name).to.equal("SchemaC");
      chai.expect(inventory["SchemaC"][0].sha1).to.equal("");
    });

    it("Merge existing inventory, inventory file created properly", async function() {
      fs.copyFileSync(assetsInventoryFile, inventoryFile);
      await inventoryHandler.generateInventory(assetsDir, outDir);
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
      chai.expect(inventory["SchemaC"][0].author).to.equal("");  
      chai.expect(inventory["SchemaC"][0].comment).to.equal("");  
      chai.expect(inventory["SchemaC"][0].date).to.equal("Unknown");
      chai.expect(inventory["SchemaC"][0].dynamic).to.equal("No");  
      chai.expect(inventory["SchemaC"][0].name).to.equal("SchemaC");
      chai.expect(inventory["SchemaC"][0].sha1).to.equal("");
    });
  });

  describe('createBaseInventory tests', function() {
    it("Schema info loaded properly", async function() {
      const inventory = await inventoryHandler.createRepositoryInventory(assetsDir);

      chai.expect(Object.keys(inventory).length).to.equal(3);
      chai.expect(inventory["SchemaA"]).to.not.be.undefined;
      chai.expect(inventory["SchemaA"].length).to.equal(2);
      chai.expect(inventory["SchemaA"][0].version).to.equal("01.01.02");  
      chai.expect(inventory["SchemaA"][0].released).to.be.false;
      chai.expect(inventory["SchemaA"][0].comment).to.equal("Working Copy");  
      chai.expect(inventory["SchemaA"][1].version).to.equal("01.01.01");  
      chai.expect(inventory["SchemaA"][1].released).to.be.true;
      chai.expect(inventory["SchemaA"][1].comment).to.be.undefined;

      chai.expect(inventory["SchemaB"]).to.not.be.undefined;
      chai.expect(inventory["SchemaB"].length).to.equal(2);
      chai.expect(inventory["SchemaB"][0].version).to.equal("02.02.02");  
      chai.expect(inventory["SchemaA"][0].released).to.be.false;
      chai.expect(inventory["SchemaA"][0].comment).to.equal("Working Copy");
      chai.expect(inventory["SchemaB"][1].version).to.equal("02.02.01");  
      chai.expect(inventory["SchemaA"][1].released).to.be.true;
      chai.expect(inventory["SchemaA"][1].comment).to.be.undefined;

      chai.expect(inventory["SchemaC"]).to.not.be.undefined;
      chai.expect(inventory["SchemaC"].length).to.equal(1);
      chai.expect(inventory["SchemaC"][0].name).to.equal("SchemaC");
      chai.expect(inventory["SchemaC"][0].version).to.equal("03.00.00");  
      chai.expect(inventory["SchemaC"][0].released).to.be.true;
      chai.expect(inventory["SchemaC"][0].comment).to.equal(undefined);  
      chai.expect(inventory["SchemaC"][0].approved).to.equal(undefined);  
      chai.expect(inventory["SchemaC"][0].author).to.equal(undefined);  
      chai.expect(inventory["SchemaC"][0].comment).to.equal(undefined);  
      chai.expect(inventory["SchemaC"][0].date).to.equal(undefined);
      chai.expect(inventory["SchemaC"][0].dynamic).to.equal(undefined);  
      chai.expect(inventory["SchemaC"][0].sha1).to.equal(undefined);
    });

    it("Schema version does not match file version, throws", async function () {
      const schemaPath = path.join(assetsDir, "Released", "SchemaA.01.01.01.ecschema.xml");
      const stub = sinon.stub(fs, "readFileSync");
      stub.withArgs(schemaPath).returns(`<ECSchema schemaName="SchemaA" alias="a" version="01.01.00"`);
      stub.callThrough();
      await chai.expect(inventoryHandler.createRepositoryInventory(assetsDir)).to.be.rejectedWith(`The version in the file for schema Released\\SchemaA.01.01.01.ecschema.xml 01.01.00 doesn't match the version recorded in the inventory 01.01.01.`);
    });

    it("Schema version not found in schema xml, throws", async function () {
      const schemaPath = path.join(assetsDir, "SchemaA.ecschema.xml");
      const stub = sinon.stub(fs, "readFileSync");
      stub.withArgs(schemaPath).returns(`<ECSchema schemaName="SchemaA" alias="a" version=""`);
      stub.callThrough();
      await chai.expect(inventoryHandler.createRepositoryInventory(assetsDir)).to.be.rejectedWith(`Could not find version in schema xml for file SchemaA.ecschema.xml`);
    });

    it("Schema minor version not set in schema xml, full version properly set in inventory", async function () {
      const schemaPath = path.join(assetsDir, "SchemaA.ecschema.xml");
      const stub = sinon.stub(fs, "readFileSync");
      stub.withArgs(schemaPath).returns(`<ECSchema schemaName="SchemaA" alias="a" version="01.01"`);
      stub.callThrough();
      const inventory = await inventoryHandler.createRepositoryInventory(assetsDir);
      chai.expect(inventory["SchemaA"][0].version).to.equal("01.00.01");
    });
  });

  describe('mergeExistingInventoryIntoRepoInventory tests', function() {
    it("Schema not found in inventory, schema added", function() {
      const repoInventory = {};

      inventoryHandler.mergeExistingInventoryIntoRepoInventory(repoInventory, existingInventory);
      chai.expect(repoInventory["TestSchema"]).to.not.be.undefined;
      chai.expect(repoInventory["TestSchema"][0]).to.not.be.undefined;
      chai.expect(repoInventory["TestSchema"][0].name).to.equal("TestSchema");
      chai.expect(repoInventory["TestSchema"][0].comment).to.equal("");
      chai.expect(repoInventory["TestSchema"][0].version).to.equal("01.01.01");
      chai.expect(repoInventory["TestSchema"][0].released).to.equal(true);
      chai.expect(repoInventory["TestSchema"][0].sha1).to.equal("testsha1");
      chai.expect(repoInventory["TestSchema"][0].author).to.equal("AuthorName");
      chai.expect(repoInventory["TestSchema"][0].approved).to.equal("Yes");
      chai.expect(repoInventory["TestSchema"][0].date).to.equal("01/01/2020");
      chai.expect(repoInventory["TestSchema"][0].dynamic).to.equal("No");
    });

    it("Existing released Schema, info merged into inventory", function() {
      const repoInventory = {
        TestSchema: [
          {
            name: "TestSchema",
            path: "test-path",
            version: "01.01.01",
            released: true
          }
        ]
      };

      inventoryHandler.mergeExistingInventoryIntoRepoInventory(repoInventory, existingInventory);
      chai.expect(repoInventory["TestSchema"]).to.not.be.undefined;
      chai.expect(repoInventory["TestSchema"][0]).to.not.be.undefined;
      chai.expect(repoInventory["TestSchema"][0].name).to.equal("TestSchema");
      chai.expect(repoInventory["TestSchema"][0].comment).to.equal("");
      chai.expect(repoInventory["TestSchema"][0].version).to.equal("01.01.01");
      chai.expect(repoInventory["TestSchema"][0].released).to.equal(true);
      chai.expect(repoInventory["TestSchema"][0].sha1).to.equal("testsha1");
      chai.expect(repoInventory["TestSchema"][0].author).to.equal("AuthorName");
      chai.expect(repoInventory["TestSchema"][0].approved).to.equal("Yes");
      chai.expect(repoInventory["TestSchema"][0].date).to.equal("01/01/2020");
      chai.expect(repoInventory["TestSchema"][0].dynamic).to.equal("No");
    });
  });

  it("Existing non-released Schema, info merged into inventory", function() {
    const repoInventory = {
      TestSchema: [
        {
          name: "TestSchema",
          path: "test-path",
          version: "01.01.01",
          released: false
        }
      ]
    };
    existingInventory["TestSchema"][0].released = false;
    inventoryHandler.mergeExistingInventoryIntoRepoInventory(repoInventory, existingInventory);
    chai.expect(repoInventory["TestSchema"]).to.not.be.undefined;
    chai.expect(repoInventory["TestSchema"][0]).to.not.be.undefined;
    chai.expect(repoInventory["TestSchema"][0].name).to.equal("TestSchema");
    chai.expect(repoInventory["TestSchema"][0].comment).to.equal("");
    chai.expect(repoInventory["TestSchema"][0].version).to.equal("01.01.01");
    chai.expect(repoInventory["TestSchema"][0].released).to.equal(false);
    chai.expect(repoInventory["TestSchema"][0].sha1).to.equal("testsha1");
    chai.expect(repoInventory["TestSchema"][0].author).to.equal("AuthorName");
    chai.expect(repoInventory["TestSchema"][0].approved).to.equal("Yes");
    chai.expect(repoInventory["TestSchema"][0].date).to.equal("01/01/2020");
    chai.expect(repoInventory["TestSchema"][0].dynamic).to.equal("No");
  });

  it("Existing non-released Schema, inventory marked as released, info added into inventory", function() {
    const repoInventory = {
      TestSchema: [
        {
          name: "TestSchema",
          path: "test-path",
          version: "01.01.01",
          released: false
        }
      ]
    };
    inventoryHandler.mergeExistingInventoryIntoRepoInventory(repoInventory, existingInventory);
    chai.expect(repoInventory["TestSchema"]).to.not.be.undefined;
    chai.expect(repoInventory["TestSchema"][0]).to.not.be.undefined;
    chai.expect(repoInventory["TestSchema"][0].name).to.equal("TestSchema");
    chai.expect(repoInventory["TestSchema"][0].comment).to.be.undefined;
    chai.expect(repoInventory["TestSchema"][0].version).to.equal("01.01.01");
    chai.expect(repoInventory["TestSchema"][0].released).to.equal(false);
    chai.expect(repoInventory["TestSchema"][1].name).to.equal("TestSchema");
    chai.expect(repoInventory["TestSchema"][1].comment).to.equal("");
    chai.expect(repoInventory["TestSchema"][1].version).to.equal("01.01.01");
    chai.expect(repoInventory["TestSchema"][1].released).to.equal(true);
    chai.expect(repoInventory["TestSchema"][1].sha1).to.equal("testsha1");
    chai.expect(repoInventory["TestSchema"][1].author).to.equal("AuthorName");
    chai.expect(repoInventory["TestSchema"][1].approved).to.equal("Yes");
    chai.expect(repoInventory["TestSchema"][1].date).to.equal("01/01/2020");
    chai.expect(repoInventory["TestSchema"][1].dynamic).to.equal("No");
  });

  describe('cleanupInventoryEntries tests', function() {
    it("No path, no comment, not approved, comment set to 'Known Bad'", function() {
      const inventory = {
        TestSchema: [
          {
            name: "TestSchema",
          }
        ]
      };

      inventoryHandler.cleanupInventoryEntries(inventory);
      chai.expect(inventory["TestSchema"][0].comment).to.equal("Known Bad");
    });

    it("Missing properties set properly in inventory", function() {
      const inventory = {
        TestSchema: [
          {
            name: "TestSchema",
            path: "test-path"
          }
        ]
      };
      sinon.stub(fs, 'readFileSync').returns(`<ECSchema schemaName="TestSchema" alias="ts" version="01.01.01"`);

      inventoryHandler.cleanupInventoryEntries(inventory);
      chai.expect(inventory["TestSchema"][0].comment).to.equal("");
      chai.expect(inventory["TestSchema"][0].sha1).to.equal("");
      chai.expect(inventory["TestSchema"][0].author).to.equal("");
      chai.expect(inventory["TestSchema"][0].approved).to.equal("No");
      chai.expect(inventory["TestSchema"][0].date).to.equal("Unknown");
      chai.expect(inventory["TestSchema"][0].dynamic).to.equal("No");
    });
  });
});