var gulp = 			require('gulp');
var uglify = 		require('gulp-uglify');
var htmlmin = 		require('gulp-cleanhtml');
var crisper =		require('gulp-crisper');
var vulcanize = 	require('gulp-vulcanize');
var rjs = 			require('gulp-requirejs');
var rimraf = 		require('gulp-rimraf');
var runSequence = 	require('run-sequence');
var sourcemaps = 	require('gulp-sourcemaps');
var polybuild = 	require('polybuild');

/********************
	Polybuild
*********************/
gulp.task('polybuild-dev', function() {
	return gulp.src('./gtfs-feed.html')
		.pipe(polybuild())
		.pipe(gulp.dest('dev'));
});

gulp.task('polybuild-dist', function() {
	return gulp.src('./gtfs-feed.html')
		.pipe(polybuild({maximumCrush: true}))
		.pipe(gulp.dest('dist'));
});

/********************
	Vulcanize
*********************/
var vulcanizeTask = function (dir) {

	return gulp.src('./gtfs-feed.html')
		.pipe(vulcanize({
			stripComments: true,
			inlineScripts: true,
			inlineCss: true
		}).on('error', function(err) {

			console.log('Vulcanize: ', err);

		}))
		.pipe(htmlmin())
		.pipe(gulp.dest(dir));
	
};

gulp.task('dev-vulcanize', function() {

	return vulcanizeTask('dev');

});
gulp.task('dist-vulcanize', function() {

	vulcanizeTask('dist');

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

	return gulp.src('./gtfs-feed.html')
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

    gulp.src(['./gtfs-feed.js'])
    .pipe(gulp.dest('dev'));

});

gulp.task('dist-js', function() {

    gulp.src(['./gtfs-feed.js'])
    .pipe(uglify().on('error', function(e){
            console.log('Uglify Error: ', e);
         }))
    .pipe(gulp.dest('dist'));

});

/********************
	Tasks
*********************/
 gulp.task('dev', ['temp-clean', 'dev-clean'], function(cb) {
 
 	runSequence(['dev-html-minify'], function() {
 
 		runSequence(['dev-js'], function() {
 
 			runSequence(['temp-clean'], cb);
 
 		});
 
 	});	
 
 });
 
 gulp.task('dist', ['temp-clean', 'dist-clean'], function(cb) {
 
 	runSequence(['dist-html-minify'], function() {
 
 		runSequence(['dist-js'], function() {
 
 			runSequence(['temp-clean'], cb);
 
 		});
 
 	});
 
 });

gulp.task('default', ['dev']);