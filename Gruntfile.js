module.exports = function (grunt) {

    var port = grunt.option('port') || 8000;
    var name = grunt.config('zenika.formation.name') || null;

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
                        cwd: ".",
                        dest: "<%= dist %>",
                        src: [
                            "app.yaml"
                        ]
                    },
                    {
                        expand: true,
                        //cwd: ".",
                        cwd: "node_modules/zenika-formation-framework",
                        dest: "<%= dist %>/",
                        src: ["index.html", "styleCahierExercice.css", "reveal/**", "node_modules/reveal.js/**"]
                    }
                ]
            }
        }
    });

    grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-connect/tasks');
    grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-watch/tasks');
    grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-clean/tasks');
    grunt.loadTasks(__dirname + '/node_modules/grunt-contrib-copy/tasks');


    //TODO: 'rev'
    grunt.registerTask('package', ['clean:dist', 'copy:dist']);


    grunt.registerTask('displaySlides', ['connect:server', 'watch']);

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
        var pdfPath = 'PDF/Zenika-Formation' + (name ? '-' + name : '') + '-CahierExercices.pdf';
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
                    .replace(/!\[([\w|\s|\.]*)][\s]*\(([\w|\s|\-|\.|\/]*)\)/g, function (match, p1, p2, src) {
                        return '![' + p1 + '](' + path.resolve('CahierExercices', p2) + ')';
                    })
                    .replace(/<img (.*)src="([\w|\-|\.|\/]*)"(.*)\/?>/g, function (match, p1, p2, p3, src) {
                        return '<img ' + p1 + 'src="' + path.resolve('CahierExercices', p2) + '"' + p3 + '>';
                    })
                    .replace(/\{Titre-Formation}/g, function () {
                        return name;
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
            'PDF/Zenika-Formation' + (name ? '-' + name : '') + '-Slides.pdf'
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
