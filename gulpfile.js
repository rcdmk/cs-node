var gulp = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('lint', function () {
  // pega todos os arquivos JS
  return gulp.src(['**/*.js','!**/node_modules/**'])
        // executa o jshint em todos estes arquivos
        .pipe(jshint())
        // exibe os resultados do jshint
        .pipe(jshint.reporter('default'));
});


gulp.task('default', ['lint', 'test']);
