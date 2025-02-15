/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const fs = require('fs');
const path = require('path');
const chai = require('chai');
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

});