let gulp = require('gulp');

let nodemon = require('gulp-nodemon');

gulp.task('nodemon', () => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: 'setup/'
  });
});

gulp.task('default', ['nodemon']);
