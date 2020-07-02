import React from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { openSidebar, setNavLinkAsync } from "../../reducers/home/home.actions";
import { userLogout } from "../../reducers/user/user.actions";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import SettingModal from "../Modals/SettingModal";
import NavigationItem from "../NavigationItem/NavigationItem";
import NavigationItemModel from "../NavigationItemModel/NavigationItemModel";
import "./Navigation.css";

class Navigation extends React.Component {
  state = {
    showNewSettingModal: false,
    links: [
      {
        id: 1,
        target: "chats",
        className: "ti-comment-alt",
        notifiy_badge: "",
        brackets: "",
      },
      {
        id: 2,
        target: "contacts",
        className: "ti-book",
        notifiy_badge: "",
        brackets: "",
      },
      {
        id: 4,
        target: "groups",
        className: "ti-panel",
        notifiy_badge: "",
        brackets: "",
      },
      {
        id: 4,
        target: "dids",
        className: "ti-list-ol",
        notifiy_badge: "",
        brackets: "",
      },
      {
        id: 5,
        target: "lists",
        className: "ti-signal",
        notifiy_badge: "",
        brackets: "brackets",
      },
    ],
    models: [
      {
        id: 2,
        target: "#settingModal",
        className: "ti-user",
        modal: "setting",
      },
    ],
  };

  handleClick = (target) => {
    const { setNavLink, openSidebar } = this.props;
    setNavLink(target);
    if (isMobile) {
      openSidebar(true);
    }
  };

  handleShow = async (modal) => {
    if (modal === "setting") {
      this.setState({ showNewSettingModal: true });
    }
  };

  handleClose = () => {
    this.setState({ purchaseAmount: undefined });
    this.setState({ showNewSettingModal: false });
  };

  render(props) {
    return (
      <>
        {/* ------------------------------------------------- */
        /* Navigation Icon Tabs */
        /* ------------------------------------------------- */}
        <SettingModal
          showNewSettingModal={this.state.showNewSettingModal}
          handleClose={this.handleClose}
        />
        <nav className="navigation">
          <div className="nav-group">
            <ul>
              <li key="logo">
                <a className="logo">
                  <img src="/media/svg/soho-logo.svg" />
                </a>
              </li>

              {this.state.links.map((item) => (
                <NavigationItem
                  id={item.id}
                  item={item}
                  handleClick={this.handleClick}
                />
              ))}

              {this.state.models.map(({ id, ...otherLinks }) => (
                <NavigationItemModel
                  id={id}
                  {...otherLinks}
                  handleClick={this.handleShow}
                />
              ))}

              <li key="logout">
                <Link to="/" onClick={(_) => this.props.userLogout()}>
                  <i className="ti-power-off"></i>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setNavLink: (link) => dispatch(setNavLinkAsync(link)),
  openSidebar: (sidebar) => dispatch(openSidebar(sidebar)),
  userLogout: (_) => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
