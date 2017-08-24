import React, { Component } from 'react';
import styled from 'styled-components';
import { findIndex, assign, find, filter } from 'lodash';
import Song from '../components/Song';
import Playlist from '../components/Playlist';
import PlaylistForm from '../components/PlaylistForm';
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
      playlistOptions: []
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
      return true;
    }

    addSongToPlayList(playlist, song.id, () => {
      const playlistIndex = findIndex(playlists, { id: playlist.id });
      const newPlaylist = assign({}, playlist, {
        songs: playlist.songs.concat(song.id)
      });

      playlists[playlistIndex] = newPlaylist;

      this.setState({ playlists: [...playlists] });
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
    const { playlists, currentPlayListId, playlistOptions } = this.state;

    let songs = this.state.songs;

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
    const { renderSongList, renderPlaylistList } = this;

    const Div = styled.div`
      margin: 20px;
    `;

    return (
      <Div>
        <h4>Playlists</h4>
        {renderPlaylistList()}
        <PlaylistForm addPlayList={name => this.addPlayList(name)} />
        <h4>Songs</h4>
        {renderSongList()}
      </Div>
    );
  }
}

export default Landing;
