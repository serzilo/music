var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxTypeToggle = React.createClass({
	clickHandler: function(e){
		FluxMusicActions.changeSearchType(e.target.getAttribute('data-type'));
	},
	render: function() {
		var type = this.props.type,
			types = {
				tracks: 0,
				artists: 1,
				albums: 2
			};

		return (
			<div className="block block_toggle">
				<table className="table">
					<tr>
						<td className="table__cell">
							<label className={"toggle toggle_first" + (types.tracks == type ? ' toggle_active' : '')} data-type="0" onClick={this.clickHandler}>  
								 Трек
							</label>
						</td>

						<td className="table__cell">
							<label className={"toggle" + (types.artists == type ? ' toggle_active' : '')} data-type="1" onClick={this.clickHandler}>
								Артист
							</label>
						</td>

						<td className="table__cell">
							<label className={"toggle toggle_last" + (types.albums == type ? ' toggle_active' : '')} data-type="2" onClick={this.clickHandler}>
								Альбом
							</label>
						</td>
					</tr>
				</table>
			</div>
		);
	}
});

module.exports = FluxTypeToggle;