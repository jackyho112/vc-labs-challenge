import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Div = styled.div`
  margin: 10px;
`;

const Input = styled.input`
  margin-right: 5px;
`;

class PlaylistForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { newPlaylistName: '' };
  }

  render() {
    const { props: { addPlayList }, state: { newPlaylistName } } = this;

    return (
      <Div>
        <Input
          value={newPlaylistName}
          onChange={event =>
            this.setState({ newPlaylistName: event.target.value })}
        />
        <button
          onClick={() => {
            addPlayList(newPlaylistName);
            this.setState({ newPlaylistName: '' });
          }}
        >
          Create new playlist
        </button>
      </Div>
    );
  }
}

export default PlaylistForm;
