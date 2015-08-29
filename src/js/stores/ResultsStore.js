var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxMusicConstants = require('../constants/FluxMusicConstants');
var _ = require('underscore');

var _results = {};

function loadMusicData(data) {
 	_results = data.artists.items;
}

var ResultsStore = _.extend({}, EventEmitter.prototype, {
	getdata: function(){
		return _results;
	},

	emitChange: function() {
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
	    case FluxMusicConstants.CHANGE_DATA:
		    loadMusicData(action.data);
		    break;
	    default:
	    	return true;
  	}
  ResultsStore.emitChange();
});

module.exports = ResultsStore;