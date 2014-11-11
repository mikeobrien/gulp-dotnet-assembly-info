var through = require('through2'),
    gulp = require('gulp-util'),
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
                var regex = new RegExp('(\\[\\s*?assembly\\s*\\:\\s*' + attributeName + '\\s*\\(\\s*\\")(.*?)(\\"\\s*\\)\\s*\\])', 'g');
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

module.exports = assemblyInfo;