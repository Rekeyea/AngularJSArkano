var gulp = require("gulp");
var gulp_concat = require("gulp-concat");
var gp_rename = require('gulp-rename');
var gp_uglify = require('gulp-uglify');
var watch = require("gulp-watch");
var plumber = require("gulp-plumber");

const angular_dir = "app/**/*.js";

function jsMin() {
    return gulp.src(angular_dir)
        .pipe(gulp_concat("build.js"))
        //.pipe(gp_uglify())
        .pipe(gulp.dest("dist"));
}

gulp.task("js-min",jsMin);
gulp.task("default",["js-min"],function() {
    gulp.watch(angular_dir,["js-min"]);
});