var toledo = require(".."),
    JS     = require("jstest")

JS.Test.describe("inserting a value", function() { with(this) {
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

  it("throws on undefined variables", function(resume) { with(this) {
    assertPromiseRejected(template.evaluate({}), resume)
  }})
}})
