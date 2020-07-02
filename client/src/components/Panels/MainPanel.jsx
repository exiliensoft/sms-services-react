import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Profile from "../../components/Panels/Profile";
import { selectContactsData } from "../../reducers/contact/contact.selectors";
import { selectNavLink } from "../../reducers/home/home.selectors";
import { selectMessageFetching } from "../../reducers/message/message.selectors";
import Chat from "../Chat/Chat";
import Contacts from "../Contacts/Contacts";

class SidebarGroupItem extends React.Component {
  render() {
    const { isMessageFetching, isContactsLoaded } = this.props;
    const { link } = this.props;
    switch (link) {
      case "chats":
        return !isMessageFetching ? (
          <>
            <Chat />
            <Profile />
          </>
        ) : null;
      case "contacts":
        return isContactsLoaded ? <Contacts /> : null;
      default:
        return !isMessageFetching ? <Chat /> : null;
    }
  }
}

const mapStateToProps = createStructuredSelector({
  link: selectNavLink,
  isMessageFetching: selectMessageFetching,
  isContactsLoaded: selectContactsData,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarGroupItem);
