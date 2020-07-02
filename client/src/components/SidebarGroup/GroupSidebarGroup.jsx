import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectGroupData } from "../../reducers/group/group.selectors";
import {
  openSidebar,
  setNavLink,
  updateNewSmsModal,
} from "../../reducers/home/home.actions";
import {
  selectNavLink,
  selectOpenSidebar,
} from "../../reducers/home/home.selectors";
import { fetchSameDomainUsersList } from "../../reducers/user/user.actions";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import DeleteGroupModal from "../DeleteModals/DeleteGroupModal";
import GroupModal from "../Modals/GroupModal";
import PurchaseDidModal from "../Modals/PurchaseDidModal";
import SidebarGroup from "../SidebarGroupItem/SidebarGroup";
import "./SidebarGroup.scss";

class ChatSidebarGroup extends React.Component {
  state = {
    showAddGroupModal: false,
    searchField: "",
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    let selectedObj = this.props.groups;

    let filteredGroups = selectedObj.data.filter((obj) =>
      obj && obj.group_name
        ? obj.group_name
            .toLowerCase()
            .includes(this.state.searchField.toLowerCase())
        : obj
    );

    let rejectedGroups = selectedObj.member_groups
      ? selectedObj.member_groups.filter((group) => {
          let memberData = group.members.filter(
            (member) => member._user_email === this.props.currentUser.email
          );
          if (memberData[0] && memberData[0].status === 2) {
            return true;
          }
          return false;
        })
      : [];

    let acceptedGroups = selectedObj.member_groups
      ? selectedObj.member_groups.filter((group) => {
          let memberData = group.members.filter(
            (member) => member._user_email === this.props.currentUser.email
          );
          if (memberData[0] && memberData[0].status === 1) {
            return true;
          }
          return false;
        })
      : [];

    let invitedGroups = selectedObj.member_groups
      ? selectedObj.member_groups.filter((group) => {
          let memberData = group.members.filter(
            (member) => member._user_email === this.props.currentUser.email
          );
          if (memberData[0] && memberData[0].status === 0) {
            return true;
          }
          return false;
        })
      : [];

    return (
      <>
        <PurchaseDidModal />
        <GroupModal />
        <DeleteGroupModal />
        <div
          className={`sidebar-group ${
            isMobile && this.props.openSidebar ? "mobile-open" : ""
          }`}
        >
          <div className="sidebar active">
            <header>
              <span>Group</span>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a
                    className="btn btn-light"
                    href="#"
                    data-toggle="modal"
                    data-target="#addFriends"
                    onClick={() => {
                      this.props.fetchSameDomainUsersList();
                      this.props.updateNewSmsModal(true);
                    }}
                  >
                    <i className="ti-plus btn-icon"></i> New Group
                  </a>
                </li>
              </ul>
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
              <Tabs defaultActiveKey="open">
                <Tab eventKey="open" title="Groups">
                  <ul className="list-group list-group-flush">
                    <SidebarGroup
                      items={filteredGroups.slice(0).reverse()}
                      selectedObj="groups"
                    />
                    <SidebarGroup
                      items={acceptedGroups.slice(0).reverse()}
                      selectedObj="groups_accepted"
                    />
                    <SidebarGroup
                      items={invitedGroups.slice(0).reverse()}
                      selectedObj="groups_invited"
                    />
                  </ul>
                </Tab>
                <Tab eventKey="close" title="Rejected Groups">
                  <PerfectScrollbar>
                    <SidebarGroup
                      items={rejectedGroups.slice(0).reverse()}
                      selectedObj="groups_rejected"
                    />
                  </PerfectScrollbar>
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
  link: selectNavLink,
  openSidebar: selectOpenSidebar,
  currentUser: selectCurrentUser,
  groups: selectGroupData,
});

const mapDispatchToProps = (dispatch) => ({
  setNavLink: (link) => dispatch(setNavLink(link)),
  setOpenSidebar: (sidebar) => dispatch(openSidebar(sidebar)),
  updateNewSmsModal: (value) => dispatch(updateNewSmsModal(value)),
  fetchSameDomainUsersList: (domain) =>
    dispatch(fetchSameDomainUsersList(domain)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSidebarGroup);
