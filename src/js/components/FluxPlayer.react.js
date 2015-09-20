var React = require('react');
var $ = require('jquery');

var FluxPlayer = React.createClass({
	getInitialState: function() {
		return {
			playing: false, 
			time: {
				current: '1:07',
				full: '3:15'
			},
			progress: {
				width: '20%'
			}
		}
	},
	playHandler: function(e){
		e.preventDefault();

		this.setState({playing: !this.state.playing});

		/*
		var self = this;

		if (this.state.playing == true){
			setInterval(function(){
				var w = (parseInt(self.state.progress.width) + 1) + '%';

				self.setState({progress: {width: w }});
			},500);
		}
		*/
	},
	prevHandler: function(e){
		e.preventDefault();

	},
	nextHandler: function(e){
		e.preventDefault();

	},
	render: function() {
		return (
			<div className="layout__footer">
				<div className="app__footer">
					<div className="player">
						<div className="player__tools">
							<div className="player__progress">
								<div className="player__progress-bg" style={{width: this.state.progress.width}}></div>
							</div>

							<div className="player__time player__time-current">{this.state.time.current}</div>
							<div className="player__time player__time-full">{this.state.time.full}</div>
						</div>
						<div className="player__btn-wrapper">
							<a href="#" className="player__btn" onClick={this.prevHandler}>
								<i className="icon icon-prev"></i>
							</a>
							<a href="#" className="player__btn" onClick={this.playHandler}>
								<i className={"icon " + (this.state.playing == false ? 'icon-play' : 'icon-pause')}></i>
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
