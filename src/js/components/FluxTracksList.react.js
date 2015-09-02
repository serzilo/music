var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxTracksList = React.createClass({
	render: function() {
		var self = this, 
			items = this.props.items;

		return (
			<ul className="track-list">
			{Object.keys(items).map(function(item){
				var atrist = items[item].artists[0].name,
					track = items[item].name, 
					preview_url = items[item].preview_url;

				return (
					<li data-preview_url={preview_url} className="track-list__item" key={item}>{atrist} - {track}</li>
				);
			})}
			</ul>
		)
	}
});

module.exports = FluxTracksList;