var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	mustache = require('gulp-mustache'),
	rename = require('gulp-rename'),
	cleanCSS = require("gulp-clean-css"),
	gutil = require('gulp-util'),
	htmlmin = require('gulp-htmlmin'),
	smushit = require('gulp-smushit'),
	through = require('through2'),
	del = require('del'),
	path = require("path"),
	fs = require("fs");
var json = {};
var source = './source/';
var bin = './site/';

gulp.task("css", function()
{
	return gulp.src(source + "css/*")
	.pipe(cleanCSS())
	.pipe(gulp.dest(bin + "css/"));
})

gulp.task("images", function()
{
	return gulp.src([source + "images/*", source + "works/*/*.png"])
	.pipe(gulp.dest(bin + "img"));
});

gulp.task("image-compress", function()
{
	return gulp.src([source + "images/*", source + "works/*/*.png"])
	.pipe(smushit({ verbose: true}))
	.pipe(gulp.dest(bin + "img"));
})

gulp.task("works", function()
{
	json = {};
	return gulp.src(source + 'works/*/*{.json,.html}')
	.pipe(through.obj(function(file, encoding, callback) 
	{
		var info = path.parse(file.path);
		var working = file.path.split(path.sep);
		var id = working[working.length - 2];

		if (json[id] == undefined)
			json[id] = {};
		var work = json[id];
		work.id = id;

		if (info.ext == ".json")
		{
			var data = JSON.parse(file.contents.toString('utf-8'));
			for (var k in data)
				work[k] = data[k];
		}
		else if (info.ext == ".html")
		{
			work[info.name] = file.contents.toString('utf-8');
		}

		callback();
	}));
});

gulp.task("template", function()
{
	var sorted = {};
	for (var k in json)
	{
		var type = json[k].type;
		if (sorted[type] == undefined)
			sorted[type] = [];
		sorted[type].push(json[k]);
	}
	for  (var k in sorted)
		sorted[k].sort(function(a, b) { return Math.sign(b.order - a.order); });

	return gulp.src(source + 'templates/index.mustache')
	.pipe(mustache(sorted))
	.pipe(rename('index.html'))
	.pipe(htmlmin({collapseWhitespace: true }))
	.pipe(gulp.dest('site'));
});

gulp.task("scripts", function()
{
	return gulp.src(source + "scripts/*.js")
	.pipe(uglify().on("error", gutil.log))
	.pipe(gulp.dest(bin + "js"));
});

gulp.task('clean', function() 
{
	return del(['site']);
});

gulp.task('test', ['clean', 'works'], function() 
{
	gulp.start('scripts', 'template', 'css', 'images');
});

gulp.task('publish', ['clean', 'works'], function() 
{
	gulp.start('scripts', 'template', 'css', 'image-compress');
});