import React, { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createNewConversation, getUsersForConversation, updateConversation } from "../../reducers/conversation/conversation.actions";
import { selectConversationData, selectUsers } from "../../reducers/conversation/conversation.selectors";
import { selectDidData } from "../../reducers/did/did.selectors";
import { selectGroupData } from "../../reducers/group/group.selectors";
import { toggleProfileHidden } from "../../reducers/home/home.actions";
import { createNewMessage, fetchMessageStartAsync, uploadFile } from "../../reducers/message/message.actions";
import { selectMessageConversationId, selectMessageData, selectMessageGroup } from "../../reducers/message/message.selectors";
import { selectSocketData } from "../../reducers/socket/socket.selectors";
import ChatItem from "../ChatItem/ChatItem";
import "./Chat.scss";
import ChatInput from "./ChatInput";

const Chat = ({
  toggleProfileHidden,
  createNewMessage,
  uploadFile,
  chatData,
  conversationId,
  socket,
  users,
  groups,
  group,
  conversations,
  updateConversation,
  dids,
  fetchMessageStartAsync,
  getUsersForConversation,
  createNewConversation,
}) => {
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]);
  const [internal, setInternal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  let chatContainerRef = useRef();
  const sendMessage = (event) => {
    event.preventDefault();
    if (message && message.trim()) {
      createNewMessage({
        conversationId,
        message,
        internal,
        socket,
        group: chatData._group,
        tags,
        is_close: getConversation().is_close,
      });
      setMessage("");
      setTags([]);
    }
  };

  useEffect(() => {
    if (chatContainerRef)
      chatContainerRef = { ...chatContainerRef }.scrollTop = 0;
    document.getElementById("msgScrollbar").scrollTop = 100000;
  }, [chatData]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === "message") {
      setMessage(value);
    } else if (name === "internal") {
      setInternal(checked);
    }
  };

  const fileChangeHandler = (event) => {
    const file = event.target.files[0];
    uploadFile({ conversationId, file, internal, socket });
  };

  const getConversation = () => {
    return conversations.data.filter(
      (conversation) => conversation.id === conversationId
    )[0];
  };

  const getGroup = () => {
    return [...groups.data, ...groups.member_groups].filter(
      (g) => g.id === group
    )[0];
  };

  const getAssignedUser = () => {
    let group = getGroup();
    if (!group) {
      return null;
    }
    let assigned = group.members.filter((member) =>
      member.user ? member.user.id === getConversation().assignee : false
    )[0];
    if (assigned && assigned.user) return assigned.user;
    if (getConversation().assignee === group.user.id) {
      // check if admin is assigned to the group
      return group.user;
    }
    return null;
  };

  const getDid = function (id) {
    if (dids.data.find((did) => did.id == id)) {
      return dids.data.filter((did) => did.id == id)[0].number;
    }
    return "[Deleted]";
  };

  const changeDid = (event) => {
    let openCoversation = conversations.data.find(
      (conversation) =>
        conversation._did == event.target.value &&
        !conversation.is_close &&
        conversation._contact == chatData.contact.id
    );
    if (openCoversation) {
      fetchMessageStartAsync({
        key: openCoversation.id,
        name: openCoversation.name,
        phone: event.target.value, // check
        did: openCoversation._did,
        _group: openCoversation._group,
      });
      getUsersForConversation({ conversationId: openCoversation.id });
      return;
    }
    if (chatData.data.length === 0)
      updateConversation(conversationId, {
        _did: event.target.value,
      });
    else {
      createNewConversation({
        did: event.target.value,
        group: chatData._group,
        phone: chatData.contact.phone_number,
      });
    }
  };

  return (
    <div className="chat">
      {/* ------------------------------------------------- */
      /* Chat Screen Header */
      /* ------------------------------------------------- */}
      <div className="chat-header">
        <div className="chat-header-user" style={{ "width": "100%" }}>
          <div style={{ "width": "100%" }}>
            <h2>{chatData.name}</h2>
            <small className="text-muted">
              <i> + {chatData.contact.phone_number}</i>
              <br />
              <div style={{ "float": "right" }}>
                {/* <i>Did: {getDid(getConversation()._did)}</i> */}
                <br />
                {/* <i>
                  Did
                  {getAssignedUser()
                    ? getAssignedUser().given_name
                    : "Unassigned"}
                </i> */}
              </div>
              <div style={{ "float": "right", marginRight: "30px" }}>
                Assignee:{" "}

                <select
                  background="green"
                  style={{ "backdropFilter": "green", background: "#3db16b", color: "white" }}
                  name="members"
                  className="form-control"
                  onChange={(event) =>
                    updateConversation(conversationId, {
                      assignee: event.target.value,
                    })
                  }
                >
                  <option>Choose</option>
                  {[
                    ...getGroup().members.map((member) => member.User),
                    getGroup().User,
                  ].map((member) => {
                    if (!member) {
                      // a member who was invited but is not yet registered on the platform.
                      return;
                    }
                    return (
                      <option
                        key={member.given_name}
                        value={member.id}
                        selected={
                          member.id ===
                          (getAssignedUser() ? getAssignedUser().id : null)
                        }
                      >
                        {member.given_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div style={{ "float": "right", marginRight: "30px" }}>
                Did
                <select
                  name="phonenumbers"
                  className="form-control"
                  onChange={(event) => changeDid(event)}
                >
                  <option>Choose</option>
                  {dids.data.map((number) => {
                    return (
                      <option
                        key={number.id}
                        value={number.id}
                        selected={number.id == getConversation()._did}
                      >
                        {number.number}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <div className="form-item custom-control custom-switch">
                  <input
                    type="checkbox"
                    defaultChecked={localStorage.getItem("toggle")}
                    className="custom-control-input"
                    id="customSwitch13"
                    onChange={(e) => {
                      if (localStorage.getItem("toggle")) {
                        localStorage.clear("toggle");
                      } else {
                        localStorage.setItem("toggle", true);
                      }
                      setRefresh(!refresh);
                    }}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customSwitch13"
                  >
                    Filter by current phone
                  </label>
                </div>
              </div>
            </small>
          </div>
        </div>
        <div className="chat-header-action">
          <ul className="list-inline">
            <li className="list-inline-item" onClick={toggleProfileHidden}>
              <a href="#" className="btn btn-secondary">
                <i className="ti-info-alt" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* ------------------------------------------------- */
      /* Chat Screen Messages Display*/
      /* ------------------------------------------------- */}
      <PerfectScrollbar
        containerRef={(ref) => {
          chatContainerRef = ref;
        }}
        id="msgScrollbar"
      >
        <div className="chat-body">
          <div className="messages" id="messages">
            {chatData.oldMessages &&
              chatData.oldMessages
                .filter((conv) =>
                  localStorage.getItem("toggle")
                    ? getConversation()._did == conv[conv.length - 1]._did
                    : true
                )
                .map((oldConversation) => {
                  return (
                    <>
                      {oldConversation.map(({ id, ...otherProps }) => (
                        <>
                          <ChatItem
                            key={id}
                            did={getDid(otherProps._did)}
                            {...otherProps}
                          />
                        </>
                      ))}
                      <div
                        style={{
                          height: "2px",
                          background: "black",
                          width: "100%",
                        }}
                      ></div>
                    </>
                  );
                })}
            {chatData.data.map(({ id, ...otherProps }) => (
              <ChatItem key={id} {...otherProps} />
            ))}
          </div>
        </div>
      </PerfectScrollbar>
      {/* ------------------------------------------------- */
      /* Chat Screen Footer */
      /* ------------------------------------------------- */}
      <div className="chat-footer">
        <form
          action=""
          onSubmit={sendMessage}
          className={!!internal ? "internal" : ""}
        >
          <ChatInput
            internal={internal}
            users={users}
            setTags={setTags}
            handleChange={handleChange}
            message={message}
          />
          <div className="form-item custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customSwitchInternal"
              name="internal"
              onChange={handleChange}
            />
            <label
              className="custom-control-label"
              htmlFor="customSwitchInternal"
            >
              Internal
            </label>
          </div>
          <div className="form-buttons">
            <label className="btn btn-light btn-floating">
              <input
                type="file"
                className="form-control"
                onChange={fileChangeHandler}
              />
              <i className="fa fa-paperclip"></i>
            </label>
            <button className="btn btn-primary btn-floating" type="submit">
              <i className="fa fa-send"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  chatData: selectMessageData,
  conversationId: selectMessageConversationId,
  conversations: selectConversationData,
  socket: selectSocketData,
  users: selectUsers,
  group: selectMessageGroup,
  groups: selectGroupData,
  dids: selectDidData,
});
const mapDispatchToProps = (dispatch) => ({
  toggleProfileHidden: () => dispatch(toggleProfileHidden()),
  createNewMessage: (obj) => dispatch(createNewMessage(obj)),
  uploadFile: (obj) => dispatch(uploadFile(obj)),
  updateConversation: (value, body) =>
    dispatch(updateConversation(value, body)),
  fetchMessageStartAsync: (obj) => dispatch(fetchMessageStartAsync(obj)),
  getUsersForConversation: (obj) => dispatch(getUsersForConversation(obj)),
  createNewConversation: (conversation) =>
    dispatch(createNewConversation(conversation)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chat);