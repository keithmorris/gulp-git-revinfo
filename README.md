# gulp-git-rev
Create git release object and insert into the Gulp pipeline

### Install
``` bash
npm install gulp-git-rev --save
```

### Usage
``` javascript
var release = require('gulp-git-rev.js');

// Create release.json
gulp.task('release', function () {
  return release('release.json')
    .pipe(gulp.dest('dist')); // dir to put fil in
});
```
