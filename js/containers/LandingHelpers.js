import axios from 'axios';

const apiAddress = 'http://localhost:5000';

export function getAllSongs(successCallback) {
  return axios
    .get(`${apiAddress}/library/`)
    .then(response => successCallback(response.data.slice(0, 100)))
    .catch(error => {
      console.error('axios error', error); // eslint-disable-line no-console
    });
}

export function getAllPlaylists(successCallback) {
  return axios
    .get(`${apiAddress}/playlist/`)
    .then(response => successCallback(response.data.slice(0, 100)))
    .catch(error => {
      console.error('axios error', error); // eslint-disable-line no-console
    });
}

export function addSongToPlayList(playlist, songId, successCallback) {
  return axios
    .post(
      `${apiAddress}/playlist/${playlist.id}/`,
      Object.assign({}, playlist, { songs: playlist.songs.concat(songId) })
    )
    .then(() => successCallback())
    .catch(error => {
      console.error('axios error', error); // eslint-disable-line no-console
    });
}

export function addPlayList(playlist, successCallback) {
  const newPlaylist = Object.assign({}, playlist, { songs: [] });

  return axios
    .post(`${apiAddress}/playlist/`, newPlaylist)
    .then(response => {
      newPlaylist.id = response.data.id;
      successCallback(newPlaylist);
    })
    .catch(error => {
      console.error('axios error', error); // eslint-disable-line no-console
    });
}

export function convertPlaylistsToSelectOptions(playlists) {
  const playlistIdNamePairs = playlists.reduce(
    (list, playlist) => list.concat([[playlist.id, playlist.name]]),
    []
  );

  return playlistIdNamePairs.map(playlistIdNamePair => ({
    value: playlistIdNamePair[0],
    label: playlistIdNamePair[1]
  }));
}
