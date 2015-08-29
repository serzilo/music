var AppDispatcher = require('../dispatcher/AppDispatcher');
var FluxMusicConstants = require('../constants/FluxMusicConstants');

var FluxMusicActions = {
	updateResults: function(data) {
		AppDispatcher.handleAction({
			actionType: FluxMusicConstants.CHANGE_DATA,
			data: data
		})
	}
}

module.exports = FluxMusicActions;