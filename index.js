var Modal, classie, includePaths, path;

classie = require('classie');

path = require('path');

Modal = (function() {
  function Modal(trigger, windows, close) {
    this.overlay = null;
    this.trigger = document.getElementsByClassName(trigger);
    this.windows = document.querySelectorAll(windows);
    this.close = document.getElementsByClassName(close);
  }

  Modal.prototype.closest = function(el, selector) {
    var matchesFn, parent;
    matchesFn = void 0;
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function(fn) {
      if (typeof document.body[fn] === "function") {
        matchesFn = fn;
        return true;
      }
      return false;
    });
    while (el !== null) {
      parent = el.parentElement;
      if (parent !== null && parent[matchesFn](selector)) {
        return parent;
      }
      el = parent;
    }
    return null;
  };

  Modal.prototype.appendOverlay = function() {
    var footer, overlay;
    overlay = document.createElement('div');
    overlay.className = 'md-overlay';
    footer = document.getElementsByClassName('footer')[0];
    footer.insertAdjacentHTML('beforebegin', '<div class="md-overlay"></div>');
  };

  Modal.prototype.updateOverlay = function() {
    this.overlay = document.getElementsByClassName('md-overlay')[0];
  };

  Modal.prototype.mdOpen = function(event, target) {
    var data, modal;
    event.preventDefault();
    if (!classie.has(target, 'md-trigger') && this.closest(target, '.md-trigger') !== null) {
      target = this.closest(target, '.md-trigger');
    }
    data = target.getAttribute('data-modal');
    modal = document.getElementById(data);
    classie.add(modal, 'md-visible');
    if (modal.querySelector('iframe') !== null) {
      this.autoplay(modal);
    }
    classie.add(this.overlay, 'overlay-active');
  };

  Modal.prototype.mdClose = function(event) {
    event.preventDefault();
    if (classie.has(this.overlay, 'overlay-active')) {
      classie.remove(this.overlay, 'overlay-active');
    }
    [].forEach.call(this.windows, function(el) {
      var src, srcArray, video;
      if (classie.has(el, 'md-visible')) {
        classie.remove(el, 'md-visible');
        video = el.querySelector('iframe') !== null ? el.querySelector('iframe') : false;
        if (video) {
          src = video.getAttribute('src');
          if (src.indexOf('?&autoplay')) {
            srcArray = src.split('?&autoplay');
            src = srcArray[0];
          }
          video.setAttribute('src', '');
          video.setAttribute('src', src);
        }
      }
    });
  };

  Modal.prototype.autoplay = function(id) {
    var frame, h, src, w;
    frame = id.querySelector('iframe');
    src = frame.getAttribute('src');
    w = frame.getAttribute('width');
    h = frame.getAttribute('height');
    id.innerHTML = '<iframe width="' + w + '" height="' + h + '" src="' + src + '?&autoplay=1" frameborder="0"></iframe>';
  };

  Modal.prototype.setModalPosition = function() {
    var data, h, modal, w, windowHeight, windowWidth;
    data = this.getAttribute('data-modal');
    modal = document.getElementById(data);
    h = modal.offsetHeight;
    w = modal.offsetWidth;
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    if (h > windowHeight * 0.95) {
      classie.add(modal, 'md-lg');
      modal.style.top = (windowHeight * 0.025) + window.scrollY + 'px';
    } else {
      return false;
    }
  };

  Modal.prototype.removeModalStyle = function() {
    var mdShow;
    mdShow = document.getElementsByClassName('md-lg')[0];
    mdShow.style.top = 0;
    classie.remove(mdShow, 'md-lg');
  };

  Modal.prototype.eventListeners = function() {
    var el, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1, _this;
    _this = this;
    _ref = this.trigger;
    _fn = function(el) {
      el.addEventListener('click', function(event) {
        _this.mdOpen.call(_this, event, event.target);
        _this.setModalPosition.call(el);
      });
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      _fn(el);
    }
    _ref1 = this.close;
    _fn1 = function(el) {
      el.addEventListener('click', function(event) {
        _this.mdClose.call(_this, event);
        _this.removeModalStyle();
      });
    };
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      el = _ref1[_j];
      _fn1(el);
    }
    this.overlay.addEventListener('click', function(event) {
      _this.mdClose.call(_this, event);
      _this.removeModalStyle();
    });
  };

  Modal.prototype.init = function() {
    this.appendOverlay();
    this.updateOverlay();
    this.eventListeners();
  };

  return Modal;

})();

includePaths = function() {
  var modalPaths;
  modalPaths = path.join(__dirname, 'styl');
  return modalPaths;
};

module.exports = {
  Modal: Modal,
  includePaths: includePaths(),
  "with": function() {
    var paths, result;
    paths = Array.prototype.slice.call(arguments);
    result = [].concat.apply(includePaths(), paths);
    return result;
  }
};
