import React from "react";
import { List, ListItem, ListItemText, Divider, ListItemAvatar, Avatar } from "@material-ui/core";
// import PersonIcon from '@material-ui/icons/Person';
import StyleIcon from '@material-ui/icons/Style';

interface PlayersProps {
  players: any[];
  host: string;
  czar: string;
}

const Player = React.memo(({ player, isHost, isCzar }: any) => {
  function renderIcon() {
    return <div style={!isHost && !isCzar ? { opacity: 0 } : {}}>
      <ListItemAvatar>
        <Avatar>
          <StyleIcon />
        </Avatar>
      </ListItemAvatar>
    </div>
  }

  return <ListItem>
    {renderIcon()}
    <ListItemText primary={player.username} secondary={`Score: ${!player?.score ? 0 : player.score}`} />
  </ListItem>;
});

const Players = React.memo(({ players, host, czar }: PlayersProps) => {
  return <List className="players-list">
    {players.map((player, index) => {
      return <React.Fragment key={player._id}>
        <Player player={player} isHost={player._id === host} isCzar={player?._id === czar} />
        {index !== players?.length - 1 ? <Divider variant="inset" component="li" /> : null}
      </React.Fragment>
    })}
  </List>;
});

export default Players;
