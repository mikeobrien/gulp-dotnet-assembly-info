var expect = require('expect.js'),
    File = require('vinyl'),
    Handlebars = require('handlebars'),
    PluginError = require('gulp-util').PluginError,
    assemblyInfo = require('../plugin.js');

describe('gulp-dotnet-assembly-info', function() {

    var assemblyInfoTemplate = Handlebars.compile(
        'using System.Reflection;\r\n\r\n' +
        '// General Information about an assembly is controlled through the following \r\n\r\n' +
        '[   assembly   :   AssemblyTitle  (   "{{title}}" )  ]\r\n' +
        '[assembly:AssemblyDescription("{{description}}")]');
    var defaultTitle = 'some title';
    var defaultDescription = 'some description';
    var defaultAssemblyInfoFilePath = '/Solution/Project/Project.csproj';
    var defaultAssemblyInfoFile = assemblyInfoTemplate(
            { title: defaultTitle, description: defaultDescription });
    var assemblyInfoFile;

    beforeEach(function() {
        assemblyInfoFile = new File({
            path: defaultAssemblyInfoFilePath,
            contents: new Buffer(defaultAssemblyInfoFile)
        });
    });

    it('should fail no config is passed in', function() {

        expect(function() { assemblyInfo(); })
            .to.throwException(function (e) {
                expect(e).to.be.a(PluginError);
                expect(e.message).to.be('No configuration specified.');
            });

    });

    it('should fail no matches are passed in', function() {

        expect(function() { assemblyInfo({}); })
            .to.throwException(function (e) {
                expect(e).to.be.a(PluginError);
                expect(e.message).to.be('No attributes specified.');
            });

    });

    it('should replace strings', function(done) {

        var info = assemblyInfo({ title: 'another title' });

        info.write(assemblyInfoFile);

        info.once('data', function(file) {
            expect(file.isBuffer()).to.be(true);
            expect(file.contents.toString('utf8')).to.be(assemblyInfoTemplate(
                { title: 'another title', description: defaultDescription }));
            done();
        });

    });

    it('should replace function results', function(done) {

        var info = assemblyInfo({ description: function(value) { return value + ' and another'; }});

        info.write(assemblyInfoFile);

        info.once('data', function(file) {
            expect(file.isBuffer()).to.be(true);
            expect(file.contents.toString('utf8')).to.be(assemblyInfoTemplate(
                { title: defaultTitle, description: 'some description and another' }));
            done();
        });

    });

});