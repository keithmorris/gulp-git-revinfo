# gulp-git-rev
Create git release object and insert into the Gulp pipeline

``` javascript
// Create release.json
gulp.task('release', function () {
  return releaseGen('release.json')
    .pipe(gulp.dest('dist')); // dir to put fil in
});
```
