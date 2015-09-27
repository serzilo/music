var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxMusicConstants = require('../constants/FluxMusicConstants');
var _ = require('underscore');
var $ = require('jquery');

var TYPES = {
	track:  '0',
	artist: '1',
	album:  '2'
},
_store = {
	results: {},
	form: {
		query: '',
		type: TYPES.artist,
		loading: false,
		searchLayoutFixed: false
	}
};

function mergeResults(data, type, next){
	var dataType = '';

	switch (type) {
		case TYPES.track:
			dataType = 'tracks';
			break;
		case TYPES.artist:
			dataType = 'artists';
			break;
		case TYPES.album:
			dataType = 'albums';
			break;
	}

	if (next === true){
		_store.results.next = data[dataType].next;
		_store.results.offset = data[dataType].offset;
		_store.results.items = _store.results.items.concat(data[dataType].items);
	} else {
		_store.results = data[dataType];
	}

	_store.form.loading = false;

	ResultsStore.emitChange();
}

function searchMusicData(data) {
	var types = ['track','artist','album'],
		type = types[_store.form.type],
		query = _store.form.query,
		ajaxQuery = "https://api.spotify.com/v1/search?q="+query+"&type="+type,
		next = (data && data.next == true) ? true : false;

	_store.form.loading = true;
	ResultsStore.emitChange();

	if (next == true){
		ajaxQuery = _store.results.next;
	}

	if (query.length > 0){
		$.get(ajaxQuery , function(data) {
			mergeResults(data, _store.form.type, next);
		});
	} else {
		_store.form.loading = false;
		_store.results = {};
		ResultsStore.emitChange();
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
		    break;
	    default:
	    	return true;
  	}
});

(function(window, $){
	var _window = $(window),
		oldWindowScrollTop = 0;

	_window.on('scroll', function(e){
		var _this = $(this),
			newWindowScrollTop = $(this).scrollTop();

		// scrollTop more than headers height
		if (newWindowScrollTop > 120){
			_store.form.searchLayoutFixed  = (oldWindowScrollTop > newWindowScrollTop ? true : false);
		} else if (oldWindowScrollTop > newWindowScrollTop) {
			_store.form.searchLayoutFixed = true;
		}
		
		oldWindowScrollTop = newWindowScrollTop;

		ResultsStore.emitChange();	
	});


})(window, $);

module.exports = ResultsStore;