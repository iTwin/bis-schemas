/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const child_process = require('child_process');
const pkgGen = require('../packageGeneration.js');

describe('Package Generation', function() {
  describe('Parse version string tests', function() {
    it('Parse deprecated `beta` package version', function() {
      const version = "1.2.3-beta.4";
      const parsed = pkgGen.parseVersionString(version);
      chai.expect(parsed.read).to.equal("1");
      chai.expect(parsed.write).to.equal("2");
      chai.expect(parsed.patch).to.equal("3");
      chai.expect(parsed.isBeta).to.equal(true);
      chai.expect(parsed.beta).to.equal("4");
    });
    it('Parse `dev` package version', function() {
      const version = "1.2.3-dev.4";
      const parsed = pkgGen.parseVersionString(version);
      chai.expect(parsed.read).to.equal("1");
      chai.expect(parsed.write).to.equal("2");
      chai.expect(parsed.patch).to.equal("3");
      chai.expect(parsed.isBeta).to.equal(true);
      chai.expect(parsed.beta).to.equal("4");
    });
  }),
  describe('npm view output is properly sorted', function() {
    it('Latest beta first', function() {
      const npmOutput = {
        "created": "2019-11-15T16:37:19.3660078Z",
        "modified": "2019-12-03T12:36:38.7059581Z",
        "1.0.0-dev.1": "2019-11-15T16:37:19.3660078Z",
        "1.0.0-dev.2": "2019-12-03T12:36:38.7059581Z"
      };
      const publishedVersions = pkgGen.parseNpmOutputAndSort(npmOutput);
      chai.expect(publishedVersions.length).to.equal(2);
      chai.expect(pkgGen.formatPackageVersion(publishedVersions[0])).to.equal("1.0.0-dev.2");
    });
    it('Beta for newest version first', function() {
      const npmOutput = {
        "created": "2019-11-15T16:37:19.3660078Z",
        "modified": "2019-12-03T12:36:38.7059581Z",
        "1.0.0-dev.1": "2019-11-15T16:37:19.3660078Z",
        "1.0.1-dev.1": "2019-11-15T16:37:19.3660078Z",
        "1.0.0-dev.2": "2019-12-03T12:36:38.7059581Z"
      };
      const publishedVersions = pkgGen.parseNpmOutputAndSort(npmOutput);
      chai.expect(publishedVersions.length).to.equal(3);
      chai.expect(pkgGen.formatPackageVersion(publishedVersions[0])).to.equal("1.0.1-dev.1");
    });
    it('patch version does not interfer with beta version', function () {
      const npmOutput = {
        "created": "2019-11-13T18:43:34.8337986Z",
        "modified": "2020-01-09T14:55:39.5625934Z",
        "1.0.0": "2019-11-13T18:43:34.8337986Z",
        "2.0.0": "2019-11-13T18:43:37.119937Z",
        "2.0.1-dev.1": "2019-11-13T19:03:48.6000968Z",
        "2.0.1-dev.2": "2020-01-09T14:55:39.5625934Z"
      };
      const publishedVersions = pkgGen.parseNpmOutputAndSort(npmOutput);
      chai.expect(publishedVersions.length).to.equal(4);
      chai.expect(pkgGen.formatPackageVersion(publishedVersions[0])).to.equal("2.0.1-dev.2");
    });
  });
  describe('Schema inventory attributes are checked', function() {
    it('sha1 must be set to publish released schema', function() {
      const schemaInfo = {
        released: true,
        approved: 'yes',
      };
      const versionInfo = {
        isBeta: false
      }
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.false;
      schemaInfo.sha1 = null;
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.false;
      schemaInfo.sha1 = "42";
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.false;
      schemaInfo.sha1 = "f61b2ba6b58723aafac9d066a37b40e228ff4f1d";
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.true;
    });
    it('isBeta and released must be set correctly', function() {
      const schemaInfo = {
        sha1: "f61b2ba6b58723aafac9d066a37b40e228ff4f1d",
        released: true,
        approved: 'yes',
      };
      const versionInfo = {
        isBeta: false
      }
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.true;
      versionInfo.isBeta = true;
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.false;
      schemaInfo.released = false;
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.true;
      versionInfo.isBeta = false;
      chai.expect(pkgGen.shouldPublish(schemaInfo, versionInfo)).to.be.false;
    });
  });

  describe('Add documentation (remarks file and relevant media) to the schema package', function() {
    let packageDir;

    beforeEach(function() {
      packageDir = path.join(__dirname, 'testPkg');

      if (fs.existsSync(packageDir)) {
        fs.rmSync(packageDir, { recursive: true, force: true });
      }

      fs.mkdirSync(packageDir, { recursive: true });
    });

    after(function() {
      if (fs.existsSync(packageDir)) {
        fs.rmSync(packageDir, { recursive: true, force: true });
      }
    });

    it('Should attach the remarks file having no media references (WIP Schema Case)', function() {
      const schemaInfo = {
        name: 'SchemaA',
        path: 'tools\\packages\\test\\assets\\SchemaA.ecschema.xml',
        released: false,
      };

      pkgGen.addDocsToPackage(schemaInfo, packageDir);
      const remarksFile = path.join(packageDir, 'SchemaA.remarks.md');
      let isExists = fs.existsSync(remarksFile)
      chai.expect(isExists).to.be.true;

      // Only referenced media should be added
      const media = path.join(packageDir, 'media');
      isExists = fs.existsSync(media)
      chai.expect(isExists).to.be.false;
    });

    it('Should attach the remarks file having no media references (Released Schema Case)', function() {
      const schemaInfo = {
        name: 'SchemaA',
        path: 'tools\\packages\\test\\assets\\Released\\SchemaA.01.01.01.ecschema.xml',
        released: true,
      };

      pkgGen.addDocsToPackage(schemaInfo, packageDir);
      const remarksFile = path.join(packageDir, 'SchemaA.remarks.md');
      let isExists = fs.existsSync(remarksFile)
      chai.expect(isExists).to.be.true;

      // Only referenced media should be added
      const media = path.join(packageDir, 'media');
      isExists = fs.existsSync(media)
      chai.expect(isExists).to.be.false;
    });

    it('Should only attach the referenced media from the remarks file', function() {
      const schemaInfo = {
        name: 'SchemaB',
        path: 'tools\\packages\\test\\assets\\SchemaB.ecschema.xml',
        released: false,
      };

      pkgGen.addDocsToPackage(schemaInfo, packageDir);
      const remarksFile = path.join(packageDir, 'SchemaB.remarks.md');
      let isExists = fs.existsSync(remarksFile)
      chai.expect(isExists).to.be.true;

      const image1 = path.join(packageDir, 'media', 'image-1.png');
      isExists = fs.existsSync(image1)
      chai.expect(isExists).to.be.true;

      const image2 = path.join(packageDir, 'media', 'Shapes', 'image2.png');
      isExists = fs.existsSync(image2)
      chai.expect(isExists).to.be.true;

      // image3 is not referenced in the remarks file
      const image3 = path.join(packageDir, 'media', 'Shapes', 'image3.png');
      isExists = fs.existsSync(image3)
      chai.expect(isExists).to.be.false;
    });

    it('Should not attach docs, when remarks file is not present for the provided schema', function() {
      const schemaInfo = {
        name: 'SchemaC',
        path: 'tools\\packages\\test\\assets\\SchemaC.ecschema.xml', // There is no remarks file for SchemaC
        released: false,
      };

      pkgGen.addDocsToPackage(schemaInfo, packageDir);
      const remarksFile = path.join(packageDir, 'SchemaC.remarks.md');
      let isExists = fs.existsSync(remarksFile)
      chai.expect(isExists).to.be.false;

      const media = path.join(packageDir, 'media');
      isExists = fs.existsSync(media)
      chai.expect(isExists).to.be.false;
    });
  });

  describe('Localization package generation', function() {
    let outDir;

    beforeEach(function() {
      outDir = path.normalize(__dirname + "/../../../testOut/packageGeneration");
      if (fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true });
      }
      fs.mkdirSync(outDir, { recursive: true });
    });

    after(function() {
      if (fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true });
      }
    });

    it('Correctly build the localization package version with all required files', async function() {
      const schemaInfo = {
        name: 'SchemaA',
        version: '01.00.00',
        released: false,
      };

      const localization = {
        path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json',
        locale: 'de',
      };

      const versionInfo = {
        packageName: '@bentley/schema-a-schema-de',
        packageVersion: '1.0.0-dev.1',
      };

      await pkgGen.buildLocalizationPackage(outDir, versionInfo, schemaInfo, localization);

      const pkgDir = path.join(outDir, 'SchemaA.de.1.0.0-dev.1');
      chai.expect(fs.existsSync(pkgDir)).to.be.true;
      chai.expect(fs.existsSync(path.join(pkgDir, 'SchemaA.de.json'))).to.be.true;
      chai.expect(fs.existsSync(path.join(pkgDir, 'package.json'))).to.be.true;
      chai.expect(fs.existsSync(path.join(pkgDir, 'README.md'))).to.be.true;
      chai.expect(fs.existsSync(path.join(pkgDir, 'LICENSE.md'))).to.be.true;
    });

    it('Generated package should have right content in package.json file', async function() {
      const schemaInfo = {
        name: 'SchemaA',
        version: '01.00.00',
        released: false,
      };

      const localization = {
        path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json',
        locale: 'de',
      };

      const versionInfo = {
        packageName: '@bentley/schema-a-schema-de',
        packageVersion: '1.0.0-dev.1',
      };

      await pkgGen.buildLocalizationPackage(outDir, versionInfo, schemaInfo, localization);

      const pkgJsonPath = path.join(outDir, 'SchemaA.de.1.0.0-dev.1', 'package.json');
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      chai.expect(pkgJson.name).to.equal('@bentley/schema-a-schema-de');
      chai.expect(pkgJson.version).to.equal('1.0.0-dev.1');
      chai.expect(pkgJson.license).to.equal('MIT');
      chai.expect(pkgJson.keywords).to.include.members(['Bentley', 'BIS', 'iModel']);
      chai.expect(pkgJson.exports).to.deep.equal({ './SchemaA.de.json': './SchemaA.de.json' });
    });

    it('Correct package name should be present in the readme file', async function() {
      const schemaInfo = { 
        name: 'SchemaA', 
        version: '01.00.00', 
        released: false 
      };

      const localization = { 
        path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json', 
        locale: 'de' 
      };

      const versionInfo = { 
        packageName: '@bentley/schema-a-schema-de', 
        packageVersion: '1.0.0-dev.1' 
      };

      await pkgGen.buildLocalizationPackage(outDir, versionInfo, schemaInfo, localization);

      const readme = fs.readFileSync(path.join(outDir, 'SchemaA.de.1.0.0-dev.1', 'README.md'), 'utf8');
      chai.expect(readme).to.include('@bentley/schema-a-schema-de');
      chai.expect(readme).to.not.include('{package-name}');
    });

    it('should not create package when localizations are empty', async function() {
      const schemaInfo = { 
        name: 'SchemaA', 
        version: '01.00.00', 
        released: false,
        localizations: []
      };

      await pkgGen.createLocalizationPackages(outDir, '@bentley/schema-a-schema', schemaInfo, [], false, false);

      chai.expect(fs.readdirSync(outDir)).to.be.an('array').that.is.empty;
    });

    it('should skip localized package generation for a released schema that is not approved', async function() {
      const schemaInfo = {
        name: 'SchemaA',
        version: '01.01.01',
        released: true,
        approved: 'No',
        sha1: 'f61b2ba6b58723aafac9d066a37b40e228ff4f1d',
        localizations: [{ 
          path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json', 
          locale: 'de' 
        }],
      };

      await pkgGen.createLocalizationPackages(outDir, '@bentley/schema-a-schema', schemaInfo, [schemaInfo], false, false);

      chai.expect(fs.readdirSync(outDir)).to.be.an('array').that.is.empty;
    });

    it('should create the localization package for an approved released schema', async function() {
      // Stub npm view
      const execStub = sinon.stub(child_process, 'execSync').throws(new Error('E404 not found'));

      try {
        const schemaInfo = {
          name: 'SchemaA',
          version: '01.01.01',
          released: true,
          approved: 'Yes',
          sha1: 'f61b2ba6b58723aafac9d066a37b40e228ff4f1d',
          localizations: [{
            path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json',
            locale: 'de',
          }],
        };

        await pkgGen.createLocalizationPackages(outDir, '@bentley/schema-a-schema', schemaInfo, [schemaInfo], false, false);

        const pkgDir = path.join(outDir, 'SchemaA.de.1.1.1');
        chai.expect(fs.existsSync(pkgDir)).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'SchemaA.de.json'))).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'package.json'))).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'README.md'))).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'LICENSE.md'))).to.be.true;

        const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
        chai.expect(pkgJson.name).to.equal('@bentley/schema-a-schema-de');
        chai.expect(pkgJson.version).to.equal('1.1.1');
      } finally {
        execStub.restore();
      }
    });

    it('should create the localization package for a WIP schema', async function() {
      // Stub npm view
      const execStub = sinon.stub(child_process, 'execSync').throws(new Error('E404 not found'));

      try {
        const schemaInfo = {
          name: 'SchemaA',
          version: '01.00.00',
          released: false,
          localizations: [{
            path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json',
            locale: 'de',
          }],
        };

        await pkgGen.createLocalizationPackages(outDir, '@bentley/schema-a-schema', schemaInfo, [schemaInfo], false, false);

        const pkgDir = path.join(outDir, 'SchemaA.de.1.0.0-dev.1');
        chai.expect(fs.existsSync(pkgDir)).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'SchemaA.de.json'))).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'package.json'))).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'README.md'))).to.be.true;
        chai.expect(fs.existsSync(path.join(pkgDir, 'LICENSE.md'))).to.be.true;

        const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
        chai.expect(pkgJson.name).to.equal('@bentley/schema-a-schema-de');
        chai.expect(pkgJson.version).to.equal('1.0.0-dev.1');
      } finally {
        execStub.restore();
      }
    });

    it('should skip localized package generation for a WIP schema when --skipBetaPackages is set', async function() {
      const execStub = sinon.stub(child_process, 'execSync').throws(new Error('E404 not found'));

      try {
        const schemaInfo = {
          name: 'SchemaA',
          version: '01.00.00',
          released: false,
          localizations: [{
            path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json',
            locale: 'de',
          }],
        };

        await pkgGen.createLocalizationPackages(outDir, '@bentley/schema-a-schema', schemaInfo, [schemaInfo], true, false);

        chai.expect(fs.readdirSync(outDir)).to.be.an('array').that.is.empty;
      } finally {
        execStub.restore();
      }
    });
  });

  describe('Overall package generation', function() {
    let outDir;
    let inventoryPath;
    let skipListPath;
    const templatePath = path.resolve('./tools/packages/package.json.template');

    beforeEach(function() {
      outDir = path.normalize(__dirname + "/../../../testOut/packageGeneration");
      if (fs.existsSync(outDir)) 
        fs.rmSync(outDir, { recursive: true });

      fs.mkdirSync(outDir, { recursive: true });
      inventoryPath = path.join(outDir, 'inventory.json');
      skipListPath = path.join(outDir, 'skipList.json');
    });

    after(function() {
      if (fs.existsSync(outDir)) 
        fs.rmSync(outDir, { recursive: true});
    });

    function loadStubbedPkgGen() {
      const execStub = sinon.stub().throws(new Error('E404 not found'));
      const stubbed = proxyquire('../packageGeneration.js', {
        './schemaJsonCreator': { createSchemaJson: async () => undefined },
        'child_process': { execSync: execStub, spawnSync: child_process.spawnSync },
      });
      return { stubbed, execStub };
    }

    it('should be able to create the schema and localization packages for a release schema and locale', async function() {
      const inventory = {
        SchemaA: [{
          name: 'SchemaA',
          version: '01.01.01',
          released: true,
          approved: 'Yes',
          sha1: 'f61b2ba6b58723aafac9d066a37b40e228ff4f1d',
          path: 'tools\\packages\\test\\assets\\Released\\SchemaA.01.01.01.ecschema.xml',
          localizations: [{
            path: 'tools\\packages\\test\\assets\\Released\\Locales\\SchemaA.01.01.01.de.json',
            locale: 'de',
          }],
        }],
      };
      fs.writeFileSync(inventoryPath, JSON.stringify(inventory));
      fs.writeFileSync(skipListPath, JSON.stringify([]));

      const { stubbed } = loadStubbedPkgGen();
      await stubbed.createPackages(inventoryPath, skipListPath, outDir, templatePath, false, false);

      const schemaPkgDir = path.join(outDir, 'SchemaA.1.1.1');
      chai.expect(fs.existsSync(schemaPkgDir)).to.be.true;
      chai.expect(fs.existsSync(path.join(schemaPkgDir, 'SchemaA.ecschema.xml'))).to.be.true;
      chai.expect(fs.existsSync(path.join(schemaPkgDir, 'package.json'))).to.be.true;

      const localePkgDir = path.join(outDir, 'SchemaA.de.1.1.1');
      chai.expect(fs.existsSync(localePkgDir)).to.be.true;
      chai.expect(fs.existsSync(path.join(localePkgDir, 'SchemaA.de.json'))).to.be.true;
      const localePkgJson = JSON.parse(fs.readFileSync(path.join(localePkgDir, 'package.json'), 'utf8'));
      chai.expect(localePkgJson.name).to.equal('@bentley/schema-a-schema-de');
      chai.expect(localePkgJson.version).to.equal('1.1.1');
    });

    it('should be able to create the schema and localization packages for a wip schema and locale', async function() {
      const inventory = {
        SchemaA: [{
          name: 'SchemaA',
          version: '01.00.00',
          released: false,
          path: 'tools\\packages\\test\\assets\\SchemaA.ecschema.xml',
          localizations: [{
            path: 'tools\\packages\\test\\assets\\Locales\\SchemaA.de.json',
            locale: 'de',
          }],
        }],
      };
      fs.writeFileSync(inventoryPath, JSON.stringify(inventory));
      fs.writeFileSync(skipListPath, JSON.stringify([]));

      const { stubbed } = loadStubbedPkgGen();
      await stubbed.createPackages(inventoryPath, skipListPath, outDir, templatePath, false, false);

      const schemaPkgDir = path.join(outDir, 'SchemaA.1.0.0-dev.1');
      chai.expect(fs.existsSync(schemaPkgDir)).to.be.true;
      chai.expect(fs.existsSync(path.join(schemaPkgDir, 'SchemaA.ecschema.xml'))).to.be.true;
      chai.expect(fs.existsSync(path.join(schemaPkgDir, 'package.json'))).to.be.true;

      const localePkgDir = path.join(outDir, 'SchemaA.de.1.0.0-dev.1');
      chai.expect(fs.existsSync(localePkgDir)).to.be.true;
      chai.expect(fs.existsSync(path.join(localePkgDir, 'SchemaA.de.json'))).to.be.true;
      const localePkgJson = JSON.parse(fs.readFileSync(path.join(localePkgDir, 'package.json'), 'utf8'));
      chai.expect(localePkgJson.name).to.equal('@bentley/schema-a-schema-de');
      chai.expect(localePkgJson.version).to.equal('1.0.0-dev.1');
    });
  });

});