import React from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { updateUser } from "../../reducers/user/user.actions";
import PlanTab from "../Navigation/PlanTab";
import ProfileTab from "../Navigation/ProfileTab";

class Settings extends React.Component {
  state = {
    profileTabKey: "profile",
    picture: undefined,
    given_name: "",
    family_name: "",
    phone: "",
  };

  setKey = (tab, key) => {
    console.log(this.state);
    console.log(tab);
    console.log(key);
    if (key === "profile") {
      this.setState({ settingTabKey: key });
    } else if (key === "plans") {
      this.setState({ settingTabKey: key });
    }
  };

  handleSave = (_) => {
    this.props.updateUser(this.state);
    this.props.handleClose();
  };

  onFileChangeHandler = (event) => {
    this.setState({ picture: event.target.files[0] });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value.trim() });
  };

  render(props) {
    return (
      <>
        {/* ------------------------------------------------- */
        /* Profile and Plans Modal */
        /* ------------------------------------------------- */}
        <Modal
          show={this.props.showNewSettingModal}
          onHide={this.props.handleClose}
          size="sm"
          dialogClassName={this.state.settingTabKey != "plans" ? "small-modal" : "large-modal"}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="ti-user"></i> Account Settings
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
              id="controlled-tab-example"
              activeKey={this.state.settingTabKey}
              onSelect={(key) => this.setKey("settings", key)}
            >
              <Tab eventKey="profile" title="Profile">
                <ProfileTab
                  onFileChangeHandler={this.onFileChangeHandler}
                  handleInputChange={this.handleInputChange}
                />
              </Tab>
              <Tab eventKey="plans" title="Plans">
                <PlanTab />
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (user) => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
