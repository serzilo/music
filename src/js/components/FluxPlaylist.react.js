var React = require('react');
var FluxTracksList = require('./FluxTracksList.react');
var CommonConstants = require('../constants/CommonConstants');
var $ = require('jquery');

var FluxPlaylist = React.createClass({
	componentDidMount: function(){
		$(this.refs.contentScroll.getDOMNode()).mousewheel();
	},
	enterHandler: function(){
		//document.body.style.overflow = "hidden";

		console.log('enter');
	},
	leaveHandler: function(){
		//document.body.style.overflow = "auto";

		console.log('leave');
	},
	render: function() {
		return (
			<div className={'playlist' + (this.props.show == true ? ' playlist_show' : '')} onTouchStart={this.enterHandler} onTouchEnd={this.leaveHandler} onTouchCancel={this.leaveHandler}>
				<div className="playlist__header">
					Текущий плейлист
					<button className="search__btn search__btn_clear playlist__header-btn" onClick={this.props.close}>
						<i className="icon icon-clear"></i>
					</button>
				</div>
				<div className="playlist__content-scroll" ref="contentScroll">
					<FluxTracksList items={this.props.player.trackList} player={this.props.player}  place={CommonConstants.PLAYLIST} />
				</div>
			</div>
		);
	}
});

module.exports = FluxPlaylist;