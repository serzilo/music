var React = require('react');
var $ = require('jquery');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxTypeToggle = React.createClass({
	render: function() {
		return (
			<div className="block block_toggle">
				<table className="table">
					<tr>
						<td className="table__cell">
							<label className="toggle toggle_first toggle_active">  
								 Артист
							</label>
						</td>

						<td className="table__cell">
							<label className="toggle">
								Трек
							</label>
						</td>

						<td className="table__cell">
							<label className="toggle toggle_last">
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

console.log('toggle');