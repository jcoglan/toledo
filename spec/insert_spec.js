var toledo   = require(".."),
    JS       = require("jstest"),
    streamer = require("./support/streamer")

JS.Test.describe("inserting different values", function() { with(this) {
  include(require("./support/stream_assertions"))

  before(function() { with(this) {
    this.template = toledo.compileTemplate(
      "Hello, {{ person }}!"
    )
  }})

  it("inserts a string", function(resume) { with(this) {
    var context = {person: "Scotland"}
    assertStreamEqual("Hello, Scotland!", template.evaluate(context), resume)
  }})

  it("inserts a promise", function(resume) { with(this) {
    var context = {person: Promise.resolve("async")}
    assertStreamEqual("Hello, async!", template.evaluate(context), resume)
  }})

  it("inserts a stream", function(resume) { with(this) {
    var context = {person: streamer(["jcog", "lan"])}
    assertStreamEqual("Hello, jcoglan!", template.evaluate(context), resume)
  }})

  it("inserts two streams in order", function(resume) { with(this) {
    var template = toledo.compileTemplate(
      "Hey {{ person }}, welcome to {{ city }}"
    )
    var context = {
      person: streamer(["jcog", "la", "n"], 100),
      city:   streamer(["Edin", "burgh"], 10)
    }
    assertStreamEqual("Hey jcoglan, welcome to Edinburgh",
                      template.evaluate(context),
                      resume)
  }})

  describe("error reporting", function() { with(this) {
    before(function() { with(this) {
      this.template = toledo.compileTemplate(
        '<h1>There was a problem</h1>\n' +
        '<p>It happened because of {{ reasons }}</p>'
      )
      this.stream = template.evaluate({})
    }})

    it("throws on undefined variables", function(resume) { with(this) {
      stream.on('error', function(error) {
        resume(function() { assert(error) })
      })
      stream.on('data', function() {})
    }})

    it("reports the line number of errors", function(resume) { with(this) {
      stream.on('error', function(error) {
        resume(function() { assertMatch(/line 2/i, error.message) })
      })
      stream.on('data', function() {})
    }})
  }})
}})
