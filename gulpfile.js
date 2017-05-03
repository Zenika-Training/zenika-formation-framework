

const fs = require('fs');
const path = require('path');
const del = require('del');
const gulp = require('gulp');
const g = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

/*
 * Configuration
 */

const packageConfiguration = JSON.parse(fs.readFileSync('./package.json'));
const prefixPdfName = `Zenika-Formation${packageConfiguration.name ? `-${packageConfiguration.name}` : ''}`;
const fwkConfig = {
  port: 8000,
  slidesPdfName: `${prefixPdfName}-Slides`,
  cahierExercicesPdfName: `${prefixPdfName}-CahierExercices`,
  frameworkPath: __dirname,
  outputPath: './build',
};

/**
 * Clean build file
 */
gulp.task('clean', () => {
  del.sync([fwkConfig.outputPath]);
});

/**
 * Construction du dossier de build
 */
gulp.task('build', ['copybase', 'copyreveal', 'copyslides', 'copyIndex', 'copySummary', 'copyAppYaml']);

gulp.task('copyIndex', () =>
  // Remplacement du placeholder par le nom de la formation
   gulp.src(path.join(fwkConfig.frameworkPath, 'index.html'))
    .pipe(g.replace(/(FORMATION_NAME)/g, fwkConfig.slidesPdfName))
    .pipe(g.rename('slides.html'))
    .pipe(gulp.dest(fwkConfig.outputPath)));

gulp.task('copySummary', () => gulp.src([path.join(fwkConfig.frameworkPath, 'summary.html')])
    .pipe(g.rename('index.html'))
    .pipe(gulp.dest(fwkConfig.outputPath)));

gulp.task('copyAppYaml', () => gulp.src([path.join(fwkConfig.frameworkPath, 'app.yaml')])
    .pipe(gulp.dest(fwkConfig.outputPath)));

/**
 * Copie du contenu web du framework dans le dossier de build
 */
gulp.task('copybase', ['clean'], () => gulp.src(
  [
      // do not include "index.html" or "summary.html" because they are handled by others tasks
    path.join(fwkConfig.frameworkPath, '*.css'),
    path.join(fwkConfig.frameworkPath, 'favicon.png'),
    path.join(fwkConfig.frameworkPath, 'reveal*/**'),
  ])
    .pipe(gulp.dest(fwkConfig.outputPath)));

/**
 * Copie du contenu le Reveal.js dans le dossier de build
 */
gulp.task('copyreveal', ['clean'], () => gulp.src(
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
    .pipe(gulp.dest('./build/reveal.js')));

gulp.task('copyslides', ['clean'], () => gulp.src(
  [
    'Slides/**/*.md',
    'Slides/slides.json',
    'Slides/ressources*/**',
  ])
    .pipe(gulp.dest('./build/')));

/**
 * Serve public folder and watch all changes
 */
gulp.task('serve', ['build'], () => {
  browserSync.init({
    port: fwkConfig.port,
    server: {
      baseDir: [fwkConfig.outputPath, './Slides'],
    },
    browser: ['chrome'],
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

