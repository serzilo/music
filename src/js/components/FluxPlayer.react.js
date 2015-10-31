var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');
var FluxPlaylist = require('./FluxPlaylist.react');
var $ = require('jquery');
var Common = require('../libs/Common');

function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem);
    } else {
        return getOffsetSum(elem);
    }
}

function getOffsetSum(elem) {
    var top=0, 
    	left=0;

    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }

    return {top: top, left: left};
}

function getOffsetRect(elem) {
    var box = elem.getBoundingClientRect(),
    	body = document.body,
    	docElem = document.documentElement,
    	scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
    	scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
    	clientTop = docElem.clientTop || body.clientTop || 0,
    	clientLeft = docElem.clientLeft || body.clientLeft || 0,
    	top  = box.top +  scrollTop - clientTop,
    	left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

var FluxPlayer = React.createClass({
	getInitialState: function() {
		return {
			showPlaylist: false,
			windowHeight: 0
		}
	},
	playHandler: function(e){
		e.preventDefault();
		FluxMusicActions.togglePlay();
	},
	prevHandler: function(e){
		e.preventDefault();
		FluxMusicActions.previousTrack();
	},
	nextHandler: function(e){
		e.preventDefault();
		FluxMusicActions.nextTrack();
	},
	progressOffsetLeft: 0,
	progressWidth: 0,
	componentDidMount: function(){
		$(window).on('keydown', function(e){
			var SPACE = 32;
			
			if (e.target.nodeName.toLowerCase() != 'input'){
				if (e.keyCode == SPACE){
					e.preventDefault();
					FluxMusicActions.togglePlay();
				}
			}
		});
	},
	startMoveHandler: function(e){
		if ((Common.isTouchDevice() == false && e.type == 'mousedown') || (Common.isTouchDevice() == true && e.type == 'touchstart')){
			e.preventDefault();

			var progressHtml = this.refs.progress.getDOMNode(),
				percents = 0,
				_this = this,
				handledEvents = {},
				ns = '.progress';

			if (Common.isTouchDevice() == false){
				handledEvents = {
					move: 'mousemove' + ns,
					end:  'mouseup' + ns
				}
			} else {
				handledEvents = {
					move: 'touchmove' + ns,
					end:  'touchend' + ns + ' touchcancel' + ns
				}

				e = e.touches[0];
			}

			this.progressOffsetLeft = getOffset(progressHtml).left;
			this.progressWidth = progressHtml.offsetWidth;

			percents = this.moveHandlerCalculate(e) + '%';

			FluxMusicActions.scrollTrack(percents);

			$(window).on(handledEvents.move ,function(e){
				e.preventDefault();

				var percents = 0;

				if (Common.isTouchDevice() == true){
					e = e.originalEvent.touches[0];
				}

				percents = _this.moveHandlerCalculate(e) + '%';
				FluxMusicActions.scrollTrack(percents);
			}).on(handledEvents.end ,function(e){
				e.preventDefault();

				$(this).off('.progress');

				FluxMusicActions.togglePlay();
			});
		}
	},
	moveHandlerCalculate: function(e){
		return this.percentCalculate(e.clientX, this.progressWidth, this.progressOffsetLeft);
	},
	percentCalculate: function(clientX, width, offsetLeft){
		var maxClientX = width + offsetLeft,
			percents = 0;

		if (clientX > maxClientX){
			clientX = maxClientX;
		} else if (clientX < 0){
			clientX = 0;
		}

		percents = ((clientX - (offsetLeft ? offsetLeft : 0)) / width) * 100;

		if (percents < 0){
			percents = 0;
		}

		return percents;
	},
	trackListShow: function(e) {
		e.preventDefault();

		var self = this,
			showPlayList = !this.state.showPlaylist,
			windowHeight = 0;

		/*
		if (showPlayList == true){
			self.bodyScrollTop = self.getBodyScrollTop();

			windowHeight = document.body.offsetHeight - self.refs.app__footer.getDOMNode().offsetHeight;

			$('body').css({'overflow':'hidden'}).scrollTop(0);
		} else {
			$('body').css({'overflow':'auto'}).scrollTop(self.bodyScrollTop);
		}
		*/
		
		this.setState({
			showPlaylist: showPlayList,
			windowHeight: windowHeight
		});
	},
	bodyScrollTop: 0,
	getBodyScrollTop: function(){
		return (document.body && document.body.scrollTop) || (document.documentElement && document.documentElement.scrollTop);
	},
	render: function() {
		var player = this.props.player,
			track = player.track,
			progress = player.progress,
			currentTime = player.currentTime,
			duration = player.duration,
			playing = player.playing;

		return (
			<div className="layout__footer">
				<div className="app__footer" ref="app__footer">
					<div className="player">
						<div className="player__track-name" title={track}>
							{track}
						</div>
						<div className="player__tools">
							<div ref="progress" className="player__progress" onMouseDown={this.startMoveHandler} onTouchStart={this.startMoveHandler}>
								<div className="player__progress-bg" style={{width: progress}}></div>
							</div>

							<div className="player__time player__time-current">{currentTime.formatted}</div>
							<div className="player__time player__time-full">{duration.formatted}</div>
						</div>
						<div className="player__btn-wrapper">
							<a href="#" className="player__btn" onClick={this.prevHandler}>
								<i className="icon icon-prev"></i>
							</a>
							<a href="#" className="player__btn" onClick={this.playHandler}>
								<i className={"icon " + (playing == false ? 'icon-play' : 'icon-pause')}></i>
							</a>
							<a href="#" className="player__btn" onClick={this.nextHandler}>
								<i className="icon icon-next"></i>
							</a>

							<a href="#" className={"player__btn player__btn_side-right" + (this.state.showPlaylist == true ? " player__btn_clicked" : "")} onClick={this.trackListShow}>
								<i className="icon icon-list"></i>
							</a>
						</div>						
					</div>
				</div>

				<FluxPlaylist show={this.state.showPlaylist} player={player} close={this.trackListShow} windowHeight={this.state.windowHeight} />
			</div>
		);
	}
});

module.exports = FluxPlayer;
