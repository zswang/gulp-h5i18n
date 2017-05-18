# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

gulp-h5i18n
-----

> A mobile page of internationalization development framework [h5i18n](https://github.com/zswang/h5i18n).

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-h5i18n`

## Usage

```js
var h5i18n = require('gulp-h5i18n');

gulp.task('dist', function() {
  return gulp.src('lib/*.js')
    .pipe(h5i18n())
    .pipe(gulp.dest('dist'));
});
```

## Options

- `defaultLang`

  Set default language.

- `locale`

  Set current Language.

- `map`

  Map of Languages.

- `mapfile`

  Map of languages file.

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/gulp-h5i18n
[npm-image]: https://badge.fury.io/js/gulp-h5i18n.svg
[travis-url]: https://travis-ci.org/zswang/gulp-h5i18n
[travis-image]: https://travis-ci.org/zswang/gulp-h5i18n.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/gulp-h5i18n?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/gulp-h5i18n/badge.svg?branch=master&service=github