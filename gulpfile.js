'use strict';
const gulp = require('gulp');
const del = require('del');
const jade = require('jade');
const gulpJade = require('gulp-jade');
const data = require('gulp-data');
const run = require('run-sequence');
const verbatim = require('jstransformer-verbatim');
jade.filters.verbatim = verbatim;
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const Filter = require('gulp-filter');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const minifycss = require('gulp-minify-css');
const postStylus = require('poststylus');

// ディレクトリを空にする。
gulp.task('del', (done) => {
  return del(['./dist/**/*'], done);
});


// es to js
gulp.task('scripts', () => {
  return browserify('./src/scripts/index.js', {debug: true})
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('./dist/js/'));
});

// pcss to css
gulp.task('styles', () => {
  let filter = Filter('**/*.styl', {restore: true});
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './src/styles/*.styl'
  ])
    .pipe(filter)
    .pipe(stylus({
      use: [
        postStylus(['autoprefixer', 'rucksack-css'])
      ]
    }))
    .pipe(filter.restore)
    .pipe(concat('index.css'))
    .pipe(minifycss({keepBreaks: true}))
    .pipe(gulp.dest('./dist/css'));
});

// jade to html
gulp.task('views', () => {
  return gulp.src('./src/views/index.jade')
    .pipe(data(() => {
      let config = require('./src/config');
      let options = {
        lang: 'ja',
        blog: config.blog,
        analytics: config.GoogleAnalytics,
        webmasters: config.WebMasterTool,
        ogp: {
          card: config.twitter.card,
          site: config.twitter.site,
          title: config.blog.title,
          description: config.blog.description,
          type: 'website',
          image: config.twitter.image,
          url: config.blog.url
        }
      };
      return options;
    }))
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', () => {
  gulp.watch([
    './src/scripts/**/*.js'
  ], ['scripts']);
  gulp.watch([
    './src/styles/*.styl'
  ], ['styles']);
  gulp.watch([
    './src/views/**/*.jade'
  ], ['views']);
});

gulp.task('build', (done) => {
  return run('views', 'scripts', 'styles', done);
});

gulp.task('default', () => {
  return run('del', 'build', 'watch');
});
