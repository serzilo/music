var React = require('react');
var FluxTracksList = require('./FluxTracksList.react');
var $ = require('jquery');

var FluxPlaylist = React.createClass({
	render: function() {
		var show = this.props.show,
			player = this.props.player,
			items = this.props.player.trackList,
			place = 1;

		console.dir(items);

		return (
			<div className={'window_fixed' + (show == true ? '' : ' hide')}>
				<div className="window__header">
					Текущий плейлист
				</div>
				<div className="window__content-scroll">
					<FluxTracksList items={items} player={player}  place={place} />
				</div>
			</div>
		);
	}
});

module.exports = FluxPlaylist;