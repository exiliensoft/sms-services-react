import React from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectContactsData } from "../../reducers/contact/contact.selectors";
import { selectGroupData } from "../../reducers/group/group.selectors";
import { selectOpenSidebar } from "../../reducers/home/home.selectors";
import SidebarGroup from "../SidebarGroupItem/SidebarGroup";
import "./SidebarGroup.scss";

class ContactSidebarGroup extends React.Component {
  state = {
    searchField: "",
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getAdminName = (contactAdmin) => {
    let adminName = "";
    this.props.groups.data.filter((group) => {
      if (group.user.id == contactAdmin) {
        adminName = group.user.given_name;
      }
    });
    return adminName;
  };

  render() {
    let selectedObj = this.props.contacts;
    selectedObj.data = selectedObj.data.map((selected) => ({
      ...selected,
      adminName: this.getAdminName(selected._user),
    }));
    let filteredContacts = selectedObj.data.filter((obj) => {
      if (!obj || !obj.phone_number) {
        return true;
      }
      let searchResult= obj.phone_number.includes(this.state.searchField.toLowerCase());
      obj.links.map((fieldValue) => {
        if (fieldValue.value.includes(this.state.searchField.toLowerCase())) {
          searchResult= true;
        }
      });
      return searchResult
    });

    if (this.state.filterGroups && this.state.filterGroups.length > 0) {
      filteredContacts = filteredContacts.filter((obj) =>
        obj && obj._group
          ? this.state.filterGroups.includes(obj._group._id)
          : obj
      );
    }

    return (
      <>
        <div
          className={`sidebar-group ${
            isMobile && this.props.openSidebar ? "mobile-open" : ""
            }`}
        >
          <div className="sidebar active">
            <header>
              <span>Contacts</span>
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
            <SidebarGroup
              items={filteredContacts.slice(0).reverse()}
              selectedObj="contacts"
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  openSidebar: selectOpenSidebar,
  contacts: selectContactsData,
  groups: selectGroupData,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactSidebarGroup);
