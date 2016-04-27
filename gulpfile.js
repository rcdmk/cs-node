var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
	istanbul = require('gulp-istanbul');

gulp.task('lint', function () {
  return gulp.src(['**/*.js','!**/node_modules/**','!./coverage/**'])
        // executa o jshint em todos estes arquivos
        .pipe(jshint())
        // exibe os resultados do jshint
        .pipe(jshint.reporter('default'));
});

gulp.task('pre-test', function() {
  return gulp.src(['**/*.js','!**/node_modules/**','!./coverage/**', '!gulpfile.js'])
    // executa o istanbul em todos estes arquivos, incluindo os não testados
    .pipe(istanbul({
	  includeUntested: true,
      print: 'summary'
	}))
	// força o retorno dos arquivos cobertos
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['./test/**/*.tests.js'])
    // executa o mocha em todos estes arquivos
    .pipe(mocha({
      reporter: 'spec',
      clearRequireCache: true,
      ignoreLeaks: true
    }))
    // cria os relatórios após executar os testes
    .pipe(istanbul.writeReports())
    // obriga cobertura de ao menos 80%
    .pipe(istanbul.enforceThresholds({
		thresholds: {
			global: 75
		}
	}));
});

gulp.task('default', ['lint', 'test']);
