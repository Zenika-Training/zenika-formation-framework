module.exports = function (grunt) {

    var port = grunt.option('port') || 8000;
    var name = grunt.config('zenika.formation.name') || null;

    grunt.initConfig({
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
                files: ['Slides/*.md', 'Slides/slides.json']
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
        }
    });

    grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-connect/tasks');
    grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-watch/tasks');

    grunt.registerTask('displaySlides', ['connect:server', 'watch']);

    grunt.registerTask('generateCahierExercice', function () {
        var done = this.async();

        var markdownpdf = require("markdown-pdf");
        var cssPath = __dirname + "/styleCahierExercice.css";
        var pdfPath = 'PDF/Zenika-Formation' + (name ? '-'+name : '') + '-CahierExercices.pdf';

        console.log("Using CSS file", cssPath);

        markdownpdf({cssPath: cssPath})
            .from("CahierExercices/Cahier.md")
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
            'PDF/Zenika-Formation' + (name ? '-'+name : '') + '-Slides.pdf'
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
