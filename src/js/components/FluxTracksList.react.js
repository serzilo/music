var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxTracksList = React.createClass({
	clickHandler: function(e) {
		var id = e.target.getAttribute('data-id');

		FluxMusicActions.play(id);
	},
	render: function() {
		var self = this, 
			items = this.props.items,
			currentPlayingTrackId = this.props.player.currentPlayingTrackId;

		return (
			<ul className="track-list">
				{Object.keys(items).map(function(item){
					var id = items[item].id,
						track = items[item].name, 
						atrist = items[item].artists[0].name;

					return (
						<li onClick={self.clickHandler} data-id={id} className={'track-list__item' + (currentPlayingTrackId == id ? ' track-list__item_playing' : '')} key={item}>{atrist} - {track}</li>
					);
				})}
			</ul>
		)
	}
});

module.exports = FluxTracksList;