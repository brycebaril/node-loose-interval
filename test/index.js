var test = require("tape").test

var looseInterval = require("../")

test("init", function (t) {
  t.plan(1)

  t.ok(looseInterval, "Loaded")
})

test("fn only", function (t) {
  t.plan(1)

  function foo(cb) {
    setTimeout(function () {
      cb()
    }, 10)
  }

  var task = looseInterval(foo)
  t.ok(task instanceof looseInterval, "Task is a LooseInterval")
})

test("runOnce", function (t) {
  t.plan(1)

  function foo(cb) {
    setTimeout(function () {
      t.ok(1, "I ran.")
      cb()
    }, 10)
  }

  var task = looseInterval(foo)
  task.runOnce()
})

test("interval stop", function (t) {
  t.plan(7)

  var runs = []

  function foo(cb) {
    if (runs.length > 2) {
      task.stop()
      for (var i = 1; i < runs.length; i++) {
        var gap = runs[i] - runs[i-1]
        t.ok(gap >= 60, "Gap is at least interval + runtime")
        t.ok(gap <= 70, "Allow for some slop, but should be close to 60")
      }
    }
    else {
      runs.push(Date.now())
      setTimeout(function () {
        t.ok(1, "I ran.")
        cb()
      }, 10)
    }
  }

  var task = looseInterval(foo, 50)
})

test("interval callback stop", function (t) {
  t.plan(13)

  var runs = []

  function foo(cb) {
    if (runs.length > 2) {
      task.stop()
      for (var i = 1; i < runs.length; i++) {
        var gap = runs[i] - runs[i-1]
        t.ok(gap >= 60, "Gap is at least interval + runtime")
        t.ok(gap <= 70, "Allow for some slop, but should be close to 60")
      }
    }
    else {
      runs.push(Date.now())
      setTimeout(function () {
        t.ok(1, "I ran.")
        cb("foo", "bar")
      }, 10)
    }
  }

  var task = looseInterval(foo, 50, function (a, b) {
    t.ok(a, "foo", "Got argument 1")
    t.ok(b, "bar", "Got argument 2")
  })
})

test("events", function (t) {
  t.plan(20)

  var runs = []

  function foo(cb) {
    if (runs.length > 2) {
      task.stop()
      for (var i = 1; i < runs.length; i++) {
        var gap = runs[i] - runs[i-1]
        t.ok(gap >= 60, "Gap is at least interval + runtime")
        t.ok(gap <= 70, "Allow for some slop, but should be close to 60")
      }
    }
    else {
      runs.push(Date.now())
      setTimeout(function () {
        t.ok(1, "I ran.")
        cb("foo", "bar")
      }, 10)
    }
  }

  var task = looseInterval(foo, 50, function (a, b) {
    t.ok(a, "foo", "Got argument 1")
    t.ok(b, "bar", "Got argument 2")
  })

  task.on("start", function () {
    t.ok(1, "Got start")
  })
  task.on("stop", function () {
    t.ok(1, "Got stop")
  })
  task.on("done", function () {
    t.ok(1, "got done")
  })
})

test("interval start stop", function (t) {
  t.plan(9)

  var runs = []

  function foo(cb) {
    runs.push(Date.now())
    if (runs.length == 3) {
      task.start(25)
      for (var i = 1; i < 3; i++) {
        var gap = runs[i] - runs[i-1]
        t.ok(gap >= 60, "Gap is at least interval + runtime")
        t.ok(gap <= 70, "Allow for some slop, but should be close to 60")
      }
    }
    else if (runs.length == 5) {
      task.stop()
      for (var i = 4; i < runs.length; i++) {
        var gap = runs[i] - runs[i-1]
        t.ok(gap >= 35, "Gap is at least interval + runtime")
        t.ok(gap <= 45, "Allow for some slop, but should be close to 45")
      }
    }
    else {
      setTimeout(function () {
        t.ok(1, "I ran.")
        cb()
      }, 10)
    }
  }

  var task = looseInterval(foo, 50)
})