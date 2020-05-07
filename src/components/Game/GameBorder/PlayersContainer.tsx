import React from "react";
import { List, ListItem, ListItemText, Divider, ListItemAvatar, Avatar, Badge } from "@material-ui/core";
// import PersonIcon from '@material-ui/icons/Person';
import StyleIcon from '@material-ui/icons/Style';

interface PlayersProps {
  players: any[];
  host: string;
  czar: string;
}

const Player = ({ player, isHost, isCzar }: any) => {
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
};

const Players = React.memo(({ players, host, czar }: PlayersProps) => {

  if (window.screen.width < 600) {
    return <>
      {players.sort((a, b) => b.score - a.score).map((player) => {
        const isHost = player._id === host;
        const isCzar = player?._id === czar;
        return <div key={player._id} className={`player ${isCzar || isHost ? 'special' : ''}`}>
          <Badge badgeContent={player.score} color="error">
            {player?.username}
          </Badge>
        </div>
      })}
    </>
  }

  return <List className="players-list">
    {players.map((player, index) => {
      const isHost = player._id === host;
      const isCzar = player?._id === czar;
      return <React.Fragment key={player._id}>
        <Player player={player} isHost={isHost} isCzar={isCzar} />
        {index !== players?.length - 1 ? <Divider variant="inset" component="li" /> : null}
      </React.Fragment>
    })}
  </List>;
});

export default Players;
