import React, { Component } from 'react';
import styled from 'styled-components';
import { findIndex, assign, find, filter, sortBy, uniq } from 'lodash';
import Song from '../components/Song';
import Playlist from '../components/Playlist';
import PlaylistForm from '../components/PlaylistForm';
import SortingBar from '../components/SortingBar';
import PlaylistList from '../components/PlaylistList';
import SongList from '../components/SongList';
import songSortingOptions from '../constants/songSortingOptions';
import {
  getAllSongs,
  getAllPlaylists,
  addSongToPlayList,
  convertPlaylistsToSelectOptions,
  addPlayList
} from './LandingHelpers';
import './Landing.css';

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      songs: [],
      playlists: [],
      currentPlayListId: null,
      playlistOptions: [],
      currentSongSortingOption: songSortingOptions[0],
      reverseSongOrder: false
    };
  }

  componentDidMount() {
    Promise.all([
      getAllSongs(),
      getAllPlaylists()
    ]).then(responses => {
      const initialData = {};
      const playlists = responses[1].data;
      initialData.songs = responses[0].data;
      initialData.playlists = playlists;
      initialData.playlistOptions = convertPlaylistsToSelectOptions(playlists);
      this.setState(initialData);
    })
  }

  addSongToPlayList = (playlistId, song) => {
    const { playlists } = this.state;
    const playlist = find(playlists, { id: playlistId });

    if (playlist.songs.includes(song.id)) {
      alert('Song already on playlist');
      return true;
    }

    addSongToPlayList(playlist, song.id).then(() => {
      const latestPlaylists = this.state.playlists;
      const playlistIndex = findIndex(latestPlaylists, { id: playlist.id });
      const newPlaylist = assign({}, latestPlaylists[playlistIndex], {
        songs: uniq(playlist.songs.concat(song.id))
      });

      latestPlaylists[playlistIndex] = newPlaylist;

      this.setState({ playlists: [...latestPlaylists] }, () =>
        alert('Song added to playlist')
      );
    });
  };

  addPlayList = playlistName => {
    const { playlists } = this.state;

    if (find(playlists, { name: playlistName })) {
      return;
    }

    addPlayList({ name: playlistName }).then(response => {
      const newPlaylists = [
        {name: playlistName, songs: [], id: response.data.id},
        ...this.state.playlists
      ];

      this.setState({
        playlists: newPlaylists,
        playlistOptions: convertPlaylistsToSelectOptions(newPlaylists)
      });
    });
  };

  render() {
    const {
      renderSongList,
      renderPlaylistList,
      renderSongSortingBar,
      addSongToPlayList,
      state: {
        songs,
        playlists,
        currentPlayListId,
        playlistOptions,
        currentSongSortingOption,
        reverseSongOrder
      }
    } = this;

    const Div = styled.div`
      margin: 20px;
    `;

    return (
      <Div>
        <h4>Playlists</h4>

        <PlaylistList
          playlists={playlists}
          currentPlayListId={currentPlayListId}
          setCurrentPlaylist={playlistId =>
            this.setState({
              currentPlayListId:
                currentPlayListId === playlistId ? null : playlistId
            })}
        />

        <PlaylistForm addPlayList={name => this.addPlayList(name)} />

        <h4>Songs sorted by</h4>

        <SortingBar
          currentOption={this.state.currentSongSortingOption}
          options={songSortingOptions}
          selectAsCurrent={currentSongSortingOption =>
            this.setState({ currentSongSortingOption })}
          reverseOrder={() =>
            this.setState({ reverseSongOrder: !this.state.reverseSongOrder })}
        />

        <SongList
          rawSongs={songs}
          playlists={playlists}
          currentPlayListId={currentPlayListId}
          playlistOptions={playlistOptions}
          currentSongSortingOption={currentSongSortingOption}
          reverseSongOrder={reverseSongOrder}
          addSongToPlayList={addSongToPlayList}
        />
      </Div>
    );
  }
}

export default Landing;
