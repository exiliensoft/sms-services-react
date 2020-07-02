import React from "react";
import SidebarGroupItem from "../SidebarGroupItem/SidebarGroupItem";
export default function (props) {
  return (
    <>
      {props.items.map(({ id, ...otherProps }) => (
        <SidebarGroupItem
          key={id}
          _id={id}
          {...otherProps}
          selectedObj={props.selectedObj}
          refresh={Math.random()}
        />
      ))}
    </>
  );
}
