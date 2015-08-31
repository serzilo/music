var React = require('react');
var FluxTypeToggle = require('./FluxTypeToggle.react');
var FluxMusicActions = require('../actions/FluxMusicActions');
var $ = require('jquery');

var FluxSearch = React.createClass({
	keydownHandler: function(e) {
		var ENTER_KEY = 13;

		if (e.keyCode == ENTER_KEY){
			this.searchRequest();
		}
	},
	changeHandler: function(){
		var q = $.trim(this.refs.searchInput.getDOMNode().value);

		FluxMusicActions.changeQuery(q);
	},
	submitFormHandler: function() {
		this.searchRequest();
	},
	searchRequest: function(){
		FluxMusicActions.search();
	},
	render: function() {
		var type = this.props.type;

		return (
			<div className="layout__header">
				<div className="app__header">
					<div className="search">
						<input ref="searchInput" className="search__input" type="text" placeholder="Поиск" tabIndex="1" onKeyDown={this.keydownHandler} onChange={this.changeHandler} />
						<button className="search__btn" tabIndex="2" onClick={this.submitFormHandler}>Найти</button>
					</div>
					<FluxTypeToggle type={type} />
				</div>
			</div>
		);
	}
});

module.exports = FluxSearch;

console.log('search');