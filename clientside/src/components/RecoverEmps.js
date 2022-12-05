import React from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert"; // Import

const RecoverEmps = ({ activeUser }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("/admin/allDeletedEmps", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("response from server ", response.data);
        setData([...response.data]);
      });
  };

  const RecoverEmp = (id) => {
    axios
      .put("/emp/recoverEmp", {
        id: id,
      })
      .then((response) => {});

    activeUser();
  };

  const submit = (id) => {
    confirmAlert({
      title: "Confirm to Recover",
      message: "Do you want to Recover this employee?",
      buttons: [
        {
          label: "Yes",
          onClick: () => RecoverEmp(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div>
      <Table className="table">
        <thead>
          <tr>
            <th className="thead">#</th>
            <th className="thead">Username</th>
            <th className="thead">Email</th>
            <th className="thead">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(function (data, index) {
            return (
              <tr key={index}>
                <td style={{ cursor: "pointer" }}>{index + 1}</td>
                <td style={{ cursor: "pointer" }}>{data.username} </td>
                <td style={{ cursor: "pointer" }}>{data.email}</td>
                <td>
                  <Button
                    className="submitbtn"
                    onClick={() => submit(data._id)}
                  >
                    Recover
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default RecoverEmps;
