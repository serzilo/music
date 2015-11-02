var $ = require('jquery');

var C = {
	isTouchDevice: function() {
		return !!('ontouchstart' in window);
	},
	getBodyScrollTop: function() {
		return (document.body && document.body.scrollTop) || (document.documentElement && document.documentElement.scrollTop);
	},
	isLocalStorageAvailable: function() {
	    try {
	        return 'localStorage' in window && window['localStorage'] !== null;
	    } catch (e) {
	        return false;
	    }
	},
	getLocalStorageValue: function(value) {
		if (C.isLocalStorageAvailable() == true) {
			return localStorage.getItem(value);
		} else {
			return null;
		}
	},
	setLocalStorageValue: function(key, value) {
		if (C.isLocalStorageAvailable() == true) {
			localStorage.setItem(key, value);
		}
	}
};

$.fn.mousewheel = function() {
	var mustdie = /(trident|msie)/i.test(navigator.userAgent), 
		doc = document.documentElement, 
		event_name, events = {
			onmousewheel: 'mousewheel',
			onwheel: 'wheel', 
			DOMMouseScroll: 'DOMMouseScroll'
		};

	for (var k in events) {
		if (k in doc) {
			event_name = events[k];
			break;
		}
	}

	if (!event_name) {
		return this;
	}
	
	function prevent_scroll(e) {
		e.preventDefault();
		e.stopPropagation();
	}
	
	return this.each(function() {
		var el = $(this).on(event_name, function (e) {
			var orig_event = e.originalEvent, 
				cur_scroll = el[0].scrollTop, 
				max_scroll = el[0].scrollHeight - el.outerHeight(), 
				delta = -orig_event.wheelDelta;
			
			if (isNaN(delta))
				delta = orig_event.deltaY;
			var direction = delta < 0;
			if ((direction && cur_scroll <= 0) || (!direction && cur_scroll >= max_scroll)) {
				prevent_scroll(e);
			} else if (mustdie) {
				if (direction && -delta > cur_scroll) {
					el[0].scrollTop = 0;
					prevent_scroll(e);
				} else if (!direction && delta > max_scroll - cur_scroll) {
					el[0].scrollTop = max_scroll;
					prevent_scroll(e);
				}
			}
		});
	});
};

module.exports = C;