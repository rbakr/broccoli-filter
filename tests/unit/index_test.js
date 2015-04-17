var fse = require('fs-extra')
var expect = require('expect.js')
var path = require('path')
var sinon = require('sinon')
var Filter = require('../../index')
var Builder = require('broccoli').Builder
var sandbox = sinon.sandbox.create()

var tmpPath = path.join(__dirname, 'tmp')
var fixturePath = __dirname + '/fixtures/'

beforeEach(function() {
  fse.ensureDirSync(tmpPath);
  fse.copySync(fixturePath, tmpPath)
})

afterEach(function() {
  fse.removeSync(tmpPath);
  fse.removeSync('tmp');
})

describe('Filter', function() {
  it('should create a 1:1 mapping of files from /fixtures/*.txt to /fixtures/*.txt.bak', function() {
    var tree = new Filter(tmpPath, {
      extensions: ['txt'],
      targetExtension: 'txt.bak'
    })

    var builder = new Builder(tree);
    builder.build()
    .then(function(result) {
      debugger;
      expect(fse.readdirSync(result.directory)).to.equal(['baz.txt.bak', 'foo.txt.bak']);
    })
  })

  it('should allow processing of the files string contents with processString', function() {
    var tree = new Filter(tmpPath, {
      extensions: ['txt'],
      targetExtension: 'txt.bak',
      processString: function(str) {
        return str + '!';
      }
    })

    expect(fse.readFileSync(path.join(fixturePath, 'baz.txt'), 'utf8')).to.equal('Hello world')

    var builder = new Builder(tree);
    builder.build()
    .then(function(result) {
      expect(fse.readFileSync(
        path.join(result.directory, 'baz.txt.bak'), 'utf8'
      )).to.equal('Hello world!')
    })
  })
})