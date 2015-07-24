# gulp-dotnet-assembly-info


[![npm version](http://img.shields.io/npm/v/gulp-dotnet-assembly-info.svg?style=flat)](https://npmjs.org/package/gulp-dotnet-assembly-info) [![build status](http://img.shields.io/travis/mikeobrien/gulp-dotnet-assembly-info.svg?style=flat)](https://travis-ci.org/mikeobrien/gulp-dotnet-assembly-info) [![Dependency Status](http://img.shields.io/david/mikeobrien/gulp-dotnet-assembly-info.svg?style=flat)](https://david-dm.org/mikeobrien/gulp-dotnet-assembly-info) [![npm downloads](http://img.shields.io/npm/dm/gulp-dotnet-assembly-info.svg?style=flat)](https://npmjs.org/package/gulp-dotnet-assembly-info)

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

## Props

Thanks to [Diego Luces](https://github.com/dluces) for adding VB.NET support.

## License
MIT License
