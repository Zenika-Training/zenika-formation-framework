module.exports = function (grunt) {

    grunt.initConfig({
        connect: {
            options: {
                base: [__dirname, 'Slides/'],
                open: true,
                hostname: 'localhost',
                port: 8000,
                livereload: 32729
            },
            server: {},
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
        var pdfPath = "PDF/CahierExercices.pdf";

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

    grunt.registerTask('default', ['displaySlides']);

};
