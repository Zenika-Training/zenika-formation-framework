const fs = require('fs');
const path = require('path');
const git = require('git-rev-sync');
const generatePdfWithChrome = require('./pdf/generate-pdf-with-chrome');

module.exports = function gruntConfig(grunt) {
  const port = grunt.option('port') || 8000;
  const configFormation = grunt.file.readJSON('package.json');
  const prefixPdfName = `Zenika-Formation${configFormation.name ? `-${configFormation.name}` : ''}`;
  const slidesPdfName = `${prefixPdfName}-Slides`;
  const cahierExercicesPdfName = `${prefixPdfName}-CahierExercices`;
  const date = new Date().toISOString().slice(0, 10);
  const version = `${date}#${git.short()}`;
  const frameworkPath = __dirname;

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
        port,
      },
      server: {
        options: {
          livereload: 32729,
          open: {
            target: `http://localhost:${port}`,
            // appName: 'chrome' // commenté temps de faire la bonne mécanique cross-OS
          },
        },
      },
      print: {},
      keepalive: {
        options: {
          keepalive: true,
        },
      },
      dist: {
        options: {
          base: 'dist/',
          hostname: '0.0.0.0',
          port: 8888,
          keepalive: true,
        },
      },
    },
    watch: {
      options: {
        livereload: 32729,
      },
      content: {
        files: ['Slides/**/*.md', 'Slides/slides.json'],
      },
      ressources: {
        files: 'Slides/ressources/**',
      },
      reveal: {
        files: `${frameworkPath}/reveal/**`,
      },
      index: {
        files: `${frameworkPath}/index.html`,
      },
      gruntfile: {
        files: `${frameworkPath}/Gruntfile.js`,
      },
    },
    clean: {
      dist: ['dist/**'],
    },
    copy: {
      rename: {
        files: [
          {
            expand: true,
            cwd: frameworkPath,
            src: 'index.html',
            dest: 'slides.html',
            rename(dest) {
              return `${frameworkPath}/${dest}`;
            },
          }, {
            expand: true,
            cwd: frameworkPath,
            src: 'summary.html',
            dest: 'index.html',
            rename(dest) {
              return `${frameworkPath}/${dest}`;
            },
          },
        ],
      },
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'Slides',
            dest: '<%= dist %>',
            src: [
              './**',
            ],
          },
          {
            expand: true,
            dot: true,
            cwd: 'PDF',
            dest: '<%= dist %>/pdf',
            src: [
              '*.pdf',
            ],
          },
          {
            expand: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'styleCahierExercice.css',
              'reveal/**',
            ],
          },
          {
            expand: true,
            cwd: path.dirname(resolveNpmModulesPath('reveal.js')),
            dest: '<%= dist %>',
            src: [
              'reveal.js/css/reveal.min.css',
              'reveal.js/lib/js/head.min.js',
              'reveal.js/js/reveal.min.js',
              'reveal.js/css/print/pdf.css',
              'reveal.js/plugin/**',
            ],
          },
          {
            expand: true,
            cwd: path.dirname(resolveNpmModulesPath('prismjs')),
            dest: '<%= dist %>',
            src: [
              'prismjs/prism.js',
              'prismjs/components/prism-bash.js',
              'prismjs/components/prism-clike.js',
              'prismjs/components/prism-go.js',
              'prismjs/components/prism-java.js',
              'prismjs/components/prism-json.js',
              'prismjs/components/prism-typescript.js',
              'prismjs/components/prism-scala.js',
              'prismjs/themes/prism.css',
            ],
          },
          {
            expand: true,
            cwd: frameworkPath,
            flatten: true,
            dest: '<%= dist %>',
            src: [
              'reveal/theme-zenika/favicon.png',
            ],
          },
          {
            expand: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'index.html',
            ],
            rename(dest) {
              return `${dest}/slides.html`;
            },
          },
          {
            expand: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'summary.html',
            ],
            rename(dest) {
              return `${dest}/index.html`;
            },
          },
          {
            expand: true,
            dot: true,
            cwd: frameworkPath,
            dest: '<%= dist %>',
            src: [
              'app.yaml',
            ],
          },
        ],
      },
    },
    sed: {
      title: {
        path: [`${frameworkPath}/index.html`],
        pattern: 'FORMATION_NAME',
        replacement: slidesPdfName,
        recursive: true,
      },
      version: {
        path: [`${frameworkPath}/reveal/theme-zenika/theme.css`],
        pattern: 'VERSION',
        replacement: version,
        recursive: true,
      },
      dist: {
        path: [`${frameworkPath}/app.yaml`],
        pattern: 'runtime: python27',
        replacement: `service: ${configFormation.name}\nruntime: python27`,
        recursive: true,
      },
      description: {
        path: [`${frameworkPath}/summary.html`],
        pattern: 'FORMATION_DESCRIPTION',
        replacement: configFormation.description,
        recursive: true,
      },
      slidesPdf: {
        path: [`${frameworkPath}/summary.html`],
        pattern: 'FORMATION_SLIDES',
        replacement: slidesPdfName,
        recursive: true,
      },
      cahierExercicesPdf: {
        path: [`${frameworkPath}/summary.html`],
        pattern: 'FORMATION_CAHIER',
        replacement: cahierExercicesPdfName,
        recursive: true,
      },
      github: {
        path: [`${frameworkPath}/summary.html`],
        pattern: 'FORMATION_GITHUB',
        replacement: configFormation.repository.url,
        recursive: true,
      },
      homepage: {
        path: [`${frameworkPath}/summary.html`],
        pattern: 'FORMATION_HOMEPAGE',
        replacement: configFormation.homepage,
        recursive: true,
      },
    },
    filerev: {
      markdown: { src: 'dist/**/*.md' },
      ressources: { src: 'dist/ressources/**' },
      slidesJson: { src: 'dist/slides.json' },
      runJs: { src: 'dist/reveal/run.js' },
    },
    filerev_replace: {
      options: {
        assets_root: 'dist',
      },
      compiled_assets: {
        src: ['dist/slides.html', 'dist/slides*.json', 'dist/**/*.md'],
      },
      views: {
        options: {
          views_root: 'dist/reveal',
        },
        src: 'dist/reveal/run*.js',
      },
    },
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

  grunt.registerTask('package', ['sed', 'justPdf', 'clean:dist', 'copy:dist', 'filerev-all']);
  grunt.registerTask('filerev-all', ['filerev', 'filerev_replace']);

  grunt.registerTask('displaySlides', ['sed', 'connect:server', 'watch']);

  grunt.registerTask('generateCahierExercice', function generateCahierExercice() {
    const done = this.async();

    const markdownpdf = require('markdown-pdf');
    const split = require('split');
    const through = require('through');
    const duplexer = require('duplexer');

    let parts;
    try {
      parts = require(path.resolve(frameworkPath, '..', '..', 'CahierExercices', 'parts.json'));
    } catch (e) {
      parts = ['Cahier.md'];
    }
    const cssPath = path.resolve(frameworkPath, 'styleCahierExercice.css');
    const highlightPath = path.resolve(frameworkPath, 'reveal', 'theme-zenika', 'code.css');
    const pdfPath = `PDF/${cahierExercicesPdfName}.pdf`;
    const files = parts.map(f => `CahierExercices/${f}`);

    console.log('Using CSS file', cssPath);
    console.log('Using highlightPath file', highlightPath);
    console.log('Using md sources files', files);


    function preprocessMd() {
      const splitter = split();

      const transform = through(function preprocessMdStream(data) {
        const out = `${data
            .replace(/!\[([^\]]*)][\s]*\(([^)]*)\)/g, (match, p1, p2) => `![${p1}](${path.resolve('CahierExercices', p2)})`)
            .replace(/<img (.*)src=["|']([^"']*)["|'](.*)>/g, (match, p1, p2, p3) => `<img ${p1}src="${path.resolve('CahierExercices', p2)}"${p3}>`)
            .replace(/\{Titre-Formation}/g, () => configFormation.name)
           }\n`;
        this.queue(out);
      });

      splitter.pipe(transform);

      return duplexer(splitter, transform);
    }

    markdownpdf({
      cssPath,
      highlightCssPath: highlightPath,
      preProcessMd: preprocessMd,
      remarkable: { html: true },
      cwd: frameworkPath,
    })
      .concat.from(files)
      .to(pdfPath,
      () => {
        console.log(`PDF généré: ${pdfPath}`);
        done();
      });
  });

  grunt.registerTask('doGenerateSlidesPDF', async function doGenerateSlidesPDF() {
    const done = this.async();
    try {
      const pdf = await generatePdfWithChrome(`http://localhost:${port}?print-pdf`, {
        landscape: true,
        printBackground: true,
        // Paper size is in inches, this corresponds to A4
        paperWidth: 8.27,
        paperHeight: 11.69,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
      });
      grunt.file.write(`PDF/${slidesPdfName}.pdf`, pdf, { encoding: 'base64' });
      done();
    } catch (err) {
      grunt.log.error(err);
      done(false);
    }
  });


  grunt.registerTask('generateSlidesPDF', ['connect:print', 'doGenerateSlidesPDF']);

  grunt.registerTask('justPdf', ['generateSlidesPDF', 'generateCahierExercice']);

  grunt.registerTask('pdf', ['sed', 'justPdf']);

  grunt.registerTask('default', ['displaySlides']);
};
