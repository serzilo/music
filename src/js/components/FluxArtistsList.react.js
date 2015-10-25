var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxArtistsList = React.createClass({
	clickHandler: function(e) {
		var id = e.currentTarget.getAttribute('data-id');

		FluxMusicActions.getArtistTopTracks({id: id});
	},
	render: function() {
		var self = this, 
			items = this.props.items;

		return (
			<div className="tile-wrapper">
				{Object.keys(items).map(function(item){
					var styles ={
					    image: {
					        backgroundImage: "url(\'" + (items[item].images[1] ? items[item].images[1].url : '') + "\')"
					    }
					}

					return (
						<div className="tile" key={item} data-id={items[item].id} onClick={self.clickHandler}>
							<div className="tile__image" style={styles.image}>
								<div className="tile__play-icon">
									<i className="icon icon-play-blue"></i>
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

module.exports = FluxArtistsList;