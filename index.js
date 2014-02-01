(function(window) {
  var checkers = {
    ga: function() {
      if (window.ga !== undefined) {
        return true;
      }
      if (window._gaq !== undefined) {
        return true;
      }
      return false;
    },
    ym: function() {
      if (window.Ya !== undefined && window.Ya.Metrika !== undefined) {
        return true;
      }
      return false;
    }
  };

  var Metan = function(ymId) {
    var self = this;
    if (typeof ymId === 'string') {
      self.ym.id = ymId;
    }

    self.initCounters(function() {
      self.initDomEvents();
    });
  };

  Metan.prototype.ga = {
    counter: null,
    goal: function(target, category) {
      if (typeof this.counter === 'function') {
        this.counter('send', 'event', {
          'hitType': 'event',
          'eventCategory': category,
          'eventAction': target,
        });
      }
      if (typeof this.counter === 'object') {
        this.counter.push(['_trackEvent', category, target]);
      }
    }
  };
  Metan.prototype.ym = {
    id: null,
    counter: null,
    goal: function(target) {
      this.counter.reachGoal(target);
    }
  };

  Metan.prototype.initCounters = function(done) {
    var self = this;
    function check(checker, done) {
      var timeout, max, i, intervalId;

      timeout = 100;
      max = Math.floor(1000 / timeout);
      i = 0;

      function complete(res) {
        clearInterval(intervalId);
        if (res)
          done(null);
        else
          done(new Error("Not found"));

        done = function() {};
      }

      intervalId = setInterval(function() {
        if (checker()) complete(true);
        if (i > max) complete(false);
        i++;
      }, timeout);
    };

    var i = 2;

    var complete = function(err) {
      i--;
      if (i <= 0) {
        done();
        done = function() {};
      }
    };

    if (typeof self.ym.id !== 'string') {
      i = 1;
    } else {
      check(checkers.ym, function(err) {
        if (err) return complete(err);

        if (window[self.ym.id] === undefined) return complete();

        self.ym.counter = window[self.ym.id];
        complete();
      });
    }

    check(checkers.ga, function(err) {
      if (err) return complete(err);
      self.ga.counter = window._gaq || window.ga;
      complete();
    });
  };

  Metan.prototype.initDomEvents = function() {
    var eventMap = {
      click:  'onclick'
    },
    self = this;

    function init(selector, event) {
      var ieEvent = eventMap[event] || null,
          elements = document.querySelectorAll(selector);

      eventHandler = function(element) {
        var value    = element.getAttribute('data-metan-' + event),
            category = element.getAttribute('data-metan-' + event + '-category') || 'undefined';
        return function(e) {
          try {
            self.goal(value, category);
          } catch(e) {}
        };
      }

      for (var i = 0; i < elements.length; i++) {
        if (!elements[i].addEventListener) {
          if (ieEvent)
           elements[i].attachEvent(ieEvent, eventHandler(elements[i]));
        }
        else {
          elements[i].addEventListener(event, eventHandler(elements[i]), false);
        }
      }
    }

    init('[data-metan-click]', 'click');
  };

  Metan.prototype.goal = function(target, category) {
    this.ym.goal(target);
    this.ga.goal(target, category);
  };

  window.Metan = Metan;

  if (window['metan_callback'] !== undefined) {
    window['metan_callback'][0]();
  }

})(window);