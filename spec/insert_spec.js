var toledo = require(".."),
    JS     = require("jstest")

JS.Test.describe("inserting a value", function() { with(this) {
  before(function() { with(this) {
    this.template = toledo.compileTemplate(
      "Hello, {{ person }}!"
    )
  }})

  it("inserts a string", function() { with(this) {
    assertEqual( "Hello, Scotland!", template.evaluate({person: "Scotland"}) )
  }})

  it("throws on undefined variables", function() { with(this) {
    assertThrows(Error, function() { template.evaluate({}) })
  }})
}})
