"use strict";

module.exports = function (grunt) {
  // load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    watch: {
      coffee: {
        files: [ "assets/javascripts/*.coffee" ],
        tasks: [ "coffee:dist" ]
      },
      stylus: {
        files: [ "assets/stylesheets/*.styl" ],
        tasks: [ "stylus:dist" ]
      }
    },

    coffee: {
      dist: {
        files: {
          "public/social-buttons.js": "assets/javascripts/*.coffee"
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          "components/uri.js/src/URI.js",
          "components/uri.js/srcIPv6.js",
          "components/uri.js/srcSecondLevelDomains.js",
          "components/uri.js/srcpunycode.js",
          "components/uri.js/srcURITemplate.js",
          "components/uri.js/srcjquery.URI.js",
          "public/social-buttons.js"
        ],
        dest: "public/social-buttons.js"
      },
      jquery: {
        src: [
          "components/jquery/jquery.js"
        ],
        dest: "public/jquery.js"
      }
    },

    stylus: {
      dist: {
        options: {
          urlfunc: "embedurl",
          use: [
          ]
        },
        files: {
          "public/social-buttons.css": "assets/stylesheets/*.styl"
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          "public/social-buttons.min.js": "public/social-buttons.js"
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          base: "public/"
        }
      }
    }

  });


  grunt.registerTask("build", [
    "coffee",
    "concat",
    "stylus",
    "uglify"
  ]);

  grunt.registerTask("server", [
    "connect:server:keepalive"
  ]);

  grunt.registerTask("default", [
    "build"
  ]);
};