var React = require('react');
var $ = require('jquery');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxResults = React.createClass({

	render: function() {
		var self = this, items = this.props.results;
		console.dir(items);

		return (
			<div className="app__results">
				
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
							
							<ul className="track-list">
								<li className="track-list__item">Uprising</li>
								<li className="track-list__item">Mercy</li>
								<li className="track-list__item">Resistance</li>
							</ul>
						</div>
					);
				})}
			</div>
		);
	}
});

module.exports = FluxResults;

console.log('results');