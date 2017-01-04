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
gulp.task('build', ['copyAppYaml'], function () {

  // Remplacement du placeholder par le nom de la formation
  return gulp.src([path.join(fwkConfig.frameworkPath, 'index.html')])
    .pipe(g.replace(/(FORMATION_NAME)/g, fwkConfig.slidesPdfName))
    .pipe(gulp.dest(fwkConfig.outputPath));
});

gulp.task('copyAppYaml', ['copybase', 'copyreveal', 'copyslides'], function() {
  return gulp.src([path.join(fwkConfig.frameworkPath, 'app.yaml')])
    .pipe(gulp.dest(fwkConfig.outputPath));
});

/**
 * Copie du contenu web du framework dans le dossier de build
 */
gulp.task('copybase', ['clean'], function () {

  return gulp.src(
    [
      //not index.html or slides.html done in `build`
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

  return gulp.src('./node_modules/reveal.js/!(node_modules)/**/*')
    .pipe(gulp.dest('./build/reveal.js'));
});

gulp.task('copyslides', ['clean'], function () {

  return gulp.src([
                  'Slides/**/*.md',
                  'Slides/slides.json',
                  'Slides/ressources*/**'
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

