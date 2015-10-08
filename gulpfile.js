// Requires
var gulp = require('gulp');

// Include plugins
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
// var browserSync = require('browser-sync').create();
// var uglify = require('gulp-uglify');
// var reload = browserSync.reload;
// var concat = require('gulp-concat');

// var gulpsync = require('gulp-sync')(gulp);
// var uncss = require('gulp-uncss');
// var rename = require('gulp-rename');
// var imagemin = require('gulp-imagemin');

// Paths
var sourceDirectory = './app';
var sourcePath = {
	scss: sourceDirectory + '/scss/**/*.scss',
	js: sourceDirectory + '/js/**/*.js',
	other: [ sourceDirectory + '/font/**', sourceDirectory + '/img/**', sourceDirectory + '/libs/**', sourceDirectory + '/partials/**', sourceDirectory + '/index.html' ]
};
var distDirectory = './dist';
var distPath = {
	css: distDirectory + '/css',
	js: distDirectory + '/js',
	other: distDirectory
};


// Tâche "css" = LESS + autoprefixer + unCSS + minify
gulp.task('css', function() {
	return gulp.src(sourcePath.scss)
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
	}))
	.pipe(livereload())
	.pipe(minify())
	.pipe(gulp.dest(distPath.css));
});

// Tâche "js" = uglify + concat
gulp.task('js', function() {
	return gulp.src(sourcePath.js)
	.pipe(plumber())
	.pipe(jscs())
	.pipe(jscs.reporter())
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'))
	.pipe(plumber.stop())
	.pipe(gulp.dest(distPath.js));
});

gulp.task('clean', function(){
	return gulp.src(distDirectory, {read: false})
	.pipe(clean());
});

gulp.task('watch', function() {
	var server = livereload();
	gulp.watch(sourcePath.scss, ['css']);
	gulp.watch(sourcePath.js, ['js']);
	gulp.watch(sourcePath.other, ['copy']);
	gulp.watch([sourceDirectory + '/**']).on('change', function() {
		livereload();
	});
	notify({
		title: 'Changes made',
		message: 'Reloading browser'
	});
});

gulp.task('copy', function() {
	return gulp.src(sourcePath.other, {
		base: sourceDirectory
	})
	.pipe(gulp.dest(distPath.other));
});

// // Tâche "watch" = je surveille LESS et HTML
// gulp.task('watch', function () {

//   browserSync.init({
//     server: "./app"
//   });


//   gulp.watch(source + '/app/scss/*.scss', ['css']);
//   gulp.watch(source + '/app/js/*.js', ['js']);
//   gulp.watch("*.html").on("change", browserSync.reload);
// });

// Default task
gulp.task('default', ['css', 'js', 'copy']);