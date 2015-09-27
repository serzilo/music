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
		var type = this.props.form.type,
			loading = this.props.form.loading,
			searchLayoutFixed = this.props.form.searchLayoutFixed;

		return (
			<div className={"layout__header" + (searchLayoutFixed == true ? ' layout__header_fixed' : '')}>
				<div className="app__header">
					<div className={"loading" + (loading == true ? ' loading_show' : '')}></div>
					<div className="search">
						<input ref="searchInput" className="search__input" type="text" placeholder="Поиск" tabIndex="1" onKeyDown={this.keydownHandler} onChange={this.changeHandler} />
						<i className="search__spinner hide"></i>
						<button className="search__btn" tabIndex="2" onClick={this.submitFormHandler}>Найти</button>
					</div>
					<FluxTypeToggle type={type} />
				</div>
			</div>
		);
	}
});

module.exports = FluxSearch;
