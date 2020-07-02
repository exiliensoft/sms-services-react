import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { toggleContact } from "../../reducers/contact/contact.actions";
import { selectOpenContacts } from "../../reducers/contact/contact.selectors";
import {
  getUsersForConversation,
  setSeen,
} from "../../reducers/conversation/conversation.actions";
import {
  acceptGroupRequest,
  rejectGroupRequest,
} from "../../reducers/group/group.actions";
import { selectGroupData } from "../../reducers/group/group.selectors";
import {
  deleteDidModal,
  deleteGroupModal,
  updateModifyDidModal,
  updateModifyGroupModal,
} from "../../reducers/home/home.actions";
import {
  closeMessage,
  fetchMessageStartAsync,
} from "../../reducers/message/message.actions";
import { fetchSameDomainUsersList } from "../../reducers/user/user.actions";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import "./SidebarGroupItem.scss";

class SidebarGroupItem extends React.Component {
  handleClick = (key, name, phone, did, _group) => {
    this.props.fetchMessageStartAsync({
      key,
      name,
      phone,
      did,
      _group,
    });
    this.props.getUsersForConversation({ conversationId: key });
    if (this.props.tags && this.props.tags[this.props.currentUser.id] > 0) {
      this.props.setSeen({
        conversationId: key,
        id: this.props.currentUser.id,
      });
    }
  };

  updateOpenContacts = (value) => {
    if (!this.props.selectOpenContacts.includes(value._id))
      this.props.toggleContact(value);
  };

  filteringGroupName = (group_id) => {
    return this.props.groups.data.map((group) => {
      if (group.id === group_id) {
        return group.group_name;
      }
    });
  };

  renderName = (_) => {
    switch (this.props.selectedObj) {
      case "chats":
        return (
          <>
            <h5>{this.props.checkedField_Values}</h5>
            <p>{this.props.last_message}</p>
            <p>{this.props.group}</p>
            <p>{this.props.assigned_user}</p>
          </>
        );
      case "groups_invited":
      case "groups_accepted":
      case "groups_rejected":
      case "groups":
        return (
          <>
            <h5>{this.props.group_name}</h5>
            <p>{`Creator: ${this.props.owner}`}</p>
            <p>{this.props.group_description}</p>
          </>
        );

      case "dids":
        return (
          <>
            <h5>{this.props.number}</h5>
            <p>{this.props.description}</p>
            <p>Group: {this.filteringGroupName(this.props._group)}</p>
          </>
        );

      case "contacts":
        return (
          <>
            <h5>{this.props.phone_number}</h5>
            {/* <p>{this.props.description}</p> */}
            <p>Owner: {this.props.adminName ? this.props.adminName : "Yours"}</p>
          </>
        );

      case "lists":
        return (
          <>
            <h5>{this.props.number}</h5>
            <p>{this.props.description}</p>
            <p>Group: {this.props._group}</p>
          </>
        );
      default:
        return;
    }
  };

  renderEditAndDelete = () => {
    return (
      <>
        <Dropdown.Item
          href="#"
          onClick={() => {
            switch (this.props.selectedObj) {
              case "groups":
                if (this.props.currentUser.id === this.props._user) {
                  this.props.fetchSameDomainUsersList();
                  this.props.updateModifyGroupModal(this.props);
                }
                break;
              case "dids":
                this.props.updateModifyDidModal(this.props); //TODO: Add check to make sure user owns DID
                return;
              default:
                return;
            }
          }}
        >
          Edit
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          href="#"
          onClick={() => {
            switch (this.props.selectedObj) {
              case "groups":
                return this.props.deleteGroupModal({
                  id: this.props._id,
                  group_name: this.props.group_name,
                  group_description: this.props.group_description,
                  members: this.props.Members,
                });

              case "dids":
                return this.props.deleteDidModal({
                  id: this.props._id,
                  number: this.props.number,
                  carrier: this.props.carrier,
                });

              default:
                return;
            }
          }}
        >
          Delete
        </Dropdown.Item>
      </>
    );
  };

  renderDropdownAccept = () => {
    return (
      <Dropdown.Item
        href="#"
        onClick={() => {
          this.props.acceptGroupRequest(this.props._id);
        }}
      >
        Accept
      </Dropdown.Item>
    );
  };

  renderDropdownReject = () => {
    return (
      <Dropdown.Item
        href="#"
        onClick={() => {
          this.props.rejectGroupRequest(this.props._id);
        }}
      >
        Reject
      </Dropdown.Item>
    );
  };

  render() {
    return (
      <>
        <li
          className={`list-group-item 
          ${
            this.props.tags && this.props.tags[this.props.currentUser.id] >= 0
              ? "open-tag"
              : null
          }
          ${this.props.opened ? "open-chat" : ""}
          ${!this.props.opened && !!this.props.is_close ? "close-chat" : ""}`}
          onClick={() =>
            this.props.selectedObj === "chats"
              ? this.handleClick(
                  this.props._id,
                  this.props.name,
                  this.props.phone,
                  this.props.did,
                  this.props._group
                )
              : this.props.selectedObj === "contacts"
              ? this.updateOpenContacts(this.props)
              : null
          }
        >
          <div className="users-list-body">
            {this.renderName()}
            {(this.props.tags &&
              this.props.tags[this.props.currentUser.id] > 0) ||
            this.props.unread ? (
              <>
                {this.props.tags &&
                  this.props.tags[this.props.currentUser.id] > 0 && (
                    <div className="users-list-action">
                      <div
                        className="new-message-count"
                        style={{ background: "#ede905", color: "black" }}
                      >
                        {this.props.tags[this.props.currentUser.id]}
                      </div>
                    </div>
                  )}
                {this.props.unread && (
                  <div className="users-list-action">
                    <div className="new-message-count">{this.props.unread}</div>
                  </div>
                )}
              </>
            ) : (
              <Dropdown
                className="users-list-action action-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Dropdown.Toggle
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <a data-toggle="dropdown" href="#">
                    <i className="ti-more"></i>
                  </a>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {this.props.selectedObj === "chats" && !this.props.is_close && (
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => {
                        this.props.closeMessage(this.props._id);
                        e.stopPropagation();
                      }}
                    >
                      Close
                    </Dropdown.Item>
                  )}
                  {(this.props.selectedObj === "groups" ||
                    this.props.selectedObj === "dids") &&
                    this.renderEditAndDelete()}
                  {(this.props.selectedObj === "groups_rejected" ||
                    this.props.selectedObj === "groups_invited") &&
                    this.renderDropdownAccept()}
                  {this.props.selectedObj === "groups_invited" &&
                    this.renderDropdownReject()}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </li>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  groups: selectGroupData,
  selectOpenContacts: selectOpenContacts,
});

const mapDispatchToProps = (dispatch) => ({
  fetchMessageStartAsync: ({ key, name, phone, did, _group }) =>
    dispatch(fetchMessageStartAsync({ key, name, phone, did, _group })),
  closeMessage: (conversation) => dispatch(closeMessage(conversation)),
  getUsersForConversation: (obj) => dispatch(getUsersForConversation(obj)),
  setSeen: (obj) => dispatch(setSeen(obj)),
  toggleContact: (payload) => dispatch(toggleContact(payload)),
  updateModifyGroupModal: (value) => dispatch(updateModifyGroupModal(value)),
  updateModifyDidModal: (value) => dispatch(updateModifyDidModal(value)),
  deleteDidModal: (value) => dispatch(deleteDidModal(value)),
  deleteGroupModal: (value) => dispatch(deleteGroupModal(value)),
  fetchSameDomainUsersList: (domain) =>
    dispatch(fetchSameDomainUsersList(domain)),
  acceptGroupRequest: (id) => dispatch(acceptGroupRequest(id)),
  rejectGroupRequest: (id) => dispatch(rejectGroupRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarGroupItem);
