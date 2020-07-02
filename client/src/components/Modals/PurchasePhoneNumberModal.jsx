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
import { updateNewPhonenumberModal } from "../../reducers/home/home.actions";
import { showNewPhoneNumberModal } from "../../reducers/home/home.selectors";
import {
  confirmPurchasePhoneNumbers,
  searchPhoneNumber,
} from "../../reducers/phonenumber/did.actions";
import { selectPurchaseDids } from "../../reducers/phonenumber/did.selectors";
import { selectSmsGroupData } from "../../reducers/smsgroups/smsgroup.selectors";
import { selectCurrentUser } from "../../reducers/user/user.selectors";

class PurchasePhoneNumberModal extends React.Component {
  state = {
    searchedAreaCode: undefined,
    searchedPhoneNumbers: [],
    purchasePhoneNumberDescription: undefined,
    purchasePhoneNumberSMSGroupRoute: undefined,
    smsGroupsForNewNumberRouting: [],
    loading: false,
    errorMessage: undefined,
    selectedPhoneNumbers: [],
    justCompletedPurchase: false,
    currentUser: this.props.currentUser,
    carrier: "",
  };

  confirmPurchaseAndLogPhoneNumbers = async (_) => {
    // this.setState({ selectedPhoneNumbers: [] })
    this.loadingSpinner();
    this.purchaseSpinner();
    await this.props.confirmPurchasePhoneNumbers(this.state);
    this.props.updateNewPhonenumberModal(null);
  };

  renderPurchasePhoneNumberButton = (_) => {
    if (this.state.selectedPhoneNumbers.length === 0) {
      return (
        <Button variant="primary" disabled>
          Confirm Purchase
        </Button>
      );
    } else if (
      this.state.selectedPhoneNumbers.length > 0 &&
      this.state.purchasePhoneNumberSMSGroupRoute
    ) {
      return (
        <Button
          variant="primary"
          onClick={this.confirmPurchaseAndLogPhoneNumbers}
        >
          Confirm Purchase and Configure
        </Button>
      );
    } else if (
      this.state.selectedPhoneNumbers.length > 0 &&
      !this.state.purchasePhoneNumberSMSGroupRoute
    ) {
      return (
        <Button
          variant="primary"
          onClick={this.confirmPurchaseAndLogPhoneNumbers}
        >
          Confirm Purchase
        </Button>
      );
    }
  };

  handlePhoneNumberCheckBox = (event, number, carrier) => {
    if (event.target.checked) {
      //append to array
      if (carrier === "Ytel") {
        this.setState({
          selectedPhoneNumbers: this.state.selectedPhoneNumbers.concat([
            number.substr(1),
          ]),
          carrier: carrier,
        });
      }
      if (carrier === "Questblue") {
        this.setState({
          selectedPhoneNumbers: this.state.selectedPhoneNumbers.concat([
            number,
          ]),
          carrier: carrier,
        });
      }
    } else {
      //remove from array
      this.setState({
        selectedPhoneNumbers: this.state.selectedPhoneNumbers.filter((val) => {
          return val !== number.substr(1);
        }),
      });
    }
  };

  renderSearchedPhoneNumbersListYtel = (_) => {
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
      this.state.searchedPhoneNumbers.length === 0 &&
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
      this.state.searchedPhoneNumbers.Ytel === undefined &&
      this.state.searchedPhoneNumbers.Questblue.length === 0
    ) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            Number not found
          </td>
        </tr>
      );
    }
    if (this.state.searchedPhoneNumbers.Ytel !== undefined) {
      return this.state.searchedPhoneNumbers["Ytel"].map((number, index) => (
        <tr key={index}>
          <td>
            <Form.Check
              type="checkbox"
              onChange={(event) =>
                this.handlePhoneNumberCheckBox(
                  event,
                  number.phoneNumber,
                  "Ytel"
                )
              }
            />
          </td>
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
    // if (this.state.searchedPhoneNumbers.Questblue.length) {
    //   return this.state.searchedPhoneNumbers.Questblue.map((number, index) => (
    //     <tr key={index}>
    //       <td><Form.Check type="checkbox" onChange={(event) => this.handlePhoneNumberCheckBox(event, number, "Questblue")} /></td>
    //       <td>{number}</td>
    //       <td>Voice</td>
    //       <td>SMS</td>
    //       <td>MMS</td>
    //     </tr>
    //   ));
    // }
  };

  renderSearchedPhoneNumbersListQuestblue = (_) => {
    if (
      this.state.searchedPhoneNumbers.length === 0 &&
      this.state.errorMessage === undefined
    ) {
      return "";
    }
    if (this.state.searchedPhoneNumbers.Questblue.length) {
      return this.state.searchedPhoneNumbers.Questblue.map((number, index) => (
        <tr key={index}>
          <td>
            <Form.Check
              type="checkbox"
              onChange={(event) =>
                this.handlePhoneNumberCheckBox(event, number, "Questblue")
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
    const groups = this.props.sms_groups.data.filter(
      (group) => group._user === this.props.currentUser.id
    );
    this.setState({ smsGroupsForNewNumberRouting: groups });
    this.loadingSpinner();
    await this.props.searchPhoneNumber({
      ...this.state,
      currentUser: this.props.currentUser,
    });
    this.setState({
      searchedPhoneNumbers: this.props.searchedNumbers,
      selectedPhoneNumbers: [],
    });
    this.setState({ loading: false });
  };

  loadingSpinner = (_) => {
    this.setState({ loading: true });
    this.setState({ searchedPhoneNumbers: [] });
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
        searchedPhoneNumbers: [],
        purchasePhoneNumberDescription: undefined,
        loading: false,
        errorMessage: undefined,
        // selectedPhoneNumbers: [],
        purchasePhoneNumberSMSGroupRoute: undefined,
        selectedPhoneNumbers: [],
      });
    }, 5000);
  };

  render() {
    return (
      <Modal
        show={this.props.showNewPhoneNumberModal}
        onHide={() => this.props.updateNewPhonenumberModal(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i> Buy Phone Number
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
                  <th>Phone Number</th>
                  <th>Voice</th>
                  <th>SMS</th>
                  <th>MMS</th>
                </tr>
              </thead>
              <tbody>
                {this.renderSearchedPhoneNumbersListQuestblue()}
                {this.renderSearchedPhoneNumbersListYtel()}
              </tbody>
            </Table>

            {this.state.searchedPhoneNumbers["Questblue"] === undefined ||
            this.state.searchedPhoneNumbers["Ytel"] === undefined ? null : (
              <>
                <Form.Group as={Col} controlId="formGridStateDescription">
                  <Form.Label>Phone Number(s) Description:</Form.Label>
                  <Form.Control
                    type="text"
                    name="purchasePhoneNumberDescription"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridStateList">
                  <Form.Label>Point numbers to SMS Group:</Form.Label>
                  <Form.Control
                    as="select"
                    name="purchasePhoneNumberSMSGroupRoute"
                    onChange={this.handleInputChange}
                  >
                    <option>Choose...</option>
                    {this.state.smsGroupsForNewNumberRouting.map((group) => {
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
        <Modal.Footer>{this.renderPurchasePhoneNumberButton()}</Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  sms_groups: selectSmsGroupData,
  searchedNumbers: selectPurchaseDids,
  showNewPhoneNumberModal: showNewPhoneNumberModal,
});

const mapDispatchToProps = (dispatch) => ({
  searchPhoneNumber: (areacode) => dispatch(searchPhoneNumber(areacode)),
  confirmPurchasePhoneNumbers: (numbers) =>
    dispatch(confirmPurchasePhoneNumbers(numbers)),
  updateNewPhonenumberModal: (value) =>
    dispatch(updateNewPhonenumberModal(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchasePhoneNumberModal);
