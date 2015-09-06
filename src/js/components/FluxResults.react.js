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
			type = this.props.type,
			total = (this.props.results.total ? this.props.results.total : 0),
			types = {
				track:  '0',
				artist: '1',
				album:  '2'
			};

		console.dir(items);
		console.dir(this.props.results);

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

		// 
		// {type == types.track ? <FluxTracksList items={items} /> : <FluxArtistsList items={items} />}

		return (
			<div className="app__results clear">
				<div className="app__total">Нашлось результатов: {total}</div>
				<ResultList items={items} />

				<div onClick={this.searchMore} className={'button' + (!this.props.results.next || this.props.results.next === null ? ' hide' : '')}>Загрузить ещё</div>
			</div>
		);
	}
});

module.exports = FluxResults;

console.log('results');