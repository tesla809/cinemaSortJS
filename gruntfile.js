module.exports = function(grunt){
	//Configure task(s)
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		babel: {
			options: {
			sourceMap: false,
			presets: ['es2015']
		},			
			dev: {
				files: [{
					expand: true,
					src: 'src/js/es6/*.js',
					dest: 'src/js/transpiled',
					ext:'.js',
					flatten: true,
				}],
			},
		},

		uglify: {
			dev: {
				options: {
					beautify: true,
					mangle: false,
					compress: false,
					preserveComments: 'all',
				},
				src: 'src/js/transpiled/*.js',
				dest: 'src/js/script.min.js'
			},
			build: {
				src: 'src/js/transpiled/*.js',
				dest: 'build/js/script.min.js',
			}
		},

		less: {
			dev: {
				options: {
					paths: ['src/less/']
				},
				files: {
					'src/css/style.css' : 'src/less/source.less'
				}
			},
			build: {
				options: {
					compress: true
				},
				files: {
					'build/css/style.css' : 'src/less/source.less'
				}
			}
		},

		htmlmin: {                                     
			build: {                                      
			  options: {                                 
			    removeComments: true,
			    collapseWhitespace: true,
			  },
			  files: {                                   
			    'build/index.html': 'src/index.html', 
			  }
			},
		},

		watch: {
			options: {
				livereload: true,
			},
			htmlDev: {
				files: ['src/index.html'],
			},
			jsDev: {
				files: ['src/js/es6/*.js'],
				tasks: ['babel:dev', 'uglify:dev'],
			},
			lessDev: {
				files: ['src/less/*.less'],
				tasks: ['less:dev'],
			},
		},

		connect: {
			dev: {
				options: {
					port: 8000,
					host: 'localhost',
					keepalive: true, 
					open: 'http://localhost:8000/src/index.html',
				},
			},
			build: {
				options: {
					port: 8001,
					host: 'localhost',
					keepalive: true, 
					open: 'http://localhost:8001/build/index.html',
				},
			}
		},

		concurrent: {
			dev: {
				tasks: ['connect:dev', 'watch'],
				options: {
					logConcurrentOutput: true,
				}
			},
			build: {
				tasks: ['connect:build', 'watch'],
				options: {
					logConcurrentOutput: true,
				}
			}
		},
	});	

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// required for grunt-babel & grunt-concurrent to work
	require('load-grunt-tasks')(grunt);

	// Register tasks(s)
	// default equals to dev task
	grunt.registerTask('default', ['babel:dev', 'less:dev', 'uglify:dev', 'concurrent:dev']);	
	grunt.registerTask('build', ['babel:dev', 'less:build', 'uglify:build', 'htmlmin:build', 'concurrent:build']);
	// no need to register grunt-watch
};