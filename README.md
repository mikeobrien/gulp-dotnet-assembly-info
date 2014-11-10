# gulp-dotnet-assembly-info
[![Build Status](https://api.travis-ci.org/mikeobrien/gulp-dotnet-assembly-info.png?branch=master)](https://travis-ci.org/mikeobrien/gulp-dotnet-assembly-info)
[![npm version](https://badge.fury.io/js/gulp-dotnet-assembly-info.svg)](http://badge.fury.io/js/gulp-dotnet-assembly-info)

[Gulp](http://gulpjs.com/) plugin for modifying C# assembly info files.

## Install

```bash
$ npm install gulp-dotnet-assembly-info --save
```

## Usage

Simply pass in an object containing the attibutes and their replacements. The replacement can be a value or a function. A function is passed the value specified in the original assembly info file and returns the replacement value. The convention for attribute names is the name without the `Assembly` prefix and [camel cased](http://en.wikipedia.org/wiki/CamelCase). So an attribute name of `fileVersion` will be converted to `AssemblyFileVersion`. The files can simply be replaced by piping them to the same location (`.pipe(gulp.dest('.'))`) or to a new location.

```js
var gulp = require('gulp'),
    assemblyInfo = require('gulp-dotnet-assembly-info');

gulp.task('assemblyInfo', function() {
    gulp.src('**/AssemblyInfo.cs')
        .pipe(assemblyInfo({
            title: 'Planet Express Website',
            description: 'Shipping and tracking website.', 
            configuration: 'Release', 
            company: 'Planet Express', 
            product: 'Planet Express Website', 
            copyright: 'Copyright 3002 © Planet Express', 
            trademark: 'Planet Express', 
            culture: 'div-MV',
            version: function(value) { return value + '.2345'; },
            fileVersion: function(value) { return '2.0.3.2345'; },
            ...
        }))
        .pipe(gulp.dest('.'));
});
```

## License
MIT License
