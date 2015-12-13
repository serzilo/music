var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxMusicConstants = require('../constants/FluxMusicConstants');
var CommonConstants = require('../constants/CommonConstants');
var Common = require('../libs/Common');
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
	trackList: [],
	playingGroupId: 0,
	loading: false,
	minified: false,
	repeat: false
};

var types = {
	track: 0,
	artist: 1,
	album: 2
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
		setSiblingTrack('currentTrackEnded');
	});

	// get minified state from localstorage
	var minified = Common.getLocalStorageValue('minified');

	if (minified !== null){
		_store.minified = (minified == 1 ? true : false);
	}

	console.log(minified);

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
		_store.playingGroupId = 0;

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

function getTrackByNumber(num){
	return _store.trackList[num];
};

function setTrackById(id){
	setSpecificTrack(getTrackById(id));
}

function setTrackByNumber(num){
	setSpecificTrack(getTrackByNumber(num));
}

function setSpecificTrack(track){
	_store.playing = true;
	_store.currentPlayingTrackId = track.id;
	_store.progress = 0;

	_store.currentTime = {
		dirty: 0,
		formatted: '00:00'
	}

	_store.duration = {
		dirty: 0,
		formatted: '00:00'
	}

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

function setSiblingTrack(track){
	var currentPlayingTrackId = _store.currentPlayingTrackId,
		trackListLength = _store.trackList.length,
		i = 0;

	if (trackListLength > 0 && currentPlayingTrackId.length > 0){
		var id = 0,
			playFromBeginning = false;

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

		if (track && track == true){
			id = (_store.trackList[i - 1] ? _store.trackList[i - 1].id : _store.trackList[trackListLength - 1].id)
		} else {
			if (_store.trackList[i + 1]){
				id = _store.trackList[i + 1].id;
			} else {
				id = _store.trackList[0].id;
				playFromBeginning = true;
			}

			// id = (_store.trackList[i + 1] ? _store.trackList[i + 1].id : _store.trackList[0].id)
		}

		setTrackById(id);

		if (_store.repeat == false && playFromBeginning == true && track == 'currentTrackEnded'){
			_store.playing = false;
		}

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
		var currentTime = playerItem.fromPercentsToTime(parseInt(percent, 10))

		if (!isNaN(currentTime.dirty)){
			_store.playing = false;
			playerItem.play(_store.playing);

			_store.progress = percent;

			_store.currentTime = currentTime;

			playerItem.setTime(_store.currentTime.dirty);

			PlayerStore.emitChange();
		} else {
			console.log('data not loaded');
			console.log(currentTime);
		}
	}
}

function getArtistTopTracks(data){
	getTracksByType(data.id, types.track);
}

function getAlbumTracks(data){
	getTracksByType(data.id, types.album);
}

function getTracksByType(id, type){
	if (_store.playingGroupId != id){
		var ajaxQuery = '';

		_store.loading = true;
		_store.playingGroupId = id;

		PlayerStore.emitChange();

		if (type == types.track){
			ajaxQuery = "https://api.spotify.com/v1/artists/" + id + "/top-tracks?country=US";
		} else if (type == types.album){
			ajaxQuery = "https://api.spotify.com/v1/albums/" + id + "/tracks?limit=50";
		}

		$.get(ajaxQuery , function(data) {
			if (type == types.track){
				_store.trackList = data.tracks.slice();
			} else if (type == types.album){
				_store.trackList = data.items.slice();
			}

			setTrackByNumber(0);

			playerItem.play(_store.playing);

			_store.loading = false;

			PlayerStore.emitChange();
		});
	} else {
		playToggle();
	}
}

function toggleMinified(){
	_store.minified = !_store.minified;

	Common.setLocalStorageValue('minified', (_store.minified == true ? 1 : 0));

	PlayerStore.emitChange();
}

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
		case FluxMusicConstants.PLAYER_PLAY:
			if (action.data.place == CommonConstants.RESULTS){
				playTrackFromResults(action.data.id);
			} else if (action.data.place == CommonConstants.PLAYLIST){
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
		case FluxMusicConstants.GET_ARTIST_TOP_TRACKS:
		    getArtistTopTracks(action.data);
		    break;
		case FluxMusicConstants.GET_ALBUM_TRACKS:
		    getAlbumTracks(action.data);
		    break;

		case FluxMusicConstants.TOGGLE_MINIFIED:
		    toggleMinified();
		    break;
	    default:
	    	return true;
  	}
});

module.exports = PlayerStore;