var React = require('react');
var FluxTracksList = require('./FluxTracksList.react');
var CommonConstants = require('../constants/CommonConstants');
var $ = require('jquery');

var FluxPlaylist = React.createClass({
	windowTopScroll: 0,
	playListScrolling: false,
	scrollHandler: function(){
		this.playListScrolling = true;
		$(window).scrollTop(this.windowTopScroll);
	},
	render: function() {
		var contentHeight = 0;

		if (this.props.show == true){
			contentHeight = this.props.windowHeight - 46;
		}

		return (
			<div className={'playlist' + (this.props.show == true ? ' playlist_show' : '')}>
				<div className="playlist__header">
					Текущий плейлист
					<button className="search__btn search__btn_clear playlist__header-btn" onClick={this.props.close}>
						<i className="icon icon-clear"></i>
					</button>
				</div>
				<div className="playlist__content-scroll" onScroll={this.scrollHandler}>
					<FluxTracksList items={this.props.player.trackList} player={this.props.player}  place={CommonConstants.PLAYLIST} />
				</div>
			</div>
		);
	}
});

(function(){
	$(window).on('scroll', function(e){
		console.log($(this).scrollTop());

		if (FluxPlaylist.playListScrolling == false){
			FluxPlaylist.windowTopScroll = $(this).scrollTop();
		}
	});
}());

module.exports = FluxPlaylist;