var mocha = require('mocha')
, gulp = require('gulp')
, through = require('through2')
, File = require('vinyl')
, es = require('event-stream')
, expect = require('expect.js');

var plugin = require('../lib/gulp-git-rev');

describe('module', function() {
  it('exports gulp plugin', function() {
    expect(plugin).to.be.a('function');
  });
});

describe('plugin', function() {
  it('should output proper json', function(done) {

    var stream =  plugin('test-file.json');

    stream.on('data', function(file) {
      // Confirm that file gets correct content
      file.contents.on('data', function (chunk) {
        var obj = JSON.parse(chunk.toString());
        expect(obj.hash).to.match(/[0-9a-z]{40}/);
        expect(obj.tag).to.be.a('string');
        expect(obj.branch).to.be.a('string');
      })
    })
    .on('end', function() {
      done();
    });
    
  });
});
    
