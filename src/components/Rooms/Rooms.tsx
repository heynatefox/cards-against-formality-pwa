import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Container,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import QuestionIcon from "@material-ui/icons/HelpOutline";

import { UserContext } from "../../Contexts/UserProvider";
import Room from "./Room/Room";
import useFetchData, { FetchType } from "../../Hooks/useFetchData";
import CreateRoom from "./CreateRoom/CreateRoom";
import { RouterContext } from "../../Contexts/RouteProvider";
import { SnackbarContext } from "../../Contexts/SnackbarProvider";
import useRooms from "../../Hooks/useRooms";
import GenericGardGroup from "../GenericCardGroup/GenericCardGroup";
import "./Rooms.scss";
import { Pagination } from "@material-ui/lab";
import _ from "lodash";

export default function Rooms() {
  const { openSnack } = useContext(SnackbarContext);
  const { user } = useContext(UserContext);
  const [hasServerIssue, setHasServerIssue] = useState(false);
  useEffect(() => {
    // If there's no user yet. Check if ther's an issue.
    let timeout: any;
    if (!user) {
      timeout = setTimeout(() => {
        setHasServerIssue(true);
      }, 6000);
    }

    return () => {
      if (timeout && user) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
  }, [user]);

  const { history } = useContext(RouterContext);
  const { rooms, isLoading, disconnected, reconnecting, paginationProps } =
    useRooms();
  const [isCreating, setIsCreating] = useState(false);
  const onCreate = useCallback(
    () => setIsCreating((prevIsCreating) => !prevIsCreating),
    []
  );

  const [decksData] = useFetchData<{ rows: any[] } | null>(
    `/api/decks?fields=name,_id&pageSize=100`,
    FetchType.GET
  );
  const [, , , join] = useFetchData(
    `/api/rooms/join/players`,
    FetchType.PUT,
    undefined
  );

  const joinRoom = useCallback(_joinRoom, [join, history, user, openSnack]);
  function _joinRoom(roomId: string, passcode?: string) {
    if (!user) {
      // display toast error.
      return;
    }

    const data: any = {
      roomId,
      clientId: user._id,
      populate: ["players", "spectators"],
    };
    if (passcode?.length) {
      data.passcode = passcode;
    }

    join(data, true)
      .then((axiosRes) => {
        history.push(`/game?_id=${roomId}`, axiosRes.data);
        openSnack({ text: "Success!", severity: "success" });
      })
      .catch((err) => {
        openSnack({ text: err?.response?.data?.message, severity: "error" });
      });
  }

  function renderRooms() {
    if (isCreating) {
      return <CreateRoom onJoin={joinRoom} decksData={decksData} user={user} />;
    }

    if (!rooms?.length && !isLoading) {
      return (
        <div className="no-games">
          <Typography variant="h4">
            No active games? Create your own!
          </Typography>
          <Button
            className="button"
            color="primary"
            variant="contained"
            onClick={() => setIsCreating(true)}
          >
            Create Game
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="rooms-list">
          {rooms.map((room) => (
            <Room key={room._id} room={room} user={user} onJoin={joinRoom} />
          ))}
        </div>

        {paginationProps && (
          <Pagination
            {...paginationProps}
            shape="rounded"
            color="primary"
            siblingCount={0}
            boundaryCount={2}
          />
        )}
      </>
    );
  }

  function renderHeaderButton() {
    // if ((user as any)?.roomId) {
    //   return <Button
    //     onClick={() => joinRoom((user as any).roomId)}
    //     className="create-button"
    //     variant="outlined"
    //     color="secondary"
    //     size="medium"
    //   >
    //     Re-Join room
    //   </Button>
    // }
    if (window.screen.width < 600) {
      return (
        <IconButton
          onClick={onCreate}
          className="create-button"
          color="secondary"
        >
          {isCreating ? <ArrowBackIosIcon /> : <AddCircleIcon />}
        </IconButton>
      );
    }

    return (
      <Button
        onClick={onCreate}
        className="create-button"
        variant="outlined"
        color="secondary"
        size="medium"
        endIcon={!isCreating ? <AddCircleIcon /> : <RemoveIcon />}
      >
        {!isCreating ? "Create Game" : "Exit"}
      </Button>
    );
  }

  if (hasServerIssue) {
    return (
      <div className="game-disconnected">
        <GenericGardGroup
          leftCardText="Try again later!"
          leftCardChild={
            <Button
              color="secondary"
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
          rightCardText="Our servers are struggling to reach you"
          rightCardChild={
            <Button
              color="primary"
              variant="contained"
              onClick={() => history.push("/")}
            >
              Home
            </Button>
          }
        />
      </div>
    );
  }

  if (disconnected || reconnecting) {
    return (
      <div className="game-disconnected">
        <GenericGardGroup
          leftCardText="Game Disconnected!"
          leftCardChild={
            reconnecting ? (
              <Typography className="reconnecting-typog">
                {" "}
                Reconnecting
                <CircularProgress />
              </Typography>
            ) : (
              <Button
                color="secondary"
                variant="contained"
                onClick={() => history.push("/login")}
              >
                Reconnect
              </Button>
            )
          }
          rightCardText="Ensure you do not have more than one instance of the game open."
        />
      </div>
    );
  }
  const isDesktop = window.screen.width > 600;
  return (
    <Container className="rooms-container" maxWidth="lg">
      <Card className="rooms-card" raised={true}>
        <CardHeader
          title={!isCreating ? "Join a Game!" : "Creating a Game"}
          subheader={
            <div style={{ display: "flex", alignItems: "center" }}>
              {isDesktop ? (
                "Want to help keep the servers alive?"
              ) : (
                <span style={{ marginRight: "2%" }}>Want to help?</span>
              )}
              <IconButton
                style={{ padding: isDesktop ? 12 : 0 }}
                onClick={() =>
                  window.open("https://www.buymeacoffee.com/cards")
                }
              >
                <QuestionIcon fontSize="small" />
              </IconButton>
            </div>
          }
          action={renderHeaderButton()}
        />
        <CardContent className="rooms-content-container">
          {renderRooms()}
        </CardContent>
      </Card>
    </Container>
  );
}
