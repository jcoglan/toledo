var toledo   = require(".."),
    JS       = require("jstest"),
    streamer = require("./support/streamer")

JS.Test.describe("conditions", function() { with(this) {
  include(require("./support/stream_assertions"))

  describe("simple", function() { with(this) {
    before(function() { with(this) {
      this.template = toledo.compileTemplate(
        "{{ if condition }}\n" +
        "  It's true that {{ thing }}\n" +
        "{{ end }}"
      )
      this.context = {thing: "thing"}
    }})

    it("evaluates a synchronous true condition", function(resume) { with(this) {
      context.condition = true
      assertStreamEqual("\n  It's true that thing\n", template.evaluate(context), resume)
    }})

    it("evaluates a synchronous false condition", function(resume) { with(this) {
      context.condition = false
      assertStreamEqual("", template.evaluate(context), resume)
    }})
  }})
}})
