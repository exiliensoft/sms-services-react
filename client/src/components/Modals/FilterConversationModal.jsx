import React from "react";
import { Card, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { updateFilterGroup } from "../../reducers/conversation/conversation.actions";
import { selectFilterGroups } from "../../reducers/conversation/conversation.selectors";
import { updateFilterConversationModal } from "../../reducers/home/home.actions";
import { showFilterConversationModal } from "../../reducers/home/home.selectors";
import { selectGroupData } from "../../reducers/group/group.selectors";

const FilterConversationModal = (props) => {
  let handleSelectGroupFilterCheckBox = (event, groupId) => {
    console.log(event);
    if (!event.target.checked) {
      //append to array
      props.updateFilterGroup([...props.filterGroups, groupId]);
    } else {
      //remove from array
      props.updateFilterGroup(
        props.filterGroups.filter((val) => val !== groupId)
      );
    }
  };
  const clearCheckboxes = function (event) {
    if (!event.target.checked) {
      props.updateFilterGroup(
        props.groups.data.map((group) => group.id)
      );
    } else {
      props.updateFilterGroup([]);
    }
  };

  return (
    <Card
      style={{
        width: "25rem",
        position: "absolute",
        margin: "0 0 0 1px",
        zIndex: 9999,
      }}
    >
      <Card.Header>Filter </Card.Header>
      <Card.Body
        style={{ padding: ".5em", maxHeight: "40em", overflowY: "scroll" }}
      >
        {/* <Card.Title>Filter Groups</Card.Title> */}
        <Table responsive borderless style={{ marginTop: "-2em" }}>
          <thead>
            <tr
              style={{
                fontSize: "1.1em",
                color: "grey",
                borderBottom: ".5px solid lightgrey",
              }}
            >
              <th>
                <div
                  className="form-item custom-control custom-checkbox"
                  style={{
                    float: "right",
                    marginRight: "-.8em",
                    marginTop: "1em",
                  }}
                  onClick={(event) => clearCheckboxes(event)}
                >
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    onChange={(event) => clearCheckboxes(event)}
                    checked={
                      props.filterGroups.length ===
                      props.groups.data.length
                    }
                  />
                  <label
                    checked={
                      props.filterGroups.length ===
                      props.groups.data.length
                    }
                    className="custom-control-label"
                  ></label>
                </div>
              </th>
              <th>Group Name</th>
              <th>Creator</th>
            </tr>
          </thead>
          <tbody>
            {props.groups.data.map((group) => {
              return (
                <tr key={group.group_name}>
                  <td>
                    <div
                      className="form-item custom-control custom-checkbox"
                      style={{ float: "right", marginRight: "-.8em" }}
                      onClick={(event) =>
                        handleSelectGroupFilterCheckBox(event, group.id)
                      }
                    >
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        readOnly
                        checked={props.filterGroups.includes(group.id)}
                      />
                      <label
                        className="custom-control-label"
                        checked={props.filterGroups.includes(group.id)}
                      ></label>
                    </div>
                  </td>
                  <td>{group.group_name}</td>
                  <td>{group.owner}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = createStructuredSelector({
  filterGroups: selectFilterGroups,
  filterConversationModal: showFilterConversationModal,
  groups: selectGroupData,
});

const mapDispatchToProps = (dispatch) => ({
  updateFilterGroup: (value) => dispatch(updateFilterGroup(value)),
  updateFilterConversationModal: (value) =>
    dispatch(updateFilterConversationModal(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterConversationModal);
