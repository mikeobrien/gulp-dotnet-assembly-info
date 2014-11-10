var through = require('through2'),
    PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-dotnet-assembly-info';

function assemblyInfo(attributes) {
    if (!attributes) {
        throw new PluginError(PLUGIN_NAME, 'No assembly info attributes specified.');
    }

    var stream = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            file.contents = file.contents;
        }

        this.push(file);

        cb();
    });

    return stream;
}

module.exports = assemblyInfo;