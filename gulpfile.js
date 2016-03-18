var gulp = 			require('gulp');
var uglify = 		require('gulp-uglify');
var htmlmin = 		require('gulp-cleanhtml');
var crisper =		require('gulp-crisper');
var vulcanize = 	require('gulp-vulcanize');
var rjs = 			require('gulp-requirejs');
var rimraf = 		require('gulp-rimraf');
var runSequence = 	require('run-sequence');
var sourcemaps = 	require('gulp-sourcemaps');
var browserSync = 	require('browser-sync').create();

/********************
	Vulcanize
*********************/
gulp.task('vulcanize', function () {

	return gulp.src('./gtfs-feed.html')
		.pipe(vulcanize({
			stripComments: true,
			inlineScripts: true,
			inlineCss: true
		}).on('error', function(err) {

			console.log('Vulcanize: ', err);

		}))
		.pipe(crisper())
		.pipe(gulp.dest('temp'));
	
});

/********************
	Clean
*********************/
var cleanTask = function(dir) {

	return gulp.src('./' + dir + '/*', { read: false }).pipe(rimraf().on('error', function(err) {

	    console.log('Rimraf: ', err)

	  }));

};

gulp.task('dev-clean', function() {

	return cleanTask('dev');

});

gulp.task('dist-clean', function() {

	return cleanTask('dist');

});

gulp.task('temp-clean', function() {

	return cleanTask('temp');

});

/******************
	html
*******************/
var minHtmlTask = function(dir) {

	return gulp.src('./temp/gtfs-feed.html')
		.pipe(htmlmin())
		.pipe(gulp.dest(dir));

};

gulp.task('dev-html-minify', function() {

	return minHtmlTask('dev');

});

gulp.task('dist-html-minify', function() {
	
	return minHtmlTask('dist');

});

/******************
	JS
*******************/
gulp.task('dev-js', function() {

    gulp.src(['./temp/gtfs-feed.js'])
    .pipe(gulp.dest('dev'));

});

gulp.task('dist-js', function() {

    gulp.src(['./temp/gtfs-feed.js'])
    .pipe(uglify().on('error', function(e){
            console.log('Uglify Error: ', e);
         }))
    .pipe(gulp.dest('dist'));

});

/******************
	Serve
*******************/
gulp.task('serve', function() {
  browserSync.init({
        server: {
            baseDir: "temp"
        },
        port: 8080
    });
});

/********************
	Tasks
*********************/
gulp.task('dev', ['temp-clean', 'dev-clean'], function(cb) {

	runSequence(['vulcanize'], function() {

		runSequence(['dev-html-minify', 'dev-js'], function() {

			runSequence(['temp-clean'], cb);

		});

	});	

});

gulp.task('dist', ['temp-clean', 'dist-clean'], function(cb) {

	runSequence(['vulcanize'], function() {

		runSequence(['dist-html-minify', 'dist-js'], function() {

			runSequence(['temp-clean'], cb);

		});

	});

});

gulp.task('default', ['dev']);