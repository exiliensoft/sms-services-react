import React from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { openSidebar, setNavLink } from "../../reducers/home/home.actions";
import { selectNavLink, selectOpenSidebar } from "../../reducers/home/home.selectors";
import { selectListsData } from "../../reducers/list/list.selectors";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import SidebarGroup from "../SidebarGroupItem/SidebarGroup";
import "./SidebarGroup.scss";

class ListSidebarGroup extends React.Component {
    state = {
        searchField: "",
    };

    render() {
        let filteredLists = this.props.lists.data.filter((obj) => obj && obj.name ? obj.name.toLowerCase().includes(this.state.searchField.toLowerCase()) : obj
        );
        return (
            <>
                <div
                    className={`sidebar-group ${
                        isMobile && this.props.openSidebar ? "mobile-open" : ""
                        }`}
                >
                    <div className="sidebar active">
                        <header>
                            <span>List</span>
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
                        <SidebarGroup items={filteredLists.slice(0).reverse()} selectedObj="lists" />
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
    lists: selectListsData,
});

const mapDispatchToProps = (dispatch) => ({
    setNavLink: (link) => dispatch(setNavLink(link)),
    setOpenSidebar: (sidebar) => dispatch(openSidebar(sidebar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListSidebarGroup);
