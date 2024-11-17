/* eslint-disable react-hooks/rules-of-hooks */
// import { Grid } from "@mui/material";
import { Drawer, Grid2, Skeleton } from "@mui/material";
import Title from "../shared/Title";
import Header from "./Header";
import ChatList from "../specific/ChatList";
// import { samepleChats } from "../../constants/sampleData";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const socket = getSocket();
    const [onlineUsers, setOnlineUsers] = useState([]);
    console.log(socket.id, "sockettt");

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    console.log(newMessagesAlert, "sdfsdfd");
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    useErrors([
      {
        isError,
        error,
      },
    ]);
    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      //
      dispatch(setIsDeleteMenu(true));
      deleteMenuAnchor.current = e.currentTarget;
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      console.log(chatId, groupChat, "huehueh");
      e.preventDefault();
    };

    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    };

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const onlineUsersHandler = useCallback(
      (data) => {
        setOnlineUsers(data);
      },
      [dispatch]
    );

    const refetchListener = useCallback(() => {
      refetch();
      return navigate("/");
    }, [navigate, refetch]);

    const newMessagesAlertHandler = useCallback(
      (data) => {
        // console.log("tiggggg");
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersHandler,
    };

    useSocketEvents(socket, eventHandlers);
    return (
      <>
        <Title title={"Chat app"} description="This is a chat app" />
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              newMessagesAlert={newMessagesAlert}
              handleDeleteChat={handleDeleteChat}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}
        <Grid2 container height={"calc(100vh - 4rem)"}>
          <Grid2
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            size={{ sm: 4, md: 3 }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                handleDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
            <WrappedComponent
              {...props}
              socket={socket}
              chatId={chatId}
              user={user}
            />
          </Grid2>
          <Grid2
            size={{ md: 4, lg: 3 }}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid2>
        </Grid2>
      </>
    );
  };
};

export default AppLayout;
