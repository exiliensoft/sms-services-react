import React from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  openSidebar,
  setNavLink,
  updateNewDidModal,
} from "../../reducers/home/home.actions";
import {
  selectNavLink,
  selectOpenSidebar,
} from "../../reducers/home/home.selectors";
import { selectDidData } from "../../reducers/did/did.selectors";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import ModifyDidModal from "../Modals/ModifyDidModal";
import PurchaseDidModal from "../Modals/PurchaseDidModal.jsx";
import SidebarGroup from "../SidebarGroupItem/SidebarGroup";
import DeleteDidModal from "../DeleteModals/DeleteDidModal";
import "./SidebarGroup.scss";

class DidSidebarGroup extends React.Component {
  state = {
    searchField: "",
    showBuyDidModal: false,
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

    if (this.state.filterGroups && this.state.filterGroups.length > 0) {
      filteredNumbers = filteredNumbers.filter((obj) =>
        obj && obj._group
          ? this.state.filterGroups.includes(obj._group._id)
          : obj
      );
    }

    return (
      <>
        <PurchaseDidModal />
        <ModifyDidModal />
        <DeleteDidModal />
        <div
          className={`sidebar-group ${
            isMobile && this.props.openSidebar ? "mobile-open" : ""
          }`}
        >
          <div className="sidebar active">
            <header>
              <span>DID</span>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a
                    className="btn btn-light"
                    href="#"
                    data-toggle="modal"
                    data-target="#addFriends"
                    onClick={() => this.props.updateNewDidModal(true)}
                  >
                    Buy DID(s)
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
  dids: selectDidData,
});

const mapDispatchToProps = (dispatch) => ({
  setNavLink: (link) => dispatch(setNavLink(link)),
  setOpenSidebar: (sidebar) => dispatch(openSidebar(sidebar)),
  updateNewDidModal: (value) => dispatch(updateNewDidModal(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DidSidebarGroup);
