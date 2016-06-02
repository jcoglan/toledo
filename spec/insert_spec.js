var toledo   = require(".."),
    JS       = require("jstest"),
    streamer = require("./support/streamer")

JS.Test.describe("inserting different values", function() { with(this) {
  include(require("./support/promise_assertions"))

  before(function() { with(this) {
    this.template = toledo.compileTemplate(
      "Hello, {{ person }}!"
    )
  }})

  it("inserts a string", function(resume) { with(this) {
    var context = {person: "Scotland"}
    assertPromiseEqual("Hello, Scotland!", template.evaluate(context), resume)
  }})

  it("inserts a promise", function(resume) { with(this) {
    var context = {person: Promise.resolve("async")}
    assertPromiseEqual("Hello, async!", template.evaluate(context), resume)
  }})

  it("inserts a stream", function(resume) { with(this) {
    var context = {person: streamer(["jcog", "lan"])}
    assertPromiseEqual("Hello, jcoglan!", template.evaluate(context), resume)
  }})

  describe("error reporting", function() { with(this) {
    before(function() { with(this) {
      this.template = toledo.compileTemplate(
        '<h1>There was a problem</h1>\n' +
        '<p>It happened because of {{ reasons }}</p>'
      )
    }})

    it("throws on undefined variables", function(resume) { with(this) {
      assertPromiseRejected(template.evaluate({}), resume)
    }})

    it("reports the line number of errors", function(resume) { with(this) {
      template.evaluate({}).catch(function(error) {
        resume(function() { assertMatch(/line 2/i, error.message) })
      })
    }})
  }})
}})
