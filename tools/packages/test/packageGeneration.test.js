const chai = require('chai');
const pkgGen = require('../packageGeneration.js');

describe('Package Generation', function() {
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

});