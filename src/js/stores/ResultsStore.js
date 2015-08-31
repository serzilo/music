var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxMusicConstants = require('../constants/FluxMusicConstants');
var _ = require('underscore');
var $ = require('jquery');

var _store = {
	results: {},
	form: {
		query: '',
		type: "1"
	}
};

function searchMusicData() {
	var types = ['track','artist','album'],
		type = types[_store.form.type],
		query = _store.form.query;

	if (query.length > 0){
		$.get( "https://api.spotify.com/v1/search?q="+query+"&type="+type, function(data) {
			switch (_store.form.type) {
				case "0":
      				_store.results = data.tracks.items;
					break;
				case "1":
      				_store.results = data.artists.items;
					break;
				case "2":
      				_store.results = data.albums.items;
					break;
			}

			ResultsStore.emitChange();
		});
	}
}

function saveQuery(query){
	_store.form.query = query;
}

function saveSearchType(type){
	_store.form.type = type;
	searchMusicData();
}


var ResultsStore = _.extend({}, EventEmitter.prototype, {
	getdata: function(){
		return _store;
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

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
	    case FluxMusicConstants.SEARCH:
		    searchMusicData();
		    break;
		case FluxMusicConstants.CHANGE_QUERY:
		    saveQuery(action.data);
		    break;
		case FluxMusicConstants.CHANGE_SEARCH_TYPE:
		    saveSearchType(action.data);
		    ResultsStore.emitChange();
		    break;
	    default:
	    	return true;
  	}
});

module.exports = ResultsStore;