var jasmineExtensions = jasmineExtensions || {};
(function (jasmineExtensions, undefined) {
  var MicroEventSpy = function (element, eventName) {
    this.element = element;
    this.eventName = eventName;
    this.triggered = false;
    this.receivedArgs = [];
  };
  MicroEventSpy.prototype.hit = function (receivedArgs) {
    this.triggered = true;
    this.receivedArgs = receivedArgs;
  };
  MicroEventSpy.prototype.matches = function (element, eventName) {
    return element == this.element && eventName == this.eventName;
  };
  MicroEventSpy.prototype.hasBeenTriggered = function () {
    return this.triggered;
  };
  MicroEvent.mixin(MicroEventSpy);
  jasmineExtensions.MicroEvent = jasmineExtensions.MicroEvent || {};
  jasmineExtensions.MicroEvent.spies = jasmineExtensions.MicroEvent.spies || [];
  jasmineExtensions.MicroEvent.createSpy = function (element, eventName) {
    var spy = new MicroEventSpy(element, eventName);
    element.bind(eventName, spy.hit.bind(spy));
    jasmineExtensions.MicroEvent.spies.push(spy);
    return spy;
  };
}(jasmineExtensions));
var spyOnMicroEvent = jasmineExtensions.MicroEvent.createSpy;
var findSpyFor = function (element, eventName) {
  var length = jasmineExtensions.MicroEvent.spies.length;
  for (var i = 0; i < length; i++) {
    var candidate = jasmineExtensions.MicroEvent.spies[i];
    if (candidate.matches(element, eventName))
      return candidate;
  }
  return null;
};
beforeEach(function () {
  this.addMatchers({
    toHaveTriggered:function (eventName) {
      var spy = findSpyFor(this.actual, eventName);
      return null != spy && spy.hasBeenTriggered();
    }
  });
});