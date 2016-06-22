var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {

  var port = grunt.option('port') || 8000;
  var configFormation = grunt.file.readJSON('package.json');
  var prefixPdfName = 'Zenika-Formation' + (configFormation.name ? '-' + configFormation.name : '');
  var slidesPdfName = prefixPdfName + '-Slides';
  var cahierExercicesPdfName = prefixPdfName + '-CahierExercices';
  var frameworkPath = __dirname;

  function resolveNpmModulesPath(npmModulePath) {
    try {
      fs.accessSync(pathIfNpm2(npmModulePath));
      return pathIfNpm2(npmModulePath);
    } catch (e) {
      // let's try npm3
    }
    return pathIfNpm3(npmModulePath);
  }

  function pathIfNpm2(npmModulePath) {
    return path.resolve(frameworkPath, 'node_modules', npmModulePath);
  }

  function pathIfNpm3(npmModulePath) {
    return path.resolve(frameworkPath, '..', npmModulePath);
  }

  grunt.initConfig({
    dist: 'dist',
    connect: {
      options: {
        base: [frameworkPath, 'Slides/', pathIfNpm2(''), pathIfNpm3('')],
        hostname: '0.0.0.0',
        port: port
      },
      server: {
        options: {
          livereload: 32729,
          open: {
            target: 'http://localhost:' + port
            // appName: 'chrome' // commenté temps de faire la bonne mécanique cross-OS
          }
        }
      },
      print: {},
      keepalive: {
        options: {
          keepalive: true
        }
      },
      dist: {
        options: {
          base: 'dist/',
          hostname: '0.0.0.0',
          port: 8888,
          keepalive: true
        }
      }
    },
    watch: {
      options: {
        livereload: 32729
      },
      content: {
        files: ['Slides/**/*.md', 'Slides/slides.json']
      },
      ressources: {
        files: 'Slides/ressources/**'
      },
      reveal: {
        files: frameworkPath + '/reveal/**'
      },
      index: {
        files: frameworkPath + '/index.html'
      },
      gruntfile: {
        files: frameworkPath + '/Gruntfile.js'
      }
    },
    clean: {
      dist: ['dist/**']
    },
    copy: {
      rename: {
        files: [
          {
            expand: true,
            cwd: frameworkPath,
            src: 'index.html',
            dest: 'slides.html',
            rename: function (dest) {
              return frameworkPath + '/' + dest;
            }
          }, {
            expand: true,
            cwd: frameworkPath,
            src: 'summary.html',
            dest: 'index.html',
            rename: function (dest) {
              return frameworkPath + '/' + dest;
            }
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'Slides',
            dest: '<%= dist %>',
            src: [
              './**'
            ]
          }, {
            expand: true,
            dot: true,
            cwd: 'PDF',
            dest: '<%= dist %>/pdf',
            src: [
              '*.pdf'
            ]
          }, {
            expand: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'styleCahierExercice.css',
              'reveal/**',
            ].concat([
              'reveal.js/css/reveal.min.css',
              'reveal.js/lib/js/head.min.js',
              'reveal.js/js/reveal.min.js',
              'reveal.js/css/print/pdf.css',
              'reveal.js/plugin/**'
            ].map(resolveNpmModulesPath).map(path.relative.bind(null, frameworkPath)))
          }, {
            expand: true,
            cwd: frameworkPath,
            flatten: true,
            dest: '<%= dist %>',
            src: [
              'reveal/theme-zenika/favicon.png'
            ]
          }, {
            expand: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'index.html'
            ],
            rename: function (dest) {
              return dest + '/slides.html';
            }
          }, {
            expand: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'summary.html'
            ],
            rename: function (dest) {
              return dest + '/index.html';
            }
          }, {
            expand: true,
            dot: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'app.yaml'
            ]
          }
        ]
      }
    },
    sed: {
      dist: {
        path: [frameworkPath + '/index.html'],
        pattern: 'FORMATION_NAME',
        replacement: slidesPdfName,
        recursive: true
      },
      description: {
        path: [frameworkPath + '/summary.html'],
        pattern: 'FORMATION_DESCRIPTION',
        replacement: configFormation.description,
        recursive: true
      },
      slidesPdf: {
        path: [frameworkPath + '/summary.html'],
        pattern: 'FORMATION_SLIDES',
        replacement: slidesPdfName,
        recursive: true
      },
      cahierExercicesPdf: {
        path: [frameworkPath + '/summary.html'],
        pattern: 'FORMATION_CAHIER',
        replacement: cahierExercicesPdfName,
        recursive: true
      },
      github: {
        path: [frameworkPath + '/summary.html'],
        pattern: 'FORMATION_GITHUB',
        replacement: configFormation.repository.url,
        recursive: true
      },
      homepage: {
        path: [frameworkPath + '/summary.html'],
        pattern: 'FORMATION_HOMEPAGE',
        replacement: configFormation.homepage,
        recursive: true
      },
      gcloudDeployName: {
        path: [frameworkPath + '/gcloud-deploy.sh'],
        pattern: 'FORMATION_DEPLOY_NAME',
        replacement: configFormation.config.deploy.name,
        recursive: true
      }
    },
    filerev: {
      markdown: {src: 'dist/**/*.md'},
      ressources: {src: 'dist/ressources/**'},
      slidesJson: {src: 'dist/slides.json'},
      runJs: {src: 'dist/reveal/run.js'}
    },
    filerev_replace: {
      options: {
        assets_root: 'dist'
      },
      compiled_assets: {
        src: ['dist/slides.html', 'dist/slides*.json', 'dist/**/*.md']
      },
      views: {
        options: {
          views_root: 'dist/reveal'
        },
        src: 'dist/reveal/run*.js'
      }
    }
  });

  [
    'grunt-sed/tasks',
    'grunt-contrib-connect/tasks',
    'grunt-contrib-watch/tasks',
    'grunt-contrib-clean/tasks',
    'grunt-contrib-copy/tasks',
    'grunt-filerev/tasks',
    'grunt-filerev-replace/tasks',
  ].map(resolveNpmModulesPath).forEach(grunt.loadTasks);

  grunt.registerTask('package', ['sed', 'pdf', 'clean:dist', 'copy:dist', 'filerev-all']);
  grunt.registerTask('filerev-all', ['filerev', 'filerev_replace']);

  grunt.registerTask('displaySlides', ['sed', 'connect:server', 'watch']);

  grunt.registerTask('generateCahierExercice', function () {
    var done = this.async();

    var markdownpdf = require('markdown-pdf'),
      split = require('split'),
      through = require('through'),
      duplexer = require('duplexer');

    try {
      var parts = require(path.resolve(frameworkPath, '..', '..', 'CahierExercices', 'parts.json'));
    }
    catch (e) {
      parts = ['Cahier.md'];
    }
    var cssPath = path.resolve(frameworkPath, 'styleCahierExercice.css');
    var highlightPath = path.resolve(frameworkPath, 'reveal', 'theme-zenika', 'code.css');
    var pdfPath = 'PDF/' + cahierExercicesPdfName + '.pdf';
    var files = parts.map(function (f) {
      return 'CahierExercices/' + f;
    });

    console.log('Using CSS file', cssPath);
    console.log('Using highlightPath file', highlightPath);
    console.log('Using md sources files', files);


    function preprocessMd() {
      var splitter = split();

      var transform = through(function (data) {
        var out = data
            .replace(/!\[([^\]]*)][\s]*\(([^\)]*)\)/g, function (match, p1, p2) {
              return '![' + p1 + '](' + path.resolve('CahierExercices', p2) + ')';
            })
            .replace(/<img (.*)src=["|']([^\"\']*)["|'](.*)>/g, function (match, p1, p2, p3, src) {
              return '<img ' + p1 + 'src="' + path.resolve('CahierExercices', p2) + '"' + p3 + '>';
            })
            .replace(/\{Titre-Formation}/g, function () {
              return configFormation.name;
            })
          + '\n';
        this.queue(out);
      });

      splitter.pipe(transform);

      return duplexer(splitter, transform);
    }

    markdownpdf({
      cssPath: cssPath,
      highlightCssPath: highlightPath,
      preProcessMd: preprocessMd,
      remarkable: {html: true},
      cwd: frameworkPath
    })
      .concat.from(files)
      .to(pdfPath,
      function () {
        console.log('PDF généré: ' + pdfPath);
        done();
      }
    );
  });

  grunt.registerTask('doGenerateSlidesPDF', function () {
    var childProcess = require('child_process');
    var phantomjs = require('phantomjs');
    var binPath = phantomjs.path;
    var done = grunt.task.current.async();

    var revealFullPath = path.join(frameworkPath, 'reveal/plugins/print-pdf/print-pdf.js');

    var debugMode = false;

    var childArgs = [
      revealFullPath,
      'http://localhost:' + port + '?print-pdf',
      'PDF/' + slidesPdfName + '.pdf',
      debugMode
    ];

    childProcess.execFile(binPath, childArgs, function (error, stdout, stderr) {
      grunt.log.writeln(stdout);
      grunt.log.writeln(stderr);
      done(error);
    });
  });


  grunt.registerTask('generateSlidesPDF', ['connect:print', 'doGenerateSlidesPDF']);

  grunt.registerTask('pdf', ['generateSlidesPDF', 'generateCahierExercice']);

  grunt.registerTask('default', ['displaySlides']);

};
