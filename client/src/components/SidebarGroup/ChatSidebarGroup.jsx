import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectContactsData } from "../../reducers/contact/contact.selectors";
import { selectConversationData, selectFilterGroups } from "../../reducers/conversation/conversation.selectors";
import { selectGroupData } from "../../reducers/group/group.selectors";
import { openSidebar, updateConversationModal, updateFilterConversationModal } from "../../reducers/home/home.actions";
import { selectOpenSidebar, showFilterConversationModal, showNewConversationModal } from "../../reducers/home/home.selectors";
import { selectMessageConversationId } from "../../reducers/message/message.selectors";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import FilterConversationModal from "../Modals/FilterConversationModal";
import NewConversationModal from "../Modals/NewConversationModal";
import SidebarGroup from "../SidebarGroupItem/SidebarGroup";
import "./SidebarGroup.scss";

class ChatSidebarGroup extends React.Component {
  state = {
    searchField: "",
  };

  componentDidMount = (_) => {
    document.addEventListener(
      "mousedown",
      this.handleClickOutsideFilter,
      false
    );
    document.addEventListener(
      "mousedown",
      this.handleClickOutsideNewConversation,
      false
    );
  };

  componentWillUnmount = (_) => {
    document.removeEventListener(
      "mousedown",
      this.handleClickOutsideFilter,
      false
    );
    document.removeEventListener(
      "mousedown",
      this.handleClickOutsideNewConversation,
      false
    );
  };

  handleClickOutsideFilter = (event) => {
    if (this.filter && this.filter.contains(event.target)) {
      this.props.updateFilterConversationModal(true);
      return;
    }
    this.props.updateFilterConversationModal(false);
  };

  handleClickFilter = (event) => {
    if (this.filter && this.filter.contains(event.target)) {
      this.props.updateFilterConversationModal(true);
      return;
    }
  };
  handleClickOutsideNewConversation = (event) => {
    if (this.newConvo && this.newConvo.contains(event.target)) {
      this.props.updateConversationModal(true);
      return;
    }
    this.props.updateConversationModal(false);
  };

  handleClickFilterNewConversation = (event) => {
    if (this.newConvo && this.newConvo.contains(event.target)) {
      this.props.updateConversationModal(true);
      return;
    }
  };

  getGroup = (_group) => {
    return [
      ...this.props.groups.data,
      ...this.props.groups.member_groups,
    ].filter((group) => group.id === _group)[0];
  };

  getContact = (contact_id, _group) => {
    let contact = this.props.contacts.data.find(
      (contact) => contact.id == contact_id
    );
    if (!contact) {
      return "";
    }
    let group = this.getGroup(_group);
    let selectedFields = contact.links.filter((fieldValue) =>
      group.checked_fields.includes(
        fieldValue.Field ? fieldValue.Field.id : null
      )
    ).map((field) => field.value);
    return (selectedFields[0] || "") + " " + (selectedFields[1] || "");
  };

  getAssignedUser = (conversation) => {
    let group = this.getGroup(conversation._group);
    let assigned = group.members.filter((member) =>
      member.user ? member.user.id === conversation.assignee : false
    )[0];
    if (assigned && assigned.user) return assigned.user;
    if (conversation.assignee === group.user.id) {
      // check if admin is assigned to the group
      return group.user;
    }
    return null;
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    let selectedObj = this.props.chats;
    console.log("this.props.chats");
    console.log(this.props.chats);

    selectedObj.data = selectedObj.data.map((selected) => ({
      ...selected,
      group: this.getGroup(selected._group).group_name,
      checkedField_Values: this.getContact(
        selected._contact,
        selected._group
      ),
      opened: this.props.currentConversation == selected.id ? true : false,
      assigned_user: this.getAssignedUser(selected)
        ? this.getAssignedUser(selected).given_name
        : "",
    }));

    let filteredChats = selectedObj.data.filter((obj) =>
      obj && obj.checkedField_Values != ""
        ? obj.checkedField_Values
          .toLowerCase()
          .includes(this.state.searchField.toLowerCase())
        : true
    );

    if (this.props.filterGroups) {
      filteredChats = filteredChats.filter((obj) =>
        obj && obj._group
          ? this.props.filterGroups.includes(obj._group)
          : true
      );
    }

    let assignedChats = filteredChats.filter((obj) =>
      obj && obj.assignee ? obj.assignee === this.props.currentUser.id : false
    );
    let unAssignedChats = filteredChats.filter((obj) => !obj.assignee);

    return (
      <>
        <div
          className={`sidebar-group ${
            isMobile && this.props.openSidebar ? "mobile-open" : ""
            }`}
        >
          <div className="sidebar active">
            <header>
              <span>Chat</span>
              {
                <ul className="list-inline">
                  {this.props.groups &&
                    !this.props.filterConversationModal ? (
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        title="Filter Groups"
                        ref={(filter) => (this.filter = filter)}
                      >
                        <a
                          className="btn btn-light filterGroupBtn"
                          data-toggle="modal"
                          data-target="#filterGroups"
                          onClick={(event) => this.handleClickFilter(event)}
                        >
                          <i className="fa fa-users"></i>
                        </a>
                      </li>
                    ) : (
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        title="Filter Groups"
                        ref={(filter) => (this.filter = filter)}
                      >
                        <a
                          className="btn btn-light filterGroupBtn"
                          data-toggle="modal"
                          data-target="#filterGroups"
                          onClick={(event) => this.handleClickFilter(event)}
                        >
                          <i className="fa fa-users"></i>
                        </a>
                        {/* {this.renderCard()} */}
                        <FilterConversationModal />
                      </li>
                    )}
                  {this.props.groups && !this.props.newConversationModal ? (
                    <li
                      className="list-inline-item"
                      ref={(newConvo) => (this.newConvo = newConvo)}
                    >
                      <a
                        className="btn btn-light"
                        data-toggle="tooltip"
                        title="New Conversation"
                        data-target="#addConversation"
                        onClick={(event) =>
                          this.handleClickFilterNewConversation(event)
                        }
                      >
                        <i className="ti-comment-alt"></i>
                      </a>
                    </li>
                  ) : (
                      <li
                        className="list-inline-item"
                        ref={(newConvo) => (this.newConvo = newConvo)}
                      >
                        <a
                          className="btn btn-light"
                          data-toggle="tooltip"
                          title="New Conversation"
                          data-target="#addConversation"
                          onClick={(event) =>
                            this.handleClickFilterNewConversation(event)
                          }
                        >
                          <i className="ti-comment-alt"></i>
                        </a>
                        <NewConversationModal />
                      </li>
                    )}
                  <li className="list-inline-item d-lg-none d-sm-block">
                    <a
                      href="#"
                      className="btn btn-light sidebar-close"
                      onClick={() => this.props.setOpenSidebar(false)}
                    >
                      <i className="ti-close"></i>
                    </a>
                  </li>
                </ul>
              }
            </header>

            <form>
              <input
                type="text"
                className="form-control"
                placeholder="Search chat"
                name="searchField"
                onChange={this.handleInputChange}
                value={this.state.searchField}
              />
            </form>
            <div className="sidebar-body">
              <Tabs defaultActiveKey="assigned">
                <Tab eventKey="assigned" title="Assigned">
                  <SidebarGroup
                    items={assignedChats
                      .slice(0)
                      .sort((val) => (!val.is_close ? -1 : 1))}
                    selectedObj="chats"
                  />
                </Tab>
                <Tab eventKey="unassigned" title="Unassigned">
                  <SidebarGroup
                    items={unAssignedChats
                      .slice(0)
                      .sort((val) => (!val.is_close ? -1 : 1))}
                    selectedObj="chats"
                  />
                </Tab>
                <Tab eventKey="all" title="All">
                  <SidebarGroup
                    items={filteredChats
                      .slice(0)
                      .sort((val) => (!val.is_close ? -1 : 1))}
                    selectedObj="chats"
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  openSidebar: selectOpenSidebar,
  groups: selectGroupData,
  chats: selectConversationData,
  filterGroups: selectFilterGroups,
  filterConversationModal: showFilterConversationModal,
  newConversationModal: showNewConversationModal,
  currentUser: selectCurrentUser,
  contacts: selectContactsData,
  currentConversation: selectMessageConversationId,
});

const mapDispatchToProps = (dispatch) => ({
  setOpenSidebar: (sidebar) => dispatch(openSidebar(sidebar)),
  updateConversationModal: (value) => dispatch(updateConversationModal(value)),
  updateFilterConversationModal: (value) =>
    dispatch(updateFilterConversationModal(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSidebarGroup);
