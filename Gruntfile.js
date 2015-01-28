module.exports = function(grunt){
	require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']});

	grunt.initConfig({

		// --- FILE SOURCES
		appBase: 'js/app',
		testFiles: '<%= appBase %>/**/*_test.js',
		appFiles: '<%= appBase %>/**/*.js',
		vendorFiles: ['lib/**/*.js', '!lib/bower_components/**/*.js'],
		sassFiles: ['scss/**/*.scss'],  
		dontTest: ['!<%= appBase %>/**/*_test.js', '!<%= appBase %>/utils/*', '!<%= appBase %>/nyt/worker.js'],

		// --- PKG
		pkg: grunt.file.readJSON('package.json'),

		// --- JSHINT
		jshint: {
			dev: {
				src: '<%= appFiles %>',
	      options: {
	      	asi: true,
	        curly: true,
	        eqeqeq: true,
	        immed: true,
	        latedef: true,
	        newcap: true,
	        noarg: true,
	        sub: true,
	        boss: true,
	        eqnull: true,
	        browser: true,
	        globals: {
	        	console: false,
	        	require: false,
	        	define: false,
	        }
	      },
			}
    },

    // --- SASS
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'css/main.css': 'scss/main.scss'
        }
      }
	  },

	  // --- POST-CSS
	  postcss: {
	    options: {
	      map: true,
	      processors: [
	        require('autoprefixer-core')({browsers: 'last 1 version'}).postcss
	      ]
	    },
	    dist: {
	      src: 'css/*.css'
	    }
	  },

	  // --- RequireJS Build...
	  requirejs: {
	    compile: {
	      options: {
	        // baseUrl: "path/to/base",
	        // mainConfigFile: "path/to/config.js",
	        // name: "path/to/almond", // assumes a production build using almond
	        // out: "path/to/optimized.js"
	      }
	    }
	  },

	  // --- Wire up bower components to require
    bowerRequirejs: {
    	all: {
    		rjsConfig: 'js/app/config.js',	
    	}
    },

	  // --- INJECT
	  injector: {
      options: {
      	addRootSlash: false,
      },
      css: {
        files: {
          'index.html': ['css/*.css'],
        }
      },
      // vendor_files :{
      // 	options: {
      // 		starttag: '<!-- vendor:{{ext}} -->',
      // 	},
      // 	files: {
      // 		'index.html': ['<%= vendorFiles %>']
      // 	}
      // },
    },

    // --- WATCH
    watch: {
	    sass: {
			 files: '<%= sassFiles %>',
			 tasks: ['sass', 'postcss']
			},
	    js: {
			 files: ['<%= appFiles %>', '!<%= testFiles %>'],
			 tasks: ['newer:jshint:dev', 'newer:injector']
			},
			test: {
				files: ['<%= appFiles %>', '<%= testFiles %>'],
				tasks: ['jasmine'],
				options: {
		      spawn: false,
		    },
			}
    },

    // --- BROWSERSYNC
    browserSync: {
    	bsFiles: {
			  src : ['<%= appFiles %>', 'css/*.css', '**/*.html']
			},
      options: {
      	server: {
      		baseDir: './'
      	},
        watchTask: true
      },
    },

    // --- JASMINE
    jasmine: {
    	src: ['<%= appFiles %>', '<%= dontTest %>'],
    	options : {
        specs : 'js/app/**/*_test.js',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: '<%= appBase %>/config.js'
        }
      }
    },
	})

	grunt.registerTask('serve', ['browserSync', 'watch:sass', 'watch:js'])
}