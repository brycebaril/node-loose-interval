module.exports = LooseInterval

var EventEmitter = require("events").EventEmitter
var inherits = require("util").inherits

/**
 * Create a loose-interval repeated task. Like setInterval but will reschedule when the task
 * finishes to avoid overlapping tasks. Your function must provide a callback to alert its
 * completion.
 * @param {Function} fn       The function to repeatedly call. Must provide a callback. fn(cb)
 * @param {Number}   interval Millisecond interval to wait between the function's end next call.
 * @param {Function} callback Callback to forward results to after each run.
 */
function LooseInterval(fn, interval, callback) {
  if (!(this instanceof LooseInterval)) return new LooseInterval(fn, interval, callback)
  if (typeof fn != "function") throw new Error("LooseInterval requires a function")
  if (typeof interval == "function") {
    callback = interval
    interval = null
  }

  this.fn = fn
  this.interval = interval
  this.callback = callback

  EventEmitter.call(this)

  this._running = false
  if (interval != null) this.start(interval)
}
inherits(LooseInterval, EventEmitter)

LooseInterval.prototype.start = function (ms) {
  this.stop()
  var interval = (ms != null) ? ms : this.interval
  if (interval == null) throw new Error("No interval specified")
  this.interval = interval
  this._running = true
  this._loop()
}

LooseInterval.prototype._loop = function () {
  if (!this._running) return
  this.emit("start")
  var self = this
  this.fn(function () {
    if (self.callback) self.callback.apply(this, arguments)
    self.emit("done")
    self._timeout = setTimeout(self._loop.bind(self), self.interval)
  })
}

LooseInterval.prototype.stop = function () {
  this._running = false
  clearTimeout(this._timeout)
  this.emit("stop")
}

LooseInterval.prototype.runOnce = function () {
  this.fn(this.callback || function () {})
}