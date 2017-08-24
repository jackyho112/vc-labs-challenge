import React, { Component } from 'react';
import styled from 'styled-components';
import { findIndex, assign, find, filter, sortBy } from 'lodash';
import Song from '../components/Song';
import Playlist from '../components/Playlist';
import PlaylistForm from '../components/PlaylistForm';
import SortingBar from '../components/SortingBar';
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
    getAllSongs(songs => this.setState({ songs }));
    getAllPlaylists(playlists =>
      this.setState({
        playlists,
        playlistOptions: convertPlaylistsToSelectOptions(playlists)
      })
    );
  }

  addSongToPlayList = (playlistId, song) => {
    const { playlists } = this.state;
    const playlist = find(playlists, { id: playlistId });

    if (playlist.songs.includes(song.id)) {
      alert('Song already on playlist');
      return true;
    }

    addSongToPlayList(playlist, song.id, () => {
      const playlistIndex = findIndex(playlists, { id: playlist.id });
      const newPlaylist = assign({}, playlist, {
        songs: playlist.songs.concat(song.id)
      });

      playlists[playlistIndex] = newPlaylist;

      this.setState({ playlists: [...playlists] }, () =>
        alert('Song added to playlist')
      );
    });
  };

  addPlayList = playlistName => {
    const { playlists } = this.state;

    if (find(playlists, { name: playlistName })) {
      return;
    }

    addPlayList({ name: playlistName }, playlist => {
      const newPlaylists = [playlist, ...playlists];

      this.setState({
        playlists: newPlaylists,
        playlistOptions: convertPlaylistsToSelectOptions(newPlaylists)
      });
    });
  };

  renderSongList = () => {
    const {
      playlists,
      currentPlayListId,
      playlistOptions,
      currentSongSortingOption,
      reverseSongOrder
    } = this.state;

    let songs = sortBy(
      this.state.songs,
      song => song[currentSongSortingOption.value]
    );

    if (reverseSongOrder) {
      songs = songs.reverse();
    }

    if (currentPlayListId !== null) {
      const { songs: includedSongIds } = find(playlists, {
        id: currentPlayListId
      });
      songs = filter(songs, song => includedSongIds.includes(song.id));
    }

    return (
      <div>
        {songs.map(song => (
          <Song
            song={song}
            key={song.id}
            playlistOptions={playlistOptions}
            addSongToPlayList={this.addSongToPlayList}
          />
        ))}
      </div>
    );
  };

  renderSongSortingBar = () => (
    <SortingBar
      currentOption={this.state.currentSongSortingOption}
      options={songSortingOptions}
      selectAsCurrent={currentSongSortingOption =>
        this.setState({ currentSongSortingOption })}
      reverseOrder={() =>
        this.setState({ reverseSongOrder: !this.state.reverseSongOrder })}
    />
  );

  renderPlaylistList = () => (
    <div>
      {this.state.playlists.map(playlist => (
        <Playlist
          playlist={playlist}
          key={playlist.id}
          isCurrent={this.state.currentPlayListId === playlist.id}
          selectAsCurrent={playlistId =>
            this.setState({
              currentPlayListId: playlistId
            })}
        />
      ))}
    </div>
  );

  render() {
    const { renderSongList, renderPlaylistList, renderSongSortingBar } = this;

    const Div = styled.div`
      margin: 20px;
    `;

    return (
      <Div>
        <h4>Playlists</h4>
        {renderPlaylistList()}
        <PlaylistForm addPlayList={name => this.addPlayList(name)} />
        <h4>Songs sorted by</h4>
        {renderSongSortingBar()}
        {renderSongList()}
      </Div>
    );
  }
}

export default Landing;
