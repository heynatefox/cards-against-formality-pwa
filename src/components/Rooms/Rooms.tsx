import React, { useContext, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router";
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

import { UserContext } from "../../Contexts/UserProvider";
import Room from "./Room/Room";
import useFetchData, { FetchType } from "../../Hooks/useFetchData";
import CreateRoom from "./CreateRoom/CreateRoom";
import { SnackbarContext } from "../../Contexts/SnackbarProvider";
import useRooms from "../../Hooks/useRooms";
import GenericGardGroup from "../GenericCardGroup/GenericCardGroup";
import "./Rooms.scss";
import { Pagination } from "@material-ui/lab";
import _ from "lodash";

const STATIC_DECKS = { rows: [
  { _id: "6a0e4c0b1d3f873b84d0dfc8", name: "Base Set" },
  { _id: "6a0e4c0b1d3f873b84d0dfc9", name: "The First Expansion" },
  { _id: "6a0e4c0b1d3f873b84d0dfca", name: "The Second Expansion" },
  { _id: "6a0e4c0b1d3f873b84d0dfcb", name: "The Third Expansion" },
  { _id: "6a0e4c0c1d3f873b84d0dfcc", name: "The Fourth Expansion" },
  { _id: "6a0e4c0c1d3f873b84d0dfcd", name: "The Fifth Expansion" },
  { _id: "6a0e4c0c1d3f873b84d0dfce", name: "The Sixth Expansion" },
  { _id: "6a0e4c0c1d3f873b84d0dfcf", name: "Green Box Expansion" },
  { _id: "6a0e4c0c1d3f873b84d0dfd0", name: "90s Nostalgia Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd1", name: "Box Expansion" },
  { _id: "6a0e4c0c1d3f873b84d0dfd2", name: "Fantasy Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd3", name: "Food Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd4", name: "Science Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd5", name: "World Wide Web Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd6", name: "Vote for Hillary Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd7", name: "Vote for Trump Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd8", name: "Trump Survival Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfd9", name: "2012 Holiday Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfda", name: "2013 Holiday Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfdb", name: "PAX East 2013" },
  { _id: "6a0e4c0c1d3f873b84d0dfdc", name: "PAX Prime 2013" },
  { _id: "6a0e4c0c1d3f873b84d0dfdd", name: "PAX East 2014" },
  { _id: "6a0e4c0c1d3f873b84d0dfde", name: "PAX East 2014 Panel Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfdf", name: "PAX Prime 2014 Panel Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfe0", name: "PAX Prime 2015 Food Packs" },
  { _id: "6a0e4c0c1d3f873b84d0dfe1", name: "House of Cards Against Humanity" },
  { _id: "6a0e4c0c1d3f873b84d0dfe2", name: "Reject Pack" },
  { _id: "6a0e4c0c1d3f873b84d0dfe3", name: "Reject Pack 2" },
  { _id: "6a0e4c0c1d3f873b84d0dfe4", name: "Canadian" },
  { _id: "6a0e4c0c1d3f873b84d0dfe5", name: "Misprint Replacement Bonus Cards" },
  { _id: "6a0e4c0c1d3f873b84d0dfe6", name: "Family Edition" },
] };

export default function Rooms() {
  const { openSnack } = useContext(SnackbarContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
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

  const { rooms, isLoading, disconnected, reconnecting, paginationProps } =
    useRooms();
  const [isCreating, setIsCreating] = useState(false);
  const onCreate = useCallback(
    () => setIsCreating((prevIsCreating) => !prevIsCreating),
    []
  );

  const decksData = STATIC_DECKS;

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
        navigate(`/game?_id=${roomId}`, axiosRes.data);
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
              onClick={() => navigate("/")}
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
                onClick={() => navigate("/login")}
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
          action={renderHeaderButton()}
        />
        <CardContent className="rooms-content-container">
          {renderRooms()}
        </CardContent>
      </Card>
    </Container>
  );
}
