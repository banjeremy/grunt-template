module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({

    copy: {
      build: {
        cwd: 'source',
        src: [ '**/images/*', '**/*.js', '!**/*.jade' ],
        dest: 'build',
        expand: true,
        flatten: true
      },
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/app.min.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/app.min.js' ]
      },
    },

    less: {
      production: {
        options: {
        },
        cwd: 'source',
        files: {
          'build/app.css': [ 'source/**/*.less' ]
        }
      }
    },

    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },

    cssmin: {
      build: {
        files: {
          'build/app.min.css': [ 'build/**/*.css' ]
        }
      }
    },

    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'build/app.min.js': [ 'build/**/*.js' ]
        }
      }
    },

    jade: {
      compile: {
        options: {
          data: {}
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: [ '**/*.jade' ],
          dest: 'build',
          ext: '.html'
        }]
      }
    },

    dom_munger:{
      update: {
        options: {
          remove: ['script[data-remove!="false"]','link[data-remove!="false"]'],
          append: [
            {selector:'body',html:'<script src="app.min.js"></script>'},
            {selector:'head',html:'<link rel="stylesheet" href="app.min.css">'}
          ]
        },
        src:'build/index.html',
        dest: 'build/index.html'
      }
    },

    watch: {
      stylesheets: {
        files: 'source/**/*.less',
        tasks: [ 'stylesheets' ]
      },
      scripts: {
        files: 'source/**/*.js',
        tasks: [ 'scripts' ]
      },
      jade: {
        files: 'source/**/*.jade',
        tasks: [ 'jade', 'dom_munger' ]
      },
      copy: {
        files: [ 'source/**', '!source/**/*.less', '!source/**/*.js', '!source/**/*.jade' ],
        tasks: [ 'copy' ]
      }
    },

    connect: {
      server: {
        options: {
          port: 4000,
          base: 'build',
          hostname: '*'
        }
      }
    }

  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-dom-munger');

  // define the tasks
  grunt.registerTask(
    'stylesheets',
    'Compiles the stylesheets.',
    [ 'less', 'autoprefixer', 'cssmin', 'clean:stylesheets' ]
  );

  grunt.registerTask(
    'scripts',
    'Compiles the JavaScript files.',
    [ 'uglify', 'clean:scripts' ]
  );

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean:build', 'copy', 'jade', 'dom_munger', 'stylesheets', 'scripts' ]
  );

  grunt.registerTask(
    'default',
    'Watches the project for changes, automatically builds them and runs a server.',
    [ 'build', 'connect', 'watch' ]
  );
};
