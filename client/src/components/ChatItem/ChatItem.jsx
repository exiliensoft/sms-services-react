import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectGroupData } from "../../reducers/group/group.selectors";
import "./ChatItem.scss";

const ChatItem = ({
  message,
  message_type,
  date,
  from,
  internal,
  sent,
  failed,
  attachment,
  attachment_name,
  attachment_size,
  groups,
  _group,
  filename,
  from_email,
  did,
  close_type,
}) => {
  const getGroup = () => {
    return [...groups.data, ...groups.member_groups].filter(
      (group) => group.id === _group
    )[0];
  };

  function renderTooltip(props) {
    return <Tooltip {...props}>ktruo010@gmail.com</Tooltip>;
  }

  if (close_type) {
    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <div class="strike">
          <span>
            Closed by {from} [{from_email}] at {date} on{" "}
            {getGroup() ? getGroup().group_name : ""} using phone {did}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`message-item ${
        message_type === "FROM" ? "outgoing-message" : ""
      }`}
    >
      <div className="message-action">
        <OverlayTrigger
          placement="left"
          delay={{ show: 100, hide: 400 }}
          overlay={renderTooltip}
        >
          <span style={{ color: "#212529" }}>{from} </span>
        </OverlayTrigger>
        {date}{" "}
        {message_type === "FROM" ? (
          sent ? (
            <i className="ti-double-check"></i>
          ) : failed ? (
            <i
              title="Message could not be sent"
              className="ti-info-alt text-danger"
            ></i>
          ) : (
            <i className="ti-check"></i>
          )
        ) : null}
      </div>
      <div
        className={`message-content ${attachment ? "message-file" : ""}  ${
          !!internal ? "internal" : ""
        }`}
      >
        {attachment ? (
          <>
            <div className="file-icon">
              <i className="ti-file"></i>
            </div>
            <div>
              <div>
                {attachment_name}{" "}
                <i className="text-muted small">{attachment_size}</i>
              </div>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a href={`${filename}`} target="_blank">
                    Download
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          message
        )}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  groups: selectGroupData,
});

export default connect(mapStateToProps)(ChatItem);
