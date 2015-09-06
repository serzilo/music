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

function searchMusicData(data) {
	var types = ['track','artist','album'],
		type = types[_store.form.type],
		query = _store.form.query,
		ajaxQuery = "https://api.spotify.com/v1/search?q="+query+"&type="+type;

	if (data && data.next == true){
		ajaxQuery = _store.results.next;
	}

	if (query.length > 0){
		$.get(ajaxQuery , function(data) {
			switch (_store.form.type) {
				case "0":
      				_store.results = data.tracks;
					break;
				case "1":
      				_store.results = data.artists;
					break;
				case "2":
      				_store.results = data.albums;
					break;
			}


			console.log('_store.results');
			console.log(_store.results);
			
			ResultsStore.emitChange();
		});
	}
}

function saveQuery(query){
	_store.form.query = query;
}

function saveSearchType(type){
	_store.form.type = type;
	_store.results = {};
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
		case FluxMusicConstants.SEARCH_MORE:
		    searchMusicData({next: true});
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