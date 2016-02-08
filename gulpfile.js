const gulp = require('gulp');
const del = require('del');
// const run = require('run-sequence');

// ディレクトリを空にする。
gulp.task('del', (done) => {
  del(['./dist/**/*'], done);
});

gulp.task('default', ['del'], () => {
  // TODO タスク
});
