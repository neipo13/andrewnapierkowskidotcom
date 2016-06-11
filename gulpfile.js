var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	mustache = require('gulp-mustache'),
	rename = require('gulp-rename'),
	cleanCSS = require("gulp-clean-css"),
	gutil = require('gulp-util'),
	htmlmin = require('gulp-htmlmin'),
	through = require('through2'),
	del = require('del'),
	path = require("path"),
	fs = require("fs");
var json = {};

gulp.task("css", function()
{
	gulp.src("source/css/*")
	.pipe(cleanCSS())
	.pipe(gulp.dest("site/css/"));
})

gulp.task("images", function()
{
	gulp.src(["source/images/*", "source/works/*/*.png"])
	.pipe(gulp.dest("site/img"));
});

gulp.task("works", function()
{
	json = {};
	gulp.src('./source/works/*/index.json')
	.pipe(function() 
	{
		return through.obj(function(file, encoding, callback) 
		{
			var data = JSON.parse(file.contents.toString('utf-8'));
			var base = path.dirname(file.path);

			// set ID based on the directory name
			var working = base.split(path.sep);
			data.id = working[working.length - 1];

			// get content files and add them as attributes to the data
			var files = fs.readdirSync(base);
			for (var i = 0; i < files.length; i ++)
			{
				var full = path.join(base, files[i]);
				var info = path.parse(full);
				if (info.ext == ".html")
					data[info.name] = fs.readFileSync(full).toString('utf-8');
			}

			// add to global json object
			if (json[data.type] == undefined)
				json[data.type] = [];
			json[data.type].push(data);
			json[data.type].sort(function(a, b) { return Math.sign(b.order - a.order); });
			
			return callback(null, file);
		});
	}());
});

gulp.task("template", function()
{
	gulp.src('source/templates/index.mustache')
	.pipe(mustache(json))
	.pipe(rename('index.html'))
	.pipe(htmlmin({collapseWhitespace: true }))
	.pipe(gulp.dest('site'));
});

gulp.task("scripts", function()
{
	gulp.src("source/scripts/*.js")
	.pipe(uglify().on("error", gutil.log))
	.pipe(gulp.dest("site/js"));
});

gulp.task('clean', function() 
{
	return del(['site']);
});

gulp.task('default', ['clean', 'works'], function() 
{
	gulp.start('scripts', 'template', 'css', 'images');
});