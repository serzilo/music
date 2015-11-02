var React = require('react');
var $ = require('jquery');
var FluxMusicActions = require('../actions/FluxMusicActions');
var FluxTracksList = require('./FluxTracksList.react');
var FluxTilesList = require('./FluxTilesList.react');

var FluxResults = React.createClass({
	searchMore: function(){
		if (this.props.result.form.loading == false){
			FluxMusicActions.searchMore();
		}
	},
	render: function() {
		var self = this, 
			result = this.props.result,
			items = (result.results.items ? result.results.items : {}),
			player = this.props.player,
			minified = player.minified,
			type = result.form.type,
			loading = result.form.loading,
			total = (typeof result.results.total != 'undefined' ? result.results.total : false),
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

		var ResultList,
			clickHandlerAction;

		switch (type) {
			case types.track:
  				ResultList = FluxTracksList;
				break;
			case types.artist:
  				ResultList = FluxTilesList;
  				clickHandlerAction = FluxMusicActions.getArtistTopTracks;
				break;
			case types.album:
  				ResultList = FluxTilesList;
  				clickHandlerAction = FluxMusicActions.getAlbumTracks;
				break;
		}

		return (
			<div className={"app__results clear" + (minified == true ? ' app__results_minified' : '')}>
				<div dangerouslySetInnerHTML={{__html: totalMessage}}></div>

				<ResultList items={items} player={player} clickHandlerAction={clickHandlerAction} />

				<div onClick={this.searchMore} className={'button' + (!result.results.next || result.results.next === null ? ' hide' : '')}>
					<div className={'loading' + (loading == true ? ' loading_show' : '')}></div>
					Загрузить ещё
				</div>
			</div>
		);
	}
});

module.exports = FluxResults;
