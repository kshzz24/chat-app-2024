import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { orange } from "../../constants/color";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
// import Search from "../specific/Search";
// import NewGroups from "../dialogs/NewGroups";
// import Notifications from "../specific/Notifications";
const Search = lazy(() => import("../specific/Search"));
const NewGroups = lazy(() => import("../dialogs/NewGroups"));
const Notifications = lazy(() => import("../specific/Notifications"));

// eslint-disable-next-line react/prop-types
const ToolTipBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isNewGroup } = useSelector((state) => state.misc);
  const { isSearch } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);

  const { isNotification } = useSelector((state) => state.misc);

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };
  const openSearch = () => {
    dispatch(setIsSearch(true));
  };
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const notificationHandler = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => navigate("/groups");
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" />
        <Toolbar
          sx={{
            bgcolor: `${orange} !important`,
            color: "white",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            Chat
          </Typography>

          <Box
            sx={{
              display: {
                xs: "block",
                sm: "none",
              },
            }}
          >
            <IconButton color={"inherit"} onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: "1" }} />
          <Box>
            <ToolTipBtn
              title={"Search"}
              onClick={openSearch}
              icon={<SearchIcon />}
            />

            <ToolTipBtn
              title={"New Group"}
              icon={<AddIcon />}
              onClick={openNewGroup}
            />
            <ToolTipBtn
              title={"Manage Group"}
              icon={<GroupIcon />}
              onClick={navigateToGroup}
            />
            <ToolTipBtn
              title={"Notifications"}
              icon={<NotificationsIcon />}
              value={notificationCount}
              onClick={notificationHandler}
            />
            <ToolTipBtn
              title={"Logout"}
              icon={<LogoutIcon />}
              onClick={logoutHandler}
            />
          </Box>
        </Toolbar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroups />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notifications />
        </Suspense>
      )}
    </>
  );
};

export default Header;
