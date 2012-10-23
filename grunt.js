/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-css');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        '* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        '* This program is free software: you can redistribute it and/or modify\n' +
        '* it under the terms of the GNU General Public License as published by\n' +
        '* the Free Software Foundation, either version 3 of the License, or\n' +
        '* (at your option) any later version.\n' +
        '*\n' +
        '* This program is distributed in the hope that it will be useful,\n' +
        '* but WITHOUT ANY WARRANTY; without even the implied warranty of\n' +
        '* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n' +
        '* GNU General Public License for more details.\n' +
        '*\n' +
        '* You should have received a copy of the GNU General Public License\n' +
        '* along with this program.  If not, see <http://www.gnu.org/licenses/>. */\n'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: [
          '<banner:meta.banner>',
          '<file_strip_banner:lib/wicket.src.js>',
          '<file_strip_banner:lib/wicket-leaflet.src.js>',
          '<file_strip_banner:src/Leaflet.Layer.WKT.js>',
          '<file_strip_banner:src/Leaflet.paste.js>'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      dist: {
        src: ['<banner:meta.banner', '<file_strip_banner:dist/<%= pkg.name %>.css>'],
        dest: 'dist/<%= pkg.name %>.min.css'
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
      globals: {
        L: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min cssmin');

};
