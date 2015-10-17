var React = require('react');
var FluxMusicActions = require('../actions/FluxMusicActions');
var $ = require('jquery');

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

function isTouchDevice() {
	return !!('ontouchstart' in window);
}

var FluxPlayer = React.createClass({
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
			
			if (e.keyCode == SPACE){
				FluxMusicActions.togglePlay();
			}
		});
	},
	startMoveHandler: function(e){
		if ((isTouchDevice() == false && e.type == 'mousedown') || (isTouchDevice() == true && e.type == 'touchstart')){
			e.preventDefault();

			var progressHtml = this.refs.progress.getDOMNode(),
				percents = 0,
				_this = this,
				handledEvents = {},
				ns = '.progress';

			if (isTouchDevice() == false){
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

				if (isTouchDevice() == true){
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
	render: function() {
		var player = this.props.player,
			track = player.track,
			progress = player.progress,
			currentTime = player.currentTime,
			duration = player.duration,
			playing = player.playing;

		return (
			<div className="layout__footer">
				<div className="app__footer">
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
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = FluxPlayer;
