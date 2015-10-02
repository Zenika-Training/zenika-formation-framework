'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

/*
 * Configuration
 */

var packageConfiguration = JSON.parse(fs.readFileSync('./package.json'));
var prefixPdfName = 'Zenika-Formation' + (packageConfiguration.name ? '-' + packageConfiguration.name : '');
var fwkConfig = {
  port: 8000,
  slidesPdfName: prefixPdfName + '-Slides',
  cahierExercicesPdfName: prefixPdfName + '-CahierExercices',
  frameworkPath: __dirname
};

/**
 * Remplacement du placeholder par le nom de la formation
 */
gulp.task('templates', function () {

  return gulp.src([path.join(fwkConfig.frameworkPath, 'index_base.html')])
    .pipe(g.replace(/(FORMATION_NAME)/g, fwkConfig.slidesPdfName))
    .pipe(gulp.dest(fwkConfig.frameworkPath));
});

/**
 * Serve public folder and watch all changes
 */
gulp.task('serve', ['templates'], function () {
  browserSync.init({
    server: {
      baseDir: [fwkConfig.frameworkPath, './node_modules', './Slides']
    }
  });

  gulp.watch([
              'Slides/**/*.md',
              'Slides/slides.json',
              'Slides/ressources/**',
              path.join(fwkConfig.frameworkPath, 'reveal/**'),
              path.join(fwkConfig.frameworkPath, 'index.html')
            ], browserSync.reload);
});

gulp.task('default', ['serve']);
