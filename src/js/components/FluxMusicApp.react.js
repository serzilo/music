var React = require('react');
var ResultsStore = require('../stores/ResultsStore');
var FluxSearch = require('./FluxSearch.react');
var FluxResults = require('./FluxResults.react');
var FluxPlayer = require('./FluxPlayer.react');


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
		        <FluxSearch form={this.state.form} />
		        <FluxResults results={this.state.results} type={this.state.form.type} />
		        <FluxPlayer />
	        </div>
	    );
	}
});

module.exports = FluxMusicApp;