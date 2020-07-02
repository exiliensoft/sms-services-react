import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  openSidebar,
  setNavLink,
  updateNewSmsModal,
} from "../../reducers/home/home.actions";
import {
  selectNavLink,
  selectOpenSidebar,
} from "../../reducers/home/home.selectors";
import { selectSmsGroupData } from "../../reducers/smsgroups/smsgroup.selectors";
import { fetchSameDomainUsersList } from "../../reducers/user/user.actions";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import DeleteSmsGroupModal from "../DeleteModals/DeleteSmsGroupModal";
import PurchasePhoneNumberModal from "../Modals/PurchasePhoneNumberModal";
import SmsGroupModal from "../Modals/SmsGroupModal";
import SidebarGroup from "../SidebarGroupItem/SidebarGroup";
import "./SidebarGroup.scss";

class ChatSidebarGroup extends React.Component {
  state = {
    showAddSMSGroupModal: false,
    searchField: "",
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    let selectedObj = this.props.sms_groups;

    let filteredSmsGroups = selectedObj.data.filter((obj) =>
      obj && obj.group_name
        ? obj.group_name
            .toLowerCase()
            .includes(this.state.searchField.toLowerCase())
        : obj
    );

    let rejectedSmsGroups = selectedObj.member_groups
      ? selectedObj.member_groups.filter((group) => {
          let memberData = group.Members.filter(
            (member) => member._user_email === this.props.currentUser.email
          );
          if (memberData[0] && memberData[0].status === 2) {
            return true;
          }
          return false;
        })
      : [];

    let acceptedSmsGroups = selectedObj.member_groups
      ? selectedObj.member_groups.filter((group) => {
          let memberData = group.Members.filter(
            (member) => member._user_email === this.props.currentUser.email
          );
          if (memberData[0] && memberData[0].status === 1) {
            return true;
          }
          return false;
        })
      : [];

    let invitedSmsGroups = selectedObj.member_groups
      ? selectedObj.member_groups.filter((group) => {
          let memberData = group.Members.filter(
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
        <PurchasePhoneNumberModal />
        <SmsGroupModal />
        <DeleteSmsGroupModal />
        <div
          className={`sidebar-group ${
            isMobile && this.props.openSidebar ? "mobile-open" : ""
          }`}
        >
          <div className="sidebar active">
            <header>
              <span>SMS Group</span>
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
                <Tab eventKey="open" title="SMS Groups">
                  <ul className="list-group list-group-flush">
                    <SidebarGroup
                      items={filteredSmsGroups.slice(0).reverse()}
                      selectedObj="sms_groups"
                    />
                    <SidebarGroup
                      items={acceptedSmsGroups.slice(0).reverse()}
                      selectedObj="sms_groups_accepted"
                    />
                    <SidebarGroup
                      items={invitedSmsGroups.slice(0).reverse()}
                      selectedObj="sms_groups_invited"
                    />
                  </ul>
                </Tab>
                <Tab eventKey="close" title="Rejected Groups">
                  <PerfectScrollbar>
                    <SidebarGroup
                      items={rejectedSmsGroups.slice(0).reverse()}
                      selectedObj="sms_groups_rejected"
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
  sms_groups: selectSmsGroupData,
});

const mapDispatchToProps = (dispatch) => ({
  setNavLink: (link) => dispatch(setNavLink(link)),
  setOpenSidebar: (sidebar) => dispatch(openSidebar(sidebar)),
  updateNewSmsModal: (value) => dispatch(updateNewSmsModal(value)),
  fetchSameDomainUsersList: (domain) =>
    dispatch(fetchSameDomainUsersList(domain)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSidebarGroup);
