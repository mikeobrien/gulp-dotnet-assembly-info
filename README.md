# grunt-dotnet-assembly-info
[![Build Status](https://api.travis-ci.org/mikeobrien/gulp-dotnet-assembly-info.png?branch=master)](https://travis-ci.org/mikeobrien/gulp-dotnet-assembly-info)
[![NPM version](https://badge.fury.io/js/gulp-dotnet-assembly-info.png)](https://npmjs.org/package/gulp-dotnet-assembly-info)

[Gulp](http://gulpjs.com/) plugin for modifying C# assembly info files.

## Install

```bash
$ npm install gulp-dotnet-assembly-info --save
```

## Usage

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
            version: '2.0.3.2345',
            fileVersion: '2.0.3.2345'
        }))
        .pipe(gulp.dest('.'));
});
```

## License
MIT License
