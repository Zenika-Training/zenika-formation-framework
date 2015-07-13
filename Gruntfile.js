module.exports = function (grunt) {

  var port = grunt.option('port') || 8000;
  var configFormation = grunt.file.readJSON('package.json');
  var prefixPdfName = 'Zenika-Formation' + (configFormation.name ? '-' + configFormation.name : '');
  var slidesPdfName = prefixPdfName + '-Slides';
  var cahierExercicesPdfName = prefixPdfName + '-CahierExercices';
  var frameworkPath = 'node_modules/zenika-formation-framework';

  grunt.initConfig({
    dist: "dist",
    connect: {
      options: {
        base: [__dirname, 'Slides/'],
        hostname: '0.0.0.0',
        port: port
      },
      server: {
        options: {
          livereload: 32729,
          open: 'http://localhost:' + port
        }
      },
      print: {},
      keepalive: {
        options: {
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
        files: __dirname + '/reveal/**'
      },
      index: {
        files: __dirname + '/index.html'
      },
      gruntfile: {
        files: __dirname + '/Gruntfile.js'
      }
    },
    clean: {
      dist: ['dist/**']
    },
    copy: {
      dist: {
        files: [
        {
          expand: true,
          dot: true,
          cwd: "Slides",
          dest: "<%= dist %>",
          src: [
          "./**"
          ]
        },
        {
          expand: true,
          dot: true,
          cwd: "PDF",
          dest: "<%= dist %>",
          src: [
          "*.pdf"
          ]
        },
        {
          expand: true,
          cwd: frameworkPath,
          dest: "<%= dist %>",
          src: [
          "styleCahierExercice.css",
          "reveal/**",
          "node_modules/reveal.js/css/reveal.min.css",
          "node_modules/reveal.js/lib/js/head.min.js",
          "node_modules/reveal.js/js/reveal.min.js",
          "node_modules/reveal.js/css/print/pdf.css",
          "node_modules/reveal.js/plugin/**"
          ]
        },
        {
          expand: true,
          cwd: frameworkPath,
          flatten: true,
          dest: "<%= dist %>",
          src: [
          "reveal/theme-zenika/favicon.png"
          ]
        },
        {
          expand: true,
          cwd: frameworkPath,
          dest: "<%= dist %>",
          src: [
          "index.html"
          ],
          rename: function(dest, src) {
            return dest + "/slides.html";
          }
        },
        {
          expand: true,
          cwd: frameworkPath,
          dest: "<%= dist %>",
          src: [
          "summary.html"
          ],
          rename: function(dest, src) {
            return dest + "/index.html";
          }
        },
        {
          expand: true,
          dot: true,
          cwd: frameworkPath,
          dest: "<%= dist %>",
          src: [
          "app.yaml"
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
      yamlName: {
        path: [frameworkPath + '/app.yaml'],
        pattern: 'FORMATION_DEPLOY_NAME',
        replacement: configFormation.config.deploy.name,
        recursive: true
      },
      yamlVersion: {
        path: [frameworkPath + '/app.yaml'],
        pattern: 'FORMATION_DEPLOY_VERSION',
        replacement: configFormation.config.deploy.version.replace(/\./g, '-'),
        recursive: true
      }
    },
    filerev: {
      markdown: { src: 'dist/**/*.md' },
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

  grunt.loadTasks(__dirname + '/node_modules/grunt-sed/tasks');
  grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-connect/tasks');
  grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-watch/tasks');
  grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-clean/tasks');
  grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-copy/tasks');
  grunt.loadTasks(__dirname + '/node_modules/grunt-filerev/tasks');
  grunt.loadTasks(__dirname + '/node_modules/grunt-filerev-replace/tasks');

  grunt.registerTask('package', ['sed', 'pdf', 'clean:dist', 'copy:dist', 'filerev-all']);
  grunt.registerTask('filerev-all', ['filerev', 'filerev_replace']);

  grunt.registerTask('displaySlides', ['sed', 'connect:server', 'watch']);

  grunt.registerTask('generateCahierExercice', function () {
    var done = this.async();

    var markdownpdf = require("markdown-pdf"),
    path = require('path'),
    split = require("split"),
    through = require("through"),
    duplexer = require("duplexer");

    try {
      var parts = require(path.resolve(__dirname, "..", "..", "CahierExercices", "parts.json"));
    }
    catch (e) {
      parts = ["Cahier.md"];
    }
    var cssPath = path.resolve(__dirname, "styleCahierExercice.css");
    var highlightPath = path.resolve(__dirname, "reveal", "theme-zenika", "code.css");
    var pdfPath = 'PDF/' + cahierExercicesPdfName + '.pdf';
    var files = parts.map(function (f) {
      return "CahierExercices/" + f;
    });

    console.log("Using CSS file", cssPath);
    console.log("Using highlightPath file", highlightPath);
    console.log("Using md sources files", files);


    function preprocessMd() {
      var splitter = split();

      var transform = through(function (data) {
        var out = data
        .replace(/!\[([^\]]*)][\s]*\(([^\)]*)\)/g, function (match, p1, p2, src) {
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
      cwd: __dirname
    })
    .concat.from(files)
    .to(pdfPath,
      function (v) {
        console.log("PDF généré: " + pdfPath);
        done();
      }
      );
  });

  grunt.registerTask('doGenerateSlidesPDF', function () {
    var
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    path = require('path'),
    binPath = phantomjs.path,
    done = grunt.task.current.async()
    ;

    var fullPath = path.join(__dirname, 'reveal/plugins/print-pdf/print-pdf.js');

    var childArgs = [
    fullPath,
    'http://localhost:' + port + '?print-pdf',
    'PDF/' + slidesPdfName + '.pdf'
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
