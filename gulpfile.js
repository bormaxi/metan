var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('build', function(){
    gulp.src('./metan.js')
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest('build'));
});