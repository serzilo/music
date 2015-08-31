var React = require('react');
var ResultsStore = require('../stores/ResultsStore');
var FluxSearch = require('./FluxSearch.react');
var FluxResults = require('./FluxResults.react');


function getResultsState() {
	return ResultsStore.getdata();
}


var FluxMusicApp = React.createClass({
	getInitialState: function() {
		return getResultsState();
	},

	componentDidMount: function() {
		ResultsStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ResultsStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
    	this.setState(getResultsState());
	},

	render: function() {
	    return (
	    	<div>
		        <FluxSearch type={this.state.form.type} />
		        <FluxResults results={this.state.results} type={this.state.form.type} />
	        </div>
	    );
	}
});

module.exports = FluxMusicApp;