import React from "react";
import "./Profile.scss";
import ProfileInputs from "./ProfileInputs";
export default function (props) {
  return (
    <div
      id="contact-information"
      className={`sidebar ${props.isOpen ? "active" : null}`}
    >
      <header>
        <span>{props.profile.phone_number}</span>
        <ul className="list-inline">
          <li className="list-inline-item">
            {props.toggleProfileHidden && (
              <a
                href="#"
                className="btn btn-light sidebar-close"
                onClick={() => props.toggleProfileHidden(props.profile)}
              >
                <i className="ti-close"></i>
              </a>
            )}
          </li>
        </ul>
      </header>
      <div className="sidebar-body">
        <div className="pl-4 pr-4">
          <ProfileInputs
            fields={props.fields || []}
            fieldValues={props.fieldValues || []}
            contact={props.profile}
          />
        </div>
        <hr />
        <div className="pl-4 pr-4">
          <h6>Media</h6>
          <div className="files">
            <ul className="list-inline">
              {props.profile &&
                props.profile.links.map((link) => {
                  return (
                    <li className="list-inline-item">
                      <a href="#">
                        <figure className="avatar avatar-lg">
                          <span className="avatar-title bg-info">
                            <img src={link.filename}></img>
                          </span>
                        </figure>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
