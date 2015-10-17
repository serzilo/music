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
	changeHandler: function(e){
		var q = $.trim(e.target.value);

		FluxMusicActions.changeQuery(q);
	},
	clearFormHandler: function(){
		FluxMusicActions.changeQuery('');
		this.refs.searchInput.getDOMNode().focus();
	},
	submitFormHandler: function() {
		this.searchRequest();
	},
	searchRequest: function(){
		FluxMusicActions.search();
	},
	render: function() {
		var form = this.props.form,
			type = form.type,
			query = form.query,
			loading = form.loading,
			searchLayoutHide = form.searchLayoutHide;

		return (
			<div className={"layout__header" + (searchLayoutHide == true ? ' layout__header_hide' : '')}>
				<div className="app__header">
					<div className={"loading" + (loading == true ? ' loading_show' : '')}></div>
					<div className="search">
						<input ref="searchInput" value={query} className="search__input" type="text" placeholder="Поиск" tabIndex="1" onKeyDown={this.keydownHandler} onChange={this.changeHandler} />
						<i className="search__spinner hide"></i>

						<button className={"search__btn search__btn_clear" + (query.length == 0 ? ' hide' : '')} tabIndex="2" onClick={this.clearFormHandler}>
							<i className="icon icon-clear"></i>
						</button>

						<button className="search__btn" tabIndex="3" onClick={this.submitFormHandler}>
							<i className="icon icon-find"></i>
						</button>
					</div>
					<FluxTypeToggle type={type} />
				</div>
			</div>
		);
	}
});

module.exports = FluxSearch;
