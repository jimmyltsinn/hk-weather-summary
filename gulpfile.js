let gulp = require('gulp');

let nodemon = require('gulp-nodemon');
let eslint = require('gulp-eslint');

gulp.task('nodemon', () => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: 'setup/'
  });
});

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['nodemon']);
