var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxMusicConstants = require('../constants/FluxMusicConstants');
var _ = require('underscore');
var Player = require('../core/AppPlayer');
var $ = require('jquery');

var _store = {
	playing: false, 
	currentPlayingTrackId: '',
	duration: {
		dirty: 0,
		formatted: '00:00'
	},
	currentTime: {
		dirty: 0,
		formatted: '00:00'
	},
	progress: '0',
	track: '',
	trackList: []
};

var playerItem = new Player();

(function(){
	$(playerItem.audio).on('timeupdate', function(){
		_store.currentTime = playerItem.timeUpdateHandler();
		_store.progress = fromTimeToPercents();
		PlayerStore.emitChange();
	}).on('loadedmetadata', function(){
		_store.duration = playerItem.getDuration();
		_store.progress = fromTimeToPercents();
		PlayerStore.emitChange();
	}).on('ended', function(){
		setSiblingTrack();
	});
}());

var PlayerStore = _.extend({}, EventEmitter.prototype, {
	getdata: function(){
		return _store;
	},
	getDataFromResults: function(c){
		PlayerStore.getResults = c;
	},
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});

function playTrackFromResults(id){
	var items = PlayerStore.getResults().results.items;

	if (arraysAreEqual(items, _store.trackList)) {
		if (id == _store.currentPlayingTrackId){
			_store.playing = !_store.playing;
		} else {
			setTrackById(id);
		}
	} else {
		_store.trackList = items.slice();

		setTrackById(id);
	}

	playerItem.play(_store.playing);

	PlayerStore.emitChange();
}

function playTrackFromTracklist(id){
	if (id == _store.currentPlayingTrackId){
		_store.playing = !_store.playing;
	} else {
		setTrackById(id);
	}

	playerItem.play(_store.playing);

	PlayerStore.emitChange();
}

function getTrackById(id){
	if (id){
		var length = _store.trackList.length;

		for (var i = 0; i < length; i++){
			if (_store.trackList[i].id == id){
				return _store.trackList[i];
			}
		}
	}
};

function setTrackById(id){
	var track = getTrackById(id);

	console.log(id);
	console.log(track);

	_store.playing = true;
	_store.currentPlayingTrackId = id;
	_store.duration.dirty = 0;
	_store.currentTime.dirty = 0;
	_store.track = getTrackName(track);
	
	playerItem.setSource(track.preview_url);
}

function getTrackName(data){
	if (data){
		return data.artists[0].name + ' - ' + data.name;
	} else {
		console.log('no data!');
		console.log(data);
	}
}

function playToggle(){
	if (_store.currentPlayingTrackId.length > 0){
		_store.playing = !_store.playing;
		playerItem.play(_store.playing);

		PlayerStore.emitChange();
	}
}

function setSiblingTrack(previous){
	var currentPlayingTrackId = _store.currentPlayingTrackId,
		trackListLength = _store.trackList.length,
		i = 0;

	if (trackListLength > 0 && currentPlayingTrackId.length > 0){
		_store.currentTime = {
			dirty: 0,
			formatted: '00:00'
		}

		_store.duration = {
			dirty: 0,
			formatted: '00:00'
		}

		_store.progress = 0;

		for ( ; i < trackListLength; i++){
			if (_store.trackList[i].id == currentPlayingTrackId){
				break;
			}
		}

		var id = 0;

		if (previous && previous == true){
			id = (_store.trackList[i - 1] ? _store.trackList[i - 1].id : _store.trackList[trackListLength - 1].id)
		} else {
			id = (_store.trackList[i + 1] ? _store.trackList[i + 1].id : _store.trackList[0].id)
		}

		setTrackById(id);

		playerItem.play(_store.playing);

		PlayerStore.emitChange();
	}
}

function arraysAreEqual(arr1, arr2)	{
	var equal = (arr1.length == arr2.length);

	if (equal) {
		$.each(arr1, function (key, val) {
			if ($.inArray(val, arr2) == -1) {
				equal = false;
				return false;
			}
		});
	}
	return equal;
};

function fromTimeToPercents(){
	return ((_store.currentTime.dirty / _store.duration.dirty) * 100) + '%';
};

function scrollTrack(percent){
	if (_store.currentPlayingTrackId.length > 0){
		_store.playing = false;
		playerItem.play(_store.playing);

		_store.progress = percent;

		_store.currentTime = playerItem.fromPercentsToTime(parseInt(percent, 10));

		playerItem.setTime(_store.currentTime.dirty);

		PlayerStore.emitChange();
	}
}

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
		case FluxMusicConstants.PLAYER_PLAY:
			var places = {
				results: 0,
				playlist: 1
			};

			if (action.data.place == places.results){
				playTrackFromResults(action.data.id);
			} else if (action.data.place == places.playlist){
				playTrackFromTracklist(action.data.id);
			} else {
				console.log('something wrong. place: ' + action.data.place);
			}

		    break;
		case FluxMusicConstants.PLAYER_PLAY_TOGGLE:
		    playToggle();
		    break;
		case FluxMusicConstants.PLAYER_PREVIOUS_TRACK:
		    setSiblingTrack(true);
		    break;
		case FluxMusicConstants.PLAYER_NEXT_TRACK:
		    setSiblingTrack();
		    break;
		case FluxMusicConstants.PLAYER_SCROLL:
		    scrollTrack(action.data);
		    break;
	    default:
	    	return true;
  	}
});


module.exports = PlayerStore;