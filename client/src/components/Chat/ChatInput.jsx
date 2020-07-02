import React, { useState } from "react";
import Select from "react-select";

export default function (props) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#ede905",
      outline: "none",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: "#ede905",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: "#ede905",
        outline: "none",
      },
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  /* ------------------------------------------------- */
  /* Handle message text with tag checker */
  /* ---- */
  const onChange = (e) => {
    props.handleChange(e);
  };

  /* ------------------------------------------------- */
  /* Used for the focusing of the different tag options */
  /* --- */
  const onChangeInput = (e, { action }) => {
    if (
      action === "set-value" ||
      action === "menu-close" ||
      action === "input-blur" ||
      !action ||
      action === ""
    )
      return;
    props.handleChange({ target: { name: "message", value: e } });

    let query = props.message;
    if (query.length === 0) {
      return;
    }
    let i = query.length;
    while (i >= 0 && query[i] !== " ") {
      i--;
    }
    i++;
    if (query[i] === "@") {
      let endValue = query.substr(i + 1);
      let menuIsOpen = false;
      mapUsers().map((user) => {
        if (
          user.value.name.toLowerCase().startsWith(endValue.toLowerCase()) ||
          user.value.email.toLowerCase().startsWith(endValue.toLowerCase())
        ) {
          return (menuIsOpen = true);
        }
      });
      return setMenuIsOpen(menuIsOpen);
    }
    setMenuIsOpen(false);
  };

  const onChangeTag = (e) => {
    let query = props.message;
    if (query.length === 0) {
      return;
    }
    let i = query.length;
    while (i >= 0 && query[i] !== " ") {
      i--;
    }
    i++;
    if (query[i] === "@") {
      props.handleChange({
        target: {
          name: "message",
          value: query.substr(0, i) + e.value.name + " ",
        },
      });
      setMenuIsOpen(false);
      props.setTags((tags) => {
        return [...tags, e.value.id];
      });
    }
  };

  const filterOption = ({ label, value, data }, inp) => {
    if (!props.internal) {
      return false;
    }
    let query = props.message;
    if (query.length === 0) {
      return false;
    }
    let i = query.length;
    while (i >= 0 && query[i] !== " ") {
      i--;
    }
    i++;
    if (query[i] === "@") {
      let endValue = query.substr(i + 1);
      if (
        value.name.toLowerCase().startsWith(endValue.toLowerCase()) ||
        value.email.toLowerCase().startsWith(endValue.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  /* --------------------------------------------------------------------------------- */
  /* Used to generate the list of users that would show up in the tag dropdown */
  /* --------------------------------------------------------------------------------- */
  const mapUsers = () => {
    return props.users.map((user) => {
      return {
        value: { id: user.id, name: user.name, email: user.email },
        label: user.name + " " + user.email,
      };
    });
  };

  return (
    <>
      {!props.internal && (
        <input
          id="textInput"
          style={{ float: "left" }}
          type="text"
          className="form-control"
          placeholder="Type a message"
          value={props.message}
          name="message"
          autoComplete="off"
          aria-label="Type a message"
          aria-describedby="button-addon2"
          onChange={onChange}
        />
      )}
      {props.internal && (
        <div id="textInput" style={{ width: "100%" }}>
          <div>
            <Select
              style={{ float: "left", width: "100%" }}
              width="100%"
              styles={customStyles}
              inputValue={props.message}
              placeholder={"Type a message"}
              menuPlacement="auto"
              options={mapUsers()}
              onInputChange={onChangeInput}
              onChange={onChangeTag}
              filterOption={filterOption}
              hideSelectedOptions={true}
              value={props.message}
              menuIsOpen={menuIsOpen}
              clearIndicator={true}
              onSelectResetsInput={false}
              blurInputOnSelect={false}
              multiple="multiple"
              components={{ DropdownIndicator: () => null }}
              closeMenuOnSelect={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
