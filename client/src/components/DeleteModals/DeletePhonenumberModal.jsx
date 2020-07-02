import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { deleteDidModal } from "../../reducers/home/home.actions";
import { showDeleteDidModal } from "../../reducers/home/home.selectors";
import { deleteDid } from "../../reducers/phonenumber/did.actions";

class DeleteDidModal extends React.Component {
  handleDeleteDid = () => {
    this.props.deleteDid(this.props.showDeleteDidModal);
    this.props.deleteDidModal(null);
  };

  render() {
    const show = this.props.showDeleteDidModal;
    return (
      <Modal show={show} onHide={() => this.props.deleteDidModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i> Delete Phone Number
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            This will remove the phone number from your account.
          </div>
          <form>
            <div className="form-group">
              <div>
                <label htmlFor="modifyPhoneNumber" className="col-form-label">
                  Are you sure you want to remove this phone number?
                </label>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>
                  {this.props.number}
                </label>
              </div>
              {/* <input type="text" name="modifyPhoneNumber" className="form-control" id="modifyPhoneNumber" autoComplete="off" value={this.props.number} disabled /> */}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => this.props.deleteDidModal(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={(_) => this.handleDeleteDid()}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  showDeleteDidModal: showDeleteDidModal,
});

const mapDispatchToProps = (dispatch) => ({
  deleteDid: (numberId) => dispatch(deleteDid(numberId)),
  deleteDidModal: (value) => dispatch(deleteDidModal(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDidModal);
