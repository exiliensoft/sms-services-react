import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import LeftPanel from "../../components/Panels/LeftPanel";
import MainPanel from "../../components/Panels/MainPanel";
import { fetchContactsStartAsync } from "../../reducers/contact/contact.actions";
import { fetchChatStartAsync } from "../../reducers/conversation/conversation.actions";
import { fetchFieldsStartAsync } from "../../reducers/field/field.action";
import { fetchGroupStartAsync } from "../../reducers/group/group.actions";
import { setNavLinkAsync } from "../../reducers/home/home.actions";
import { fetchListsStartAsync } from "../../reducers/list/list.actions";
import { fetchDidStartAsync } from "../../reducers/did/did.actions";
import { fetchChatPlansAsync } from "../../reducers/plan/plan.actions";
import "./Homepage.css";

class HomePage extends React.Component {
  componentDidMount = (_) => {
    const {
      fetchGroupStartAsync,
      fetchDidStartAsync,
      fetchChatStartAsync,
      fetchChatPlansAsync,
      fetchContactsStartAsync,
      fetchListsStartAsync,
      setNavLinkAsync,
      fetchFieldsStartAsync,
    } = this.props;
    fetchChatStartAsync();
    fetchDidStartAsync();
    fetchGroupStartAsync(true);
    fetchChatPlansAsync();
    fetchContactsStartAsync();
    fetchListsStartAsync();
    fetchFieldsStartAsync();
    setNavLinkAsync(localStorage.getItem("link") || "chats");
  };

  render() {
    return (
      <div className="content" style={{ "overflowX": "scroll" }}>
        <LeftPanel />
        <MainPanel />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchGroupStartAsync: (status) =>
    dispatch(fetchGroupStartAsync(status)),
  fetchDidStartAsync: () => dispatch(fetchDidStartAsync()),
  fetchChatStartAsync: () => dispatch(fetchChatStartAsync()),
  fetchChatPlansAsync: () => dispatch(fetchChatPlansAsync()),
  fetchContactsStartAsync: () => dispatch(fetchContactsStartAsync()),
  fetchListsStartAsync: () => dispatch(fetchListsStartAsync()),
  setNavLinkAsync: (link) => dispatch(setNavLinkAsync(link)),
  fetchFieldsStartAsync: () => dispatch(fetchFieldsStartAsync()),
});
const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
