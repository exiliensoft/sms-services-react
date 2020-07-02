import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectContactsFetching } from "../../reducers/contact/contact.selectors";
import { selectConversationFetching } from "../../reducers/conversation/conversation.selectors";
import { fetchingGroup } from "../../reducers/group/group.selectors";
import { selectNavLink } from "../../reducers/home/home.selectors";
import { selectListFetching } from "../../reducers/list/list.selectors";
import { selectDidFetching } from "../../reducers/did/did.selectors";
import ChatSidebarGroup from "../SidebarGroup/ChatSidebarGroup";
import ContactSidebarGroup from "../SidebarGroup/ContactSidebarGroup";
import DidSidebarGroup from "../SidebarGroup/DidSidebarGroup";
import GroupSidebarGroup from "../SidebarGroup/GroupSidebarGroup";
import ListSidebarGroup from "../SidebarGroup/ListSidebarGroup";
import WithSpinner from "../WithSpinner/WithSpinner";
const ListSidebarGroupWithSpinner = WithSpinner(ListSidebarGroup);
const ChatSidebarGroupWithSpinner = WithSpinner(ChatSidebarGroup);
const ContactSidebarGroupWithSpinner = WithSpinner(ContactSidebarGroup);
const GroupSidebarGroupWithSpinner = WithSpinner(GroupSidebarGroup);
const DidSidebarGroupWithSpinner = WithSpinner(DidSidebarGroup);

class LeftPanel extends React.Component {
  renderIsLoading = (_) => {
    switch (this.props.link) {
      case "chats":
        return (
          <ChatSidebarGroupWithSpinner
            isLoading={
              this.props.fetchingConversations || this.props.fetchingGroup
            }
          />
        );
      case "contacts":
        return (
          <ContactSidebarGroupWithSpinner
            isLoading={this.props.fetchingContacts}
          />
        );
      case "groups":
        return (
          <GroupSidebarGroupWithSpinner isLoading={this.props.fetchingGroups} />
        );
      case "dids":
        return (
          <DidSidebarGroupWithSpinner isLoading={this.props.fetchingDid} />
        );
      case "lists":
        return (
          <ListSidebarGroupWithSpinner isLoading={this.props.fetchingList} />
        );
      default:
        return;
    }
  };

  render() {
    return <>{this.renderIsLoading()}</>;
  }
}

const mapStateToProps = createStructuredSelector({
  link: selectNavLink,
  fetchingConversations: selectConversationFetching,
  fetchingContacts: selectContactsFetching,
  fetchingGroups: fetchingGroup,
  fetchingDid: selectDidFetching,
  fetchingList: selectListFetching,
});

export default connect(mapStateToProps)(LeftPanel);
