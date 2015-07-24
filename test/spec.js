var expect = require('expect.js'),
    File = require('vinyl'),
    Handlebars = require('handlebars'),
    PluginError = require('gulp-util').PluginError,
    assemblyInfo = require('../plugin.js');

describe('gulp-dotnet-assembly-info', function() {

    var csAssemblyInfoTemplate = Handlebars.compile(
        'using System.Reflection;\r\n\r\n' +
        '// General Information about an assembly is controlled through the following \r\n\r\n' +
        '[   assembly   :   AssemblyTitle  (   "{{title}}" )  ]\r\n' +
        '[assembly:AssemblyDescription("{{description}}")]');
    var vbAssemblyInfoTemplate = Handlebars.compile(
        'Imports System.Reflection;\r\n\r\n' +
        '// General Information about an assembly is controlled through the following \r\n\r\n' +
        '<   assembly   :   AssemblyTitle  (   "{{title}}" )  >\r\n' +
        '<Assembly:AssemblyDescription("{{description}}")>');
    var defaultTitle = 'some title';
    var defaultDescription = 'some description';
    var defaultAssemblyInfoFilePath = '/Solution/Project/Project.csproj';
    var csAssemblyInfoFile = csAssemblyInfoTemplate(
            { title: defaultTitle, description: defaultDescription });
    var vbAssemblyInfoFile = vbAssemblyInfoTemplate(
            { title: defaultTitle, description: defaultDescription });
    var csAssemblyInfo, vbAssemblyInfo;

    beforeEach(function() {
        csAssemblyInfo = new File({
            path: defaultAssemblyInfoFilePath,
            contents: new Buffer(csAssemblyInfoFile)
        });

        vbAssemblyInfo = new File({
            path: defaultAssemblyInfoFilePath,
            contents: new Buffer(vbAssemblyInfoFile)
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

    it('should replace C# strings', function(done) {

        var info = assemblyInfo({ title: 'another title' });

        info.write(csAssemblyInfo);

        info.once('data', function(file) {
            expect(file.isBuffer()).to.be(true);
            expect(file.contents.toString('utf8')).to.be(csAssemblyInfoTemplate(
                { title: 'another title', description: defaultDescription }));
            done();
        });

    });

    it('should replace VB strings', function(done) {

        var info = assemblyInfo({ title: 'another title' });

        info.write(vbAssemblyInfo);

        info.once('data', function(file) {
            expect(file.isBuffer()).to.be(true);
            expect(file.contents.toString('utf8')).to.be(vbAssemblyInfoTemplate(
                { title: 'another title', description: defaultDescription }));
            done();
        });

    });

    it('should replace function results for C#', function(done) {

        var info = assemblyInfo({ description: function(value) { return value + ' and another'; }});

        info.write(csAssemblyInfo);

        info.once('data', function(file) {
            expect(file.isBuffer()).to.be(true);
            expect(file.contents.toString('utf8')).to.be(csAssemblyInfoTemplate(
                { title: defaultTitle, description: 'some description and another' }));
            done();
        });

    });

    it('should replace function results for VB', function(done) {

        var info = assemblyInfo({ description: function(value) { return value + ' and another'; }});

        info.write(vbAssemblyInfo);

        info.once('data', function(file) {
            expect(file.isBuffer()).to.be(true);
            expect(file.contents.toString('utf8')).to.be(vbAssemblyInfoTemplate(
                { title: defaultTitle, description: 'some description and another' }));
            done();
        });

    });

});