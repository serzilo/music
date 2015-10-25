var AppDispatcher = require('../dispatcher/AppDispatcher');
var FluxMusicConstants = require('../constants/FluxMusicConstants');

var FluxMusicActions = {
	search: function() {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.SEARCH,
		})
	},
	searchMore: function(){
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.SEARCH_MORE,
		})
	},
	changeQuery: function(data) {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.CHANGE_QUERY,
			data: data
		})
	},
	changeSearchType: function(data) {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.CHANGE_SEARCH_TYPE,
			data: data
		})
	},
	play: function(data) {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.PLAYER_PLAY,
			data: data
		})
	},
	togglePlay: function() {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.PLAYER_PLAY_TOGGLE,
		})
	},
	previousTrack: function() {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.PLAYER_PREVIOUS_TRACK,
		})
	},
	nextTrack: function() {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.PLAYER_NEXT_TRACK,
		})
	},
	scrollTrack: function(data){
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.PLAYER_SCROLL,
			data: data
		})
	},
	getArtistTopTracks: function(data){
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.GET_ARTIST_TOP_TRACKS,
			data: data
		})
	},
	getAlbumTracks: function(data){
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.GET_ALBUM_TRACKS,
			data: data
		})
	}
}

module.exports = FluxMusicActions;