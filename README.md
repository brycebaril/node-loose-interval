loose-interval
==============

`loose-interval` Is designed to be similar to `setInterval` but for tasks that you don't want to overlap. Instead of starting the process every `interval` milliseconds, it pauses `interval` milliseconds between the completion and next execution.

[![NPM](https://nodei.co/npm/loose-interval.png)](https://nodei.co/npm/loose-interval/)

```javascript
var looseInterval = require("loose-interval")

// your function must provide a callback to call when it is done
function someSlowTask(callback) {
  /* copy a bunch of files, or scrape a website or something */
  /* phew! that took a while, but I'm done now, let's callback */
  callback(some, cool, args)
}

// Run your task waiting a minute between finish & rexecution
var task = looseInterval(someSlowTask, 60000)

// Execute a callback whenever it completes
var task = looseInterval(someSlowTask, 60000, console.log)

// Stop recurrence of your task
task.stop()

// Run it one time
task.runOnce()
```

API
===

`looseInterval(fn [,interval] [,callback])`
-------------------------------------------

Create a task. Requires a function (which has a callback) to execute. If no interval is given, it will not be executed or recur without `.runOnce` or `.start` being called.

Interval is in milliseconds, and is the pause between your function's completion and next execution.

If a callback is provided, that callback will be executed with whatever arguments your function provides.

`.start(interval)`
------------------

Start or change the interval of a recurring task. Interval is in milliseconds.

`.stop()`
---------

Stop the task for recurring. Can still be executed with `.runOnce` or rescheduled with `.start`

`.runOnce()`
------------

Run the function a single time, without repeating. This does not respect a schedule version and can cause overlapping tasks.

LICENSE
=======

MIT