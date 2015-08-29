var React = require('react');
var $ = require('jquery');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxSearch = React.createClass({
	keydownHandler: function(e) {
		var ENTER_KEY = 13;

		if (e.keyCode == ENTER_KEY){
			this.searchRequest();
		}
	},
	submitFormHandler: function() {
		this.searchRequest();
	},
	searchRequest: function(){
		var q = $.trim(this.refs.searchInput.getDOMNode().value);

		if (q.length > 0){
			$.get( "https://api.spotify.com/v1/search?q="+q+"&type=artist", function( data ) {
				FluxMusicActions.updateResults(data);
			});
		}
	},
	render: function() {
		return (
			<div className="layout__header">
				<div className="app__header">
					<div className="search">
						<input ref="searchInput" className="search__input" type="text" placeholder="artist, track" tabIndex="1" onKeyDown={this.keydownHandler} />
						<button className="search__btn" tabIndex="2" onClick={this.submitFormHandler}>Найти</button>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = FluxSearch;

console.log('search');