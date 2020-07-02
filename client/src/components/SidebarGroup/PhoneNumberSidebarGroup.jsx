import React from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  openSidebar,
  setNavLink,
  updateNewPhonenumberModal,
} from "../../reducers/home/home.actions";
import {
  selectNavLink,
  selectOpenSidebar,
} from "../../reducers/home/home.selectors";
import { selectPhoneNumberData } from "../../reducers/phonenumber/did.selectors";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import ModifyPhonenumberModal from "../Modals/ModifyPhonenumberModal";
import PurchasePhoneNumberModal from "../Modals/PurchasePhoneNumberModal.jsx";
import SidebarGroup from "../SidebarGroupItem/SidebarGroup";
import "./SidebarGroup.scss";

class PhoneSidebarGroup extends React.Component {
  state = {
    searchField: "",
    showBuyPhoneNumberModal: false,
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    let selectedObj = this.props.dids;
    let filteredNumbers = selectedObj.data.filter((obj) =>
      obj && obj.number
        ? obj.number
            .toLowerCase()
            .includes(this.state.searchField.toLowerCase())
        : obj
    );

    if (this.state.filterSMSGroups && this.state.filterSMSGroups.length > 0) {
      filteredNumbers = filteredNumbers.filter((obj) =>
        obj && obj._sms_group
          ? this.state.filterSMSGroups.includes(obj._sms_group._id)
          : obj
      );
    }

    return (
      <>
        <PurchasePhoneNumberModal />
        <ModifyPhonenumberModal />
        <deleteDidModal />
        <div
          className={`sidebar-group ${
            isMobile && this.props.openSidebar ? "mobile-open" : ""
          }`}
        >
          <div className="sidebar active">
            <header>
              <span>Phone number</span>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a
                    className="btn btn-light"
                    href="#"
                    data-toggle="modal"
                    data-target="#addFriends"
                    onClick={() => this.props.updateNewPhonenumberModal(true)}
                  >
                    Buy Number
                  </a>
                </li>
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
              items={filteredNumbers.slice(0).reverse()}
              selectedObj="dids"
            />
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
  dids: selectPhoneNumberData,
});

const mapDispatchToProps = (dispatch) => ({
  setNavLink: (link) => dispatch(setNavLink(link)),
  setOpenSidebar: (sidebar) => dispatch(openSidebar(sidebar)),
  updateNewPhonenumberModal: (value) =>
    dispatch(updateNewPhonenumberModal(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneSidebarGroup);
