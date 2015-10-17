var React = require('react');
var $ = require('jquery');
var FluxMusicActions = require('../actions/FluxMusicActions');

var FluxTracksList = require('./FluxTracksList.react');
var FluxArtistsList = require('./FluxArtistsList.react');
var FluxAlbumsList = require('./FluxAlbumsList.react');

var FluxResults = React.createClass({
	searchMore: function(){
		FluxMusicActions.searchMore();
	},
	render: function() {
		var self = this, 
			items = (this.props.results.items ? this.props.results.items : {}),
			player = this.props.player,
			type = this.props.type,
			total = (typeof this.props.results.total != 'undefined' ? this.props.results.total : false),
			types = {
				track:  '0',
				artist: '1',
				album:  '2'
			},
			totalMessage = "";

		if (total !== false){
			totalMessage = '<div class="app__total">';
			if (total == 0){
				totalMessage += 'К сожелению, ничего не нашлось.';
			} else {
				totalMessage += 'Нашлось результатов: ' + total;
			}
			totalMessage += '</div>';
		}

		var ResultList;

		switch (type) {
			case types.track:
  				ResultList = FluxTracksList;
				break;
			case types.artist:
  				ResultList = FluxArtistsList;
				break;
			case types.album:
  				ResultList = FluxAlbumsList;
				break;
		}

		return (
			<div className="app__results clear">
				<div dangerouslySetInnerHTML={{__html: totalMessage}}></div>

				<ResultList items={items} player={player} />

				<div onClick={this.searchMore} className={'button' + (!this.props.results.next || this.props.results.next === null ? ' hide' : '')}>Загрузить ещё</div>
			</div>
		);
	}
});

module.exports = FluxResults;
