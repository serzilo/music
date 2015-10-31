var React = require('react');

var FluxTile = React.createClass({
	clickHandler: function(e) {
		var id = e.currentTarget.getAttribute('data-id');

		this.props.clickHandlerAction({id: id});
	},
	render: function() {
		var self = this, 
			items = this.props.items,
			loading = this.props.player.loading,
			playingState = this.props.player.playing,
			playingId = this.props.player.playingGroupId;

		return (
			<div className="tile-wrapper">
				{Object.keys(items).map(function(item){
					var styles ={
						    image: {
						        backgroundImage: "url(\'" + (items[item].images[1] ? items[item].images[1].url : '') + "\')"
						    }
						},
						id = items[item].id;

					return (
						<div className={'tile' + (playingId == id ? ' tile_clicked' : '')} key={item} data-id={id} onClick={self.clickHandler}>
							<div className={'loading' + (playingId == id && loading == true ? ' loading_show' : '')}></div>

							<div className="tile__image" style={styles.image}>
								<div className="tile__play-icon">
									<i className={'icon ' + (playingId == id && playingState == true ? 'icon-pause-blue' : 'icon-play-blue')}></i>
								</div>
							</div>
							<div className="tile__artist">{items[item].name}</div>
						</div>
					);
				})}
			</div>
		)
	}
});

module.exports = FluxTile;