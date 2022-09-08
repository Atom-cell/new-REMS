import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
const ReadMore = ({ data }) => {
  const [expand, setExpand] = useState(false);
  return (
    <>
      {expand ? data : `${data.substring(0, 30)}...`}
      {expand ? (
        <KeyboardArrowUpIcon onClick={() => setExpand(!expand)} />
      ) : (
        <KeyboardArrowDownIcon onClick={() => setExpand(!expand)} />
      )}
    </>
  );
};

export default ReadMore;
