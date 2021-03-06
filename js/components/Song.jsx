import React, { PureComponent } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { omit } from 'lodash';

const Div = styled.div`
  margin: 10px;
  border: 2px solid #D3D3D3;
  border-radius: 2px;
  padding: 10px;
`;

class Song extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { selectedPlaylistOption: null };
  }

  componentWillReceiveProps(nextProps) {
    const { playlistOptions } = nextProps;

    if (this.props.playlistOptions.length === 0 && playlistOptions.length > 0) {
      this.setState({ selectedPlaylistOption: nextProps.playlistOptions[0] });
    }
  }

  render() {
    const {
      props: { song, playlistOptions, addSongToPlayList },
      state: { selectedPlaylistOption }
    } = this;

    return (
      <Div>
        <pre>
          {JSON.stringify(omit(song, ['id']), null, 4)}
        </pre>
        <button
          onClick={() =>
            selectedPlaylistOption
              ? addSongToPlayList(selectedPlaylistOption.value, song)
              : null}
        >
          Add to playlist
        </button>
        <Select
          value={selectedPlaylistOption}
          options={playlistOptions}
          onChange={newlySelectedPlaylistOption =>
            this.setState({
              selectedPlaylistOption: newlySelectedPlaylistOption
            })}
        />
      </Div>
    );
  }
}

export default Song;
