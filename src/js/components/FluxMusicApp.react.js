var React = require('react');
var ResultsStore = require('../stores/ResultsStore');
var PlayerStore = require('../stores/PlayerStore');
var FluxSearch = require('./FluxSearch.react');
var FluxResults = require('./FluxResults.react');
var FluxPlayer = require('./FluxPlayer.react');


function getResultsState() {
	return ResultsStore.getdata();
}

function getPlayerState() {
	return PlayerStore.getdata();
}

PlayerStore.getDataFromResults(getResultsState);

var FluxMusicApp = React.createClass({
	getInitialState: function() {
		return {
			result: getResultsState(),
			player: getPlayerState()
		}
	},
	componentDidMount: function() {
		ResultsStore.addChangeListener(this._onChange);
		PlayerStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		ResultsStore.removeChangeListener(this._onChange);
		PlayerStore.removeChangeListener(this._onChange);
	},
	_onChange: function() {
    	this.setState({
			result: getResultsState(),
			player: getPlayerState()
		});

		console.log(this.state);
	},
	render: function() {
	    return (
	    	<div>
		        <FluxSearch form={this.state.result.form} />
		        <FluxResults player={this.state.player} results={this.state.result.results} type={this.state.result.form.type} />
		        <FluxPlayer player={this.state.player} />
	        </div>
	    );
	}
});

module.exports = FluxMusicApp;