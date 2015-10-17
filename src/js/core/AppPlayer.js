var $ = require('jquery');

function Player(){
	var self = this;

	self.audio = new Audio();

	$(self.audio).on('timeupdate', function(){
		self.currentTime = self.timeUpdateHandler();
	}).on('loadedmetadata', function(){
		self.duration = self.getDuration();
	});
}

$.extend(Player.prototype, {
	play: function(play){
		var self = this;

		if (play == true){
			self.audio.play();
		} else {
			self.audio.pause();
		}
	},
	setSource: function(source){
		var self = this,
			a = self.audio;

		a.pause();

		self.currentTime = {
			dirty: 0,
			formatted: 0
		};

		a.currentTime = 0;
		a.setAttribute("src", source);
	},
	timeUpdateHandler: function(){
		var a = this.audio,
			self = this;

		return self.getCurrentTime();
	},
	getDuration: function(){
		var duration = this.audio.duration

		return {
			dirty: duration,
			formatted: formatTime(duration)
		};
	},
	getCurrentTime: function(){
		var currentTime = this.audio.currentTime;

		return {
			dirty: currentTime,
			formatted: formatTime(currentTime)
		};
	},
	fromPercentsToTime: function(p){
		var currentTimeDirty = self.currentTime.dirty * (p / 100);

		return {
			dirty: currentTimeDirty,
			formatted: formatTime(currentTimeDirty)
		};
	}
});

function formatTime(time) {
	var minutes = Math.floor(time / 60) % 60,
		seconds = Math.floor(time % 60);
	
	return (minutes < 10 ? '0' + minutes : minutes) + ':' +
           (seconds < 10 ? '0' + seconds : seconds);
}

module.exports = Player;
