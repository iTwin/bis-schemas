const chai = require('chai');
const pkgGen = require('../packageGeneration.js');

describe('Package Generation', function() {
  describe('npm view output is properly sorted', function() {
    it('Latest beta first', function() {
      const npmOutput = {
        "created": "2019-11-15T16:37:19.3660078Z",
        "modified": "2019-12-03T12:36:38.7059581Z",
        "1.0.0-beta.1": "2019-11-15T16:37:19.3660078Z",
        "1.0.0-beta.2": "2019-12-03T12:36:38.7059581Z"
      };
      const publishedVersions = pkgGen.parseNpmOutputAndSort(npmOutput);
      chai.expect(publishedVersions.length).to.equal(2);
      chai.expect(pkgGen.formatPackageVersion(publishedVersions[0])).to.equal("1.0.0-beta.2");
    });
    it('Beta for newest version first', function() {
      const npmOutput = {
        "created": "2019-11-15T16:37:19.3660078Z",
        "modified": "2019-12-03T12:36:38.7059581Z",
        "1.0.0-beta.1": "2019-11-15T16:37:19.3660078Z",
        "1.0.1-beta.1": "2019-11-15T16:37:19.3660078Z",
        "1.0.0-beta.2": "2019-12-03T12:36:38.7059581Z"
      };
      const publishedVersions = pkgGen.parseNpmOutputAndSort(npmOutput);
      chai.expect(publishedVersions.length).to.equal(3);
      chai.expect(pkgGen.formatPackageVersion(publishedVersions[0])).to.equal("1.0.1-beta.1");
    });
  });

});