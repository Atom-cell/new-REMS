import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "react-bootstrap/Collapse";
import Card from "react-bootstrap/Card";
const ReadMore = ({ data }) => {
  const [expand, setExpand] = useState(false);
  return (
    <>
      {/* {expand ? <span>{data}</span> : <span>{data.substring(0, 30)}...</span>} */}
      {!expand && <div>{data.substring(0, 30)}...</div>}
      <Collapse in={expand}>
        <div id="example-collapse-text">{data}</div>
      </Collapse>
      {expand ? (
        <KeyboardArrowUpIcon onClick={() => setExpand(!expand)} />
      ) : (
        <KeyboardArrowDownIcon onClick={() => setExpand(!expand)} />
      )}
    </>
  );
};

export default ReadMore;
