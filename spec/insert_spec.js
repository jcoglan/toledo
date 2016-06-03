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

  describe("multiple streams", function() { with(this) {
    before(function() { with(this) {
      this.template = toledo.compileTemplate(
        "Hey {{ person }}, welcome to {{ city }}"
      )
      this.context = {
        person: streamer(["jcog", "la", "n"], 80),
        city:   streamer(["Edin", "burgh"], 40)
      }
    }})


    it("inserts two streams in order", function(resume) { with(this) {
      assertStreamEqual("Hey jcoglan, welcome to Edinburgh",
                        template.evaluate(context),
                        resume)
    }})

    it("processes streams in parallel", function(resume) { with(this) {
      var start  = new Date().getTime(),
          stream = template.evaluate(context)

      stream.on("end", function() {
        var end = new Date().getTime()
        resume(function() { assert(end - start < 400) })
      })
      stream.on("data", function() {})
    }})
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
