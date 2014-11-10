var expect = require('expect.js'),
    File = require('vinyl'),
    assemblyInfo = require('../index.js');

describe('gulp-dotnet-assembly-info', function() {

    it('should', function(done) {

        var file = new File({
          contents: new Buffer('yada')
        });

        var info = assemblyInfo({});

        info.write(file);

        info.once('data', function(file) {
          expect(file.isBuffer()).to.be(true);
          expect(file.contents.toString('utf8')).to.be('yada');
          done();
        });

    });

});