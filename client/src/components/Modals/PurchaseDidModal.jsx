import React from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectGroupData } from "../../reducers/group/group.selectors";
import { updateNewDidModal } from "../../reducers/home/home.actions";
import { showNewDidModal } from "../../reducers/home/home.selectors";
import {
  confirmPurchaseDids,
  searchDid,
} from "../../reducers/did/did.actions";
import { selectPurchaseDids } from "../../reducers/did/did.selectors";
import { selectCurrentUser } from "../../reducers/user/user.selectors";

class PurchaseDidModal extends React.Component {
  state = {
    searchedAreaCode: undefined,
    searchedDIDs: [],
    purchaseDIDDescription: undefined,
    purchaseDIDGroupRoute: undefined,
    groupsForNewNumberRouting: [],
    loading: false,
    errorMessage: undefined,
    selectedDIDs: [],
    justCompletedPurchase: false,
    currentUser: this.props.currentUser,
    carrier: "",
  };

  confirmPurchaseAndLogDid = async (_) => {
    // this.setState({ selectedDIDs: [] })
    this.loadingSpinner();
    this.purchaseSpinner();
    await this.props.confirmPurchaseDids(this.state);
    this.props.updateNewDidModal(null);
  };

  renderPurchaseDidButton = (_) => {
    if (this.state.selectedDIDs.length === 0) {
      return (
        <Button variant="primary" disabled>
          Confirm Purchase
        </Button>
      );
    } else if (
      this.state.selectedDIDs.length > 0 &&
      this.state.purchaseDIDGroupRoute
    ) {
      return (
        <Button variant="primary" onClick={this.confirmPurchaseAndLogDid}>
          Confirm Purchase and Configure
        </Button>
      );
    } else if (
      this.state.selectedDIDs.length > 0 &&
      !this.state.purchaseDIDGroupRoute
    ) {
      return (
        <Button variant="primary" onClick={this.confirmPurchaseAndLogDid}>
          Confirm Purchase
        </Button>
      );
    }
  };

  handleDidCheckBox = (event, number, carrier) => {
    if (event.target.checked) {
      //append to array
      if (carrier === "Ytel") {
        this.setState({
          selectedDIDs: this.state.selectedDIDs.concat([
            number.substr(1),
          ]),
          carrier: carrier,
        });
      }
      if (carrier === "Questblue") {
        this.setState({
          selectedDIDs: this.state.selectedDIDs.concat([
            number,
          ]),
          carrier: carrier,
        });
      }
    } else {
      //remove from array
      this.setState({
        selectedDIDs: this.state.selectedDIDs.filter((val) => {
          return val !== number.substr(1);
        }),
      });
    }
  };

  renderSearchedDidListYtel = (_) => {
    if (this.state.loading === true) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            <Spinner animation="border" />
          </td>
        </tr>
      );
    }
    if (this.state.justCompletedPurchase === true) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            <strong>Purchase Complete!</strong>
          </td>
        </tr>
      );
    }
    if (
      this.state.searchedDIDs.length === 0 &&
      this.state.errorMessage === undefined
    ) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            Please Search by Areacode.
          </td>
        </tr>
      );
    }
    if (this.state.errorMessage) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            {this.state.errorMessage}
          </td>
        </tr>
      );
    }
    if (
      this.state.searchedDIDs.Ytel === undefined &&
      this.state.searchedDIDs.Questblue.length === 0
    ) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            Number not found
          </td>
        </tr>
      );
    }
    if (this.state.searchedDIDs.Ytel !== undefined) {
      return this.state.searchedDIDs["Ytel"].map((number, index) => (
        <tr key={index}>
          <td>
            <Form.Check
              type="checkbox"
              onChange={(event) =>
                this.handleDidCheckBox(event, number.phoneNumber, "Ytel")
              }
            />
          </td>
          {console.log("number", number)}
          <td>
            <NumberFormat
              value={number.phoneNumber.slice(2)}
              displayType={"text"}
              format="(###) ###-####"
            />
          </td>
          <td>
            {number.attributes.find((attr) => attr === "voice-enabled")
              ? "Voice"
              : ""}
          </td>
          <td>
            {number.attributes.find((attr) => attr === "sms-enabled")
              ? "SMS"
              : ""}
          </td>
          <td>
            {number.attributes.find((attr) => attr === "mms-enabled")
              ? "MMS"
              : ""}
          </td>
        </tr>
      ));
    }
    // if (this.state.searchedDIDs.Questblue.length) {
    //   return this.state.searchedDIDs.Questblue.map((number, index) => (
    //     <tr key={index}>
    //       <td><Form.Check type="checkbox" onChange={(event) => this.handleDidCheckBox(event, number, "Questblue")} /></td>
    //       <td>{number}</td>
    //       <td>Voice</td>
    //       <td>SMS</td>
    //       <td>MMS</td>
    //     </tr>
    //   ));
    // }
  };

  renderSearchedDidsListQuestblue = (_) => {
    if (
      this.state.searchedDIDs.length === 0 &&
      this.state.errorMessage === undefined
    ) {
      return "";
    }
    if (this.state.searchedDIDs.Questblue.length) {
      return this.state.searchedDIDs.Questblue.map((number, index) => (
        <tr key={index}>
          <td>
            <Form.Check
              type="checkbox"
              onChange={(event) =>
                this.handleDidCheckBox(event, number, "Questblue")
              }
            />
          </td>
          <td>
            <NumberFormat
              value={number}
              displayType={"text"}
              format="(###) ###-####"
            />
          </td>
          <td>Voice</td>
          <td>SMS</td>
          <td>MMS</td>
        </tr>
      ));
    }
  };

  handleInputChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAreaCodeSearch = async (event) => {
    event.preventDefault();
    let carriers = this.props.currentUser.carriers;
    const groups = this.props.groups.data.filter(
      (group) => group._user === this.props.currentUser.id
    );
    this.setState({ groupsForNewNumberRouting: groups });
    this.loadingSpinner();
    await this.props.searchDid({
      ...this.state,
      currentUser: this.props.currentUser,
    });
    this.setState({
      searchedDIDs: this.props.searchedNumbers,
      selectedDIDs: [],
    });
    this.setState({ loading: false });
  };

  loadingSpinner = (_) => {
    this.setState({ loading: true });
    this.setState({ searchedDIDs: [] });
    this.setState({ errorMessage: undefined });
    // setTimeout(() => {
    //   this.setState({ loading: false });
    // }, 3000);
  };

  purchaseSpinner = (_) => {
    this.setState({ justCompletedPurchase: true });
    setTimeout(() => {
      this.setState({
        justCompletedPurchase: false,
        searchedAreaCode: "",
        searchedDIDs: [],
        purchaseDIDDescription: undefined,
        loading: false,
        errorMessage: undefined,
        // selectedDIDs: [],
        purchaseDIDGroupRoute: undefined,
        selectedDIDs: [],
      });
    }, 5000);
  };

  render() {
    return (
      <Modal
        show={this.props.showNewDidModal}
        onHide={() => this.props.updateNewDidModal(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i> Buy DID(s)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            Search for numbers by area code.
          </div>
          <form>
            <div className="form-group">
              {/* <label htmlFor="message" className="col-form-label">Area Code</label> */}
              <InputGroup>
                <FormControl
                  placeholder="Enter area code"
                  aria-label="Enter area code"
                  aria-describedby="basic-addon2"
                  autoComplete="off"
                  type="number"
                  value={this.state.searchedAreaCode}
                  name="searchedAreaCode"
                  onChange={this.handleInputChange}
                />
                <InputGroup.Append>
                  {!this.state.searchedAreaCode ? (
                    <Button disabled variant="outline-secondary">
                      Search
                    </Button>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      onClick={(event) => this.handleAreaCodeSearch(event)}
                    >
                      Search
                    </Button>
                  )}
                </InputGroup.Append>
              </InputGroup>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>DID</th>
                  <th>Voice</th>
                  <th>SMS</th>
                  <th>MMS</th>
                </tr>
              </thead>
              <tbody>
                {this.renderSearchedDidsListQuestblue()}
                {this.renderSearchedDidListYtel()}
              </tbody>
            </Table>

            {this.state.searchedDIDs["Questblue"] === undefined ||
            this.state.searchedDIDs["Ytel"] === undefined ? null : (
              <>
                <Form.Group as={Col} controlId="formGridStateDescription">
                  <Form.Label>DID(s) Description:</Form.Label>
                  <Form.Control
                    type="text"
                    name="purchaseDIDDescription"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridStateList">
                  <Form.Label>Point numbers to Group:</Form.Label>
                  <Form.Control
                    as="select"
                    name="purchaseDIDGroupRoute"
                    onChange={this.handleInputChange}
                  >
                    <option>Choose...</option>
                    {this.state.groupsForNewNumberRouting.map((group) => {
                      return (
                        <option key={group.group_name} value={group.id}>
                          {group.group_name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              </>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>{this.renderPurchaseDidButton()}</Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  groups: selectGroupData,
  searchedNumbers: selectPurchaseDids,
  showNewDidModal: showNewDidModal,
});

const mapDispatchToProps = (dispatch) => ({
  searchDid: (areacode) => dispatch(searchDid(areacode)),
  confirmPurchaseDids: (numbers) => dispatch(confirmPurchaseDids(numbers)),
  updateNewDidModal: (value) => dispatch(updateNewDidModal(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDidModal);
