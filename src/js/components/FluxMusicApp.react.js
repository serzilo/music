var React = require('react');
var ResultsStore = require('../stores/ResultsStore');
var FluxSearch = require('./FluxSearch.react');
var FluxResults = require('./FluxResults.react');


function getResultsState() {
	console.log('getResultsState');
	console.dir({results: ResultsStore.getdata()});
  return {results: ResultsStore.getdata()};
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
		        <FluxSearch />
		        <FluxResults results={this.state.results}  />
	        </div>
	    );
	}
});

module.exports = FluxMusicApp;