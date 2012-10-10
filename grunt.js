/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-css');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Leaflet.paste - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://github.com/thegreat/Leaflet.paste/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Tom Nightingale; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'js/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/wicket.src.js>', '<file_strip_banner:lib/wicket-leaflet.src.js>', '<file_strip_banner:js/Leaflet.Layer.WKT.js>', '<file_strip_banner:js/Leaflet.paste.js>'],
        dest: 'dist/Leaflet.paste.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/Leaflet.paste.min.js'
      }
    },
    cssmin: {
      dist: {
        src: ['<banner:meta.banner', '<file_strip_banner:css/Leaflet.paste.css>'],
        dest: 'dist/Leaflet.paste.min.css'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min cssmin');

};
