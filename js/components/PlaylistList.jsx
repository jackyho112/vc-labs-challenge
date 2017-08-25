import React from 'react';
import Playlist from './Playlist';

const PlaylistList = ({ playlists, currentPlayListId, setCurrentPlaylist }) => (
  <div>
    {playlists.map(playlist => (
      <Playlist
        playlist={playlist}
        key={playlist.id}
        isCurrent={currentPlayListId === playlist.id}
        selectAsCurrent={() => setCurrentPlaylist(playlist.id)}
      />
    ))}
  </div>
)

export default PlaylistList;
