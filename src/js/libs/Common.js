var C = {
	isTouchDevice: function(){
		return !!('ontouchstart' in window);
	}
};

module.exports = C;