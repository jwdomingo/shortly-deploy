module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/main.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dist: {
        src: 'public/dist/main.js',
        dest: 'public/dist/main.js'
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'app/**/*.js',
        'public/client/*.js',
        '*.js'
      ]
    },

    deploy: {

    },

    cssmin: {
      dist: {
        src: 'public/style.css',
        dest: 'public/dist/style.css'
      }
    },

    watch: {
      scripts: {
        files: [ 'public/client/**/*.js' ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      options: {
        stderr: false
      },
      multiple: {
        command: ['git add .', 'git commit -m "deploy"', 'git push live master'].join('&&')
      }
      // prodServer: {
      //   // git add .
      //   // git commit -m 'date, time'
      //   // git 
      // }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  grunt.registerTask('deploy', function(n) {
    grunt.task.run([ 'build' ]);
    
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'eslint', 'test', 'concat', 'uglify', 'cssmin'
    // run nodemon
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  // grunt.registerTask('deploy', [
  //   // add your deploy tasks here
  //   'build'
  //   // push to live master
  //   // options: {
  //   //   'prod': 'yes'
  //   // }
  // ]);


};
