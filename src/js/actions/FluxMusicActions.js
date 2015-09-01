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
	}
}

module.exports = FluxMusicActions;