var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxArtistsList = React.createClass({
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
						<div className="tile" key={item}>
							<div className="tile__image" style={styles.image}></div>
							<div className="tile__artist" id={items[item].id}>{items[item].name}</div>
						</div>
					);
				})}
			</div>
		)
	}
});

module.exports = FluxArtistsList;