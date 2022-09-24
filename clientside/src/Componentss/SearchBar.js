import React, { useState, useEffect } from "react";
import axios from "axios";
import "./searchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";

const SearchBar = ({
  placeholder,
  employees,
  setEmployees,
  addEmployeeToMeeting,
  newConversation,
  myId,
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [data, setData] = useState();
  const [userId, setUserId] = useState();

  // Get All Employees
  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const res = await axios.get(
        "http://localhost:5000/emp/getcompanyemployees",
        {
          params: { _id: JSON.parse(localStorage.getItem("user"))._id },
        }
      );
      //   console.log(res.data);
      var withoutMe = res.data.filter((u) => u._id != myId);
      setData(withoutMe);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data?.filter((value) => {
      return value.username?.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleFilteredDataClick = (value) => {
    setWordEntered(value);
    setFilteredData([]);
  };

  const addEmployeeToMeetingList = (word) => {
    addEmployeeToMeeting(word);
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search-bar-container mt-3">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        {/* <div className="search-icon-container"> */}
        {/* {wordEntered && (
            // <div onClick={() => addEmployeeToMeetingList(wordEntered)}>
            <div
              onClick={() => {
                if (addEmployeeToMeeting !== undefined) {
                  addEmployeeToMeetingList(wordEntered);
                }
                if (newConversation !== undefined) {
                  newConversation(userId);
                  setFilteredData([]);
                  setWordEntered("");
                }
              }}
            >
              <AddIcon />
            </div>
          )} */}
        {/* {filteredData.length === 0 ? (
            <div className="search-icon">
              <SearchIcon />
            </div>
          ) : (
            <div className="clear-icon">
              <CloseIcon id="clearBtn" onClick={clearInput} />
            </div>
          )} */}
        {/* </div> */}
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 6).map((value, key) => {
            return (
              <p
                onClick={() => {
                  handleFilteredDataClick(value.username);
                  setUserId(value?._id);
                  addEmployeeToMeetingList(value.username);
                }}
              >
                {value.username}{" "}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
