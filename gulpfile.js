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
  del([fwkConfig.outputPath]);
});

/**
 * Construction du dossier de build
 */
gulp.task('build', ['copybase', 'copyreveal'], function () {

  // Remplacement du placeholder par le nom de la formation
  return gulp.src([path.join(fwkConfig.frameworkPath, 'index.html')])
    .pipe(g.replace(/(FORMATION_NAME)/g, fwkConfig.slidesPdfName))
    .pipe(gulp.dest(fwkConfig.outputPath));
});

/**
 * Copie du contenu web du framework dans le dossier de build
 */
gulp.task('copybase', ['clean'], function () {

  return gulp.src(
    [
      path.join(fwkConfig.frameworkPath, 'index.html'),
      path.join(fwkConfig.frameworkPath, '*.css'),
      path.join(fwkConfig.frameworkPath, '!(node_modules)/**/*')
    ])
    .pipe(gulp.dest(fwkConfig.outputPath));
});

/**
 * Copie du contenu le Reveal.js dans le dossier de build
 */
gulp.task('copyreveal', ['clean'], function () {

  return gulp.src('./node_modules/reveal.js/!(node_modules)/**/*')
    .pipe(gulp.dest('./build/reveal.js'));
});

/**
 * Serve public folder and watch all changes
 */
gulp.task('serve', ['build'], function () {
  browserSync.init({
    port: fwkConfig.port,
    server: {
      baseDir: [fwkConfig.outputPath, './Slides']
    }
  });

  gulp.watch([
              'Slides/**/*.md',
              'Slides/slides.json',
              'Slides/ressources/**',
              path.join(fwkConfig.outputPath, 'reveal/**'),
              path.join(fwkConfig.outputPath, 'index.html')
            ], browserSync.reload);
});

gulp.task('default', ['serve']);

// TODO
// package
// generateSlidesPDF
// generateCahierExercice
// 'pdf' => ['generateSlidesPDF', 'generateCahierExercice']

