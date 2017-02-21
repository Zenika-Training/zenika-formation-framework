'use strict';

var fs = require('fs');
var path = require('path');
var del = require('del');
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
  frameworkPath: __dirname,
  outputPath: './build'
};

/**
 * Clean build file
 */
gulp.task('clean', function () {
  del.sync([fwkConfig.outputPath]);
});

/**
 * Construction du dossier de build
 */
gulp.task('build', ['copybase', 'copyreveal', 'copyslides', 'copyIndex', 'copySummary', 'copyAppYaml']);

gulp.task('copyIndex', function() {
  // Remplacement du placeholder par le nom de la formation
  return gulp.src(path.join(fwkConfig.frameworkPath, 'index.html'))
    .pipe(g.replace(/(FORMATION_NAME)/g, fwkConfig.slidesPdfName))
    .pipe(g.rename("slides.html"))
    .pipe(gulp.dest(fwkConfig.outputPath));
});

gulp.task('copySummary', function() {
  return gulp.src([path.join(fwkConfig.frameworkPath, 'summary.html')])
    .pipe(g.rename("index.html"))
    .pipe(gulp.dest(fwkConfig.outputPath));
});

gulp.task('copyAppYaml', function() {
  return gulp.src([path.join(fwkConfig.frameworkPath, 'app.yaml')])
    .pipe(gulp.dest(fwkConfig.outputPath));
});

/**
 * Copie du contenu web du framework dans le dossier de build
 */
gulp.task('copybase', ['clean'], function () {

  return gulp.src(
    [
      // do not include "index.html" or "summary.html" handled by others tasks
      path.join(fwkConfig.frameworkPath, '*.css'),
      path.join(fwkConfig.frameworkPath, 'favicon.png'),
      path.join(fwkConfig.frameworkPath, 'reveal*/**'),
    ])
    .pipe(gulp.dest(fwkConfig.outputPath));
});

/**
 * Copie du contenu le Reveal.js dans le dossier de build
 */
gulp.task('copyreveal', ['clean'], function () {

  return gulp.src(
    [
      '!./node_modules/reveal.js/node_modules{,/**/*}',
      '!./node_modules/reveal.js/test{,/**/*}',
      '!./node_modules/reveal.js/css/theme{,/**/*}',
      '!./node_modules/reveal.js/js/reveal.js',
      '!./node_modules/reveal.js/css/reveal.css',
      '!./node_modules/reveal.js/css/lib{,/**/*}',
      '!./node_modules/reveal.js/Gruntfile.js',
      '!./node_modules/reveal.js/index.html',
      '!./node_modules/reveal.js/LICENSE',
      '!./node_modules/reveal.js/package.json',
      '!./node_modules/reveal.js/README.md',
      './node_modules/reveal.js/**/*',
    ])
    .pipe(gulp.dest('./build/reveal.js'));
});

gulp.task('copyslides', ['clean'], function () {

  return gulp.src(
    [
      'Slides/**/*.md',
      'Slides/slides.json',
      'Slides/ressources*/**',
    ])
    .pipe(gulp.dest('./build/'));
});

/**
 * Serve public folder and watch all changes
 */
gulp.task('serve', ['build'], function () {
  browserSync.init({
    port: fwkConfig.port,
    server: {
      baseDir: [fwkConfig.outputPath, './Slides'],
    },
    browser: ['chrome']
  });

  gulp.watch(
    [
      'Slides/**/*.md',
      'Slides/slides.json',
      'Slides/ressources/**',
      path.join(fwkConfig.outputPath, 'reveal/**'),
      path.join(fwkConfig.outputPath, 'index.html'),
    ], browserSync.reload);
});

gulp.task('default', ['serve']);

// TODO
// package
// generateSlidesPDF
// generateCahierExercice
// 'pdf' => ['generateSlidesPDF', 'generateCahierExercice']

