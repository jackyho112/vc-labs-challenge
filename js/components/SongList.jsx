import React from 'react';
import { sortBy } from 'lodash';
import Song from '../components/Song';

const SongList = ({
  rawSongs,
  playlists,
  currentPlayListId,
  playlistOptions,
  currentSongSortingOption,
  reverseSongOrder,
  addSongToPlayList
}) => {
  let songs = sortBy(
    rawSongs,
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
          addSongToPlayList={addSongToPlayList}
        />
      ))}
    </div>
  );
}

export default SongList;
