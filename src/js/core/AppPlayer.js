var $ = require('jquery');

function Player(){
	var self = this;

	self.audio = new Audio();
	self.playing = false;

	self.duration = {
		dirty: 0,
		formatted: 0
	};

	self.currentTime = {
		dirty: 0,
		formatted: 0
	};

	$(self.audio).on('timeupdate', function(){
		self.currentTime = self.timeUpdateHandler();
	}).on('loadedmetadata', function(){
		self.duration = self.getDuration();
	});
}

function formatTime(time) {
	var minutes = Math.floor(time / 60) % 60,
		seconds = Math.floor(time % 60);
	
	return (minutes < 10 ? '0' + minutes : minutes) + ':' +
           (seconds < 10 ? '0' + seconds : seconds);
}

$.extend(Player.prototype, {
	play: function(){
		var self = this;

		if (self.playing == false){
			self.audio.play();
		} else {
			self.audio.pause();
		}

		self.playing = !self.playing;
	},
	setSource: function(){
		var self = this,
			a = self.audio;

		a.pause();

		self.currentTime = {
			dirty: 0,
			formatted: 0
		};

		a.currentTime = 0;
		a.setAttribute("src","mynew.mp3");
	},
	timeUpdateHandler: function(){
		var a = this.audio,
			self = this;

		self.currentTime = self.getCurrentTime();
	},
	getDuration: function(){
		var duration = this.audio.duration

		return {
			dirty: duration,
			formatted: formatTime(duration)
		};
	},
	getCurrentTime : function(){
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

module.exports = Player;
