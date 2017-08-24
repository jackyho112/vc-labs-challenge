import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  margin: 10px;
`;

function Playlist({ playlist, selectAsCurrent, isCurrent }) {
  return (
    <Button
      onClick={() => selectAsCurrent(isCurrent ? null : playlist.id)}
      style={isCurrent ? { background: '#ADD8E6' } : {}}
    >
      {`${playlist.name} - ${playlist.songs.length} songs`}
    </Button>
  );
}

export default Playlist;
