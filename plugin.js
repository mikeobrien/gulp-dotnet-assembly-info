var through = require('through2'),
    gulp = require('gulp-util'),
    fs = require('fs'),
    PluginError = gulp.PluginError;

var PLUGIN_NAME = 'gulp-dotnet-assembly-info';

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function assemblyInfo(config) {

    if (!config) {
        throw new PluginError(PLUGIN_NAME, 'No configuration specified.');
    }

    attributes = Object.keys(config);

    if (attributes.length === 0) {
        throw new PluginError(PLUGIN_NAME, 'No attributes specified.');
    }

    var stream = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            gulp.log('Updating assembly info file \'' + file.path + '\'...');

            var assemblyInfo = file.contents.toString();

            attributes.forEach(function(attribute) {
                var attributeName = 'Assembly' + capitalize(attribute);
                var regex = new RegExp('([\\[<]\\s*?[aA]ssembly\\s*\\:\\s*' + attributeName + '\\s*\\(\\s*\\")(.*?)(\\"\\s*\\)\\s*[\\]>])', 'g');
                var replacement = config[attribute];
                assemblyInfo = assemblyInfo.replace(regex, function(match, p1, p2, p3) {
                    var value = replacement instanceof Function ? replacement(p2) : replacement;
                    gulp.log('\tSetting attribute \'' + attributeName + '\' to \'' + value + '\'.');
                    return p1 + value + p3;
                });
            });
            file.contents = new Buffer(assemblyInfo);
        }

        this.push(file);

        cb();
    });

    return stream;
}

assemblyInfo.getAssemblyMetadataFromFileSync = function(filePath){
    
    var assemblyInfoFileContent = fs.readFileSync(filepath, "utf8");

    return assemblyInfo.getAssemblyMetadata(assemblyInfoFileContent)
}

assemblyInfo.getAssemblyMetadata = function(assemblyInfoFileContent){
    
    var regex = new RegExp('^\\s*[\\[<]\\s*[aA]ssembly\\s*:\\s*(\\s*[a-zA-Z][^(\\s]+)\\s*\\(\\s*([^)]+)\\s*\\)\\s*[\\]>]', 'gm');

    var regex = /^\s*[\[<]\s*[aA]ssembly\s*:\s*(\s*[a-zA-Z][^(\s]+)\s*\(\s*([^)]+)\s*\)\s*[\]>]/gm;
        
    var output = {};
    while ((m = regex.exec(assemblyInfoFileContent)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        var value = m[2].trim();
        
        if(value.toLowerCase() === 'true'){
            value = true;
        }
        else if(value.toLowerCase()  === 'false'){ 
            value = false;
        }
        else if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"'){
            value = value.substr(1, value.length -2);
        }
        
        output[m[1]] = value;
    }
    return output;
}
module.exports = assemblyInfo;