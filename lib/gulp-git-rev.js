var through = require('through2');
var git = require('git-rev')
var each = require('async-each')
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// constsx2
const PLUGIN_NAME = 'gulp-git-release';

function writeReleaseToStream(cb) {
  var stream = through();

  function getRevPart (method, next) {
    git[method](function (res) {
      next(null, res);
    });
  }

  var fields = [{
    name: 'hash',
    method: 'long'
  }, {
    name: 'tag',
    method: 'tag'
  }, {
    name: 'branch',
    method: 'branch'
  }]
    
  each(
    fields.map(function (obj) {
      return obj.method;
    }),
    getRevPart,
    function (err, res) {
      if (err) {
        throw new PluginError(PLUGIN_NAME, 'Error getting git rev!' + err.toString());
      }
      var out = {};
      res.forEach(function (val, i) {
        out[fields[i].name] = val;
      });
      out = JSON.stringify(out);
      stream.write(out);
      gutil.log('wrote git rev version: ' + out);
      cb();
    }
  );

  return stream;
}

// plugin level function (dealing with files)
function gulpReleaseGen(filename) {

  var file = new gutil.File({
    cwd: "",
    base: "",
    path: filename
  });
  
  // creating a stream through which each file will pass
  var stream = through.obj(function (file, enc, cb) {

    // define the streamer that will transform the content
    var streamer = writeReleaseToStream(cb);
    // catch errors from the streamer and emit a gulp plugin error
    streamer.on('error', this.emit.bind(this, 'error'));
    // start the transformation
    file.contents = streamer;
    
    // make sure the file goes through the next gulp plugin
    this.push(file);
  });

  stream.write(file);
  stream.end();

  // returning the file stream
  return stream;
}

// exporting the plugin main function
module.exports = gulpReleaseGen;
