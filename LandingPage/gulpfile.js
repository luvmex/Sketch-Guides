var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	del = require('del');


// Static Server + watching scss/html files
gulp.task('server', function() {
    browserSync.init({
        server: "./build/"
    });
});

gulp.task('copy', function() {
    gulp.src(['./dev/lib/script/**/*'])
        .pipe(gulp.dest('./build/js/'))
    gulp.src(['./dev/lib/css/**/*'])
        .pipe(gulp.dest('./build/css/'))
    gulp.src('./dev/lib/image/**/*')
        .pipe(gulp.dest('./build/img/'))
    gulp.src('./dev/lib/font/**/*')
        .pipe(gulp.dest('./build/font/'))
});

 //Before build file clean the old one
gulp.task('clean', function(cb) {
    del(['./build/'], cb)
});


//Compile the layout to html
gulp.task('layout', function() {
	var jade = require('gulp-jade');
	gulp.src('./dev/layout/**/!(_)*.jade')
    	.pipe(jade())
    	.pipe(gulp.dest('./build/'))
    	.pipe(browserSync.stream())
});


//Compile the stylus to css
gulp.task('style', function(){
	var stylus = require('gulp-stylus');
		postcss = require('gulp-postcss'),
  		rupture = require('rupture'),
  		mqpacker = require('css-mqpacker'),
		sourcemaps = require('gulp-sourcemaps'),
		processors = [
		require('lost'),
		require('autoprefixer')({ browsers: ['last 5 version']}),
    	require('css-mqpacker'),
    	require('cssnano')({zindex: false, reduceIdents: false})
	];
	return gulp.src(['./dev/css/!(_)*.styl'])
    .pipe(sourcemaps.init())
		.pipe(stylus({ use: rupture(), compress: true }))
		.pipe(postcss(processors))
		// .pipe(sourcemaps.write('.'))
		// .pipe(concat('css.css'))
		.pipe(gulp.dest('./build/css/'))
		.pipe(browserSync.stream())
});


//Compile the jshint scripts
gulp.task('script', function() {
  var uglify = require('gulp-uglify');
  var jshint = require('gulp-jshint');
  return gulp.src('./dev/js/*.js')
    .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    .pipe(concat('js.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.stream())
});


// Images
gulp.task('image', function() {
  var cache = require('gulp-cache');
  var imagemin = require('gulp-imagemin');
  return gulp.src('./dev/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./build/img/'))
    .pipe(browserSync.stream())
});


// Watch the file if it change
gulp.task('watch', function(){
	gulp.watch('./dev/css/**/*.styl', ['style']);
	gulp.watch('./dev/js/*.js', ['script']);
	gulp.watch('./dev/layout/**/*.jade', ['layout']);
	// gulp.watch('./dev/img/**/*', ['image']);
});


gulp.task('copy', function () {
    return gulp.src(['./dev/lib/**'])
    .pipe(gulp.dest('./build/lib'));
});


// Start compile stylus jade js
gulp.task('compile', function(){
    gulp.start('script', 'layout', 'style', 'image')
});


//GO
gulp.task('default',['server'], function() {
    gulp.start('watch', 'compile');
});


