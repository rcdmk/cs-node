var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('lint', function () {
  // pega todos os arquivos JS
  return gulp.src(['**/*.js','!**/node_modules/**'])
        // executa o jshint em todos estes arquivos
        .pipe(jshint())
        // exibe os resultados do jshint
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
  // pega todos os arquivos JS
  return gulp.src(['./test/**/*.tests.js'])
        // executa o mocha em todos estes arquivos
        .pipe(mocha({
          reporter: 'spec',
          clearRequireCache: true,
          ignoreLeaks: true
        }));
});

gulp.task('default', ['lint', 'test']);
