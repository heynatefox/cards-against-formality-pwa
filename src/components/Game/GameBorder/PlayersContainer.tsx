import React, { useCallback, useRef, useState } from "react";
import { List, ListItem, ListItemText, Divider, ListItemAvatar, Avatar, Badge, ListItemSecondaryAction, Button, Popover } from "@material-ui/core";
// import PersonIcon from '@material-ui/icons/Person';
import StyleIcon from '@material-ui/icons/Style';
import useFetchData, { FetchType } from "../../../Hooks/useFetchData";

interface PlayersProps {
  players: any[];
  host: string;
  czar: string;
  roomId: string;
  isCurrentUserHost: boolean;
}

const MobilePlayer = ({ player, isHost, isCzar, onPlayerKick, isCurrentUserHost }: any) => {
  const anchorEl = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  if (!player) {
    return null;
  }

  function renderKick() {
    if (isHost || !isCurrentUserHost) {
      return null;
    }

    return <List>
      <ListItem style={{ padding: 0 }}>
        <Button size="small" color="secondary" onClick={() => { onPlayerKick(player?._id) }}>Kick</Button>
      </ListItem>
    </List>;
  }

  return <>
    <div className={`player ${isCzar || isHost ? 'special' : ''}`} ref={anchorEl} onClick={() => setIsOpen(prev => !prev)}>
      <Badge badgeContent={player.score} color="error">
        {player?.username}
      </Badge>
    </div>
    <Popover
      anchorEl={anchorEl.current}
      open={isHost || !isCurrentUserHost ? false : isOpen}
      onClose={() => setIsOpen(false)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      {renderKick()}
    </Popover>
  </>
};

const Player = ({ player, isHost, isCzar, onPlayerKick, isCurrentUserHost }: any) => {
  function renderIcon() {
    return <div style={!isHost && !isCzar ? { opacity: 0 } : {}}>
      <ListItemAvatar>
        <Avatar>
          <StyleIcon />
        </Avatar>
      </ListItemAvatar>
    </div>
  }

  function renderKick() {
    if (isHost || !isCurrentUserHost) {
      return null;
    }

    return <ListItemSecondaryAction>
      <Button color="secondary" onClick={() => { onPlayerKick(player?._id) }}>Kick</Button>
    </ListItemSecondaryAction>
  }

  return <ListItem>
    {renderIcon()}
    <ListItemText primary={player.username} secondary={`Score: ${!player?.score ? 0 : player.score}`} />
    {renderKick()}
  </ListItem>;
};

const Players = React.memo(({ players, host, czar, roomId, isCurrentUserHost }: PlayersProps) => {
  const [, , , kickPlayer] = useFetchData(`/api/rooms/kick`, FetchType.PUT);
  const onPlayerKick = useCallback((playerToKick: string) => {
    return kickPlayer({ roomId, clientId: playerToKick }).catch(() => { });
  }, [kickPlayer, roomId]);

  if (window.screen.width < 600) {
    return <>
      {players.sort((a, b) => b.score - a.score).map((player) => {
        const isHost = player._id === host;
        const isCzar = player?._id === czar;
        return <MobilePlayer key={player._id} player={player} isHost={isHost} isCzar={isCzar} onPlayerKick={onPlayerKick} isCurrentUserHost={isCurrentUserHost} />
      })}
    </>
  }

  return <List className="players-list">
    {players.map((player, index) => {
      const isHost = player._id === host;
      const isCzar = player?._id === czar;
      return <React.Fragment key={player._id}>
        <Player player={player} isHost={isHost} isCzar={isCzar} onPlayerKick={onPlayerKick} isCurrentUserHost={isCurrentUserHost} />
        {index !== players?.length - 1 ? <Divider variant="inset" component="li" /> : null}
      </React.Fragment>
    })}
  </List>;
});

export default Players;
