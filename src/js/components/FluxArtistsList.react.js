var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxArtistsList = React.createClass({
	render: function() {
		var self = this, 
			items = this.props.items;

		return (
			<div>
				{Object.keys(items).map(function(item){
					var styles ={
					    image: {
					        backgroundImage: "url(\'" + (items[item].images[1] ? items[item].images[1].url : '') + "\')"
					    }
					}

					return (
						<div className="result-item" key={item}>
							<div className="result-item__image" style={styles.image}></div>
							<div className="result-item__artist" id={items[item].id}>{items[item].name}</div>
						</div>
					);
				})}
			</div>
		)
	}
});

module.exports = FluxArtistsList;