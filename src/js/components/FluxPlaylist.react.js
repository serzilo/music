var React = require('react');
var FluxTracksList = require('./FluxTracksList.react');
var CommonConstants = require('../constants/CommonConstants');
var $ = require('jquery');

var FluxPlaylist = React.createClass({
	render: function() {
		var contentHeight = 0;

		if (this.props.show == true){
			contentHeight = this.props.windowHeight - this.refs.window__header.getDOMNode().offsetHeight;
		}

		return (
			<div className={'window_fixed' + (this.props.show == true ? '' : ' hide')}>
				<div className="window__header" ref="window__header">
					Текущий плейлист
					<button className="search__btn search__btn_clear window__header-btn" onClick={this.props.close}>
						<i className="icon icon-clear"></i>
					</button>
				</div>
				<div className="window__content-scroll" style={{height: contentHeight + 'px'}}>
					<FluxTracksList items={this.props.player.trackList} player={this.props.player}  place={CommonConstants.PLAYLIST} />
				</div>
			</div>
		);
	}
});

module.exports = FluxPlaylist;