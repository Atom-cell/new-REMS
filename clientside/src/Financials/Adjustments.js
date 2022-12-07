import axios from "axios";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { SkipBack } from "react-feather";
import { toast } from "react-toastify";
import Editable from "../Boards/Editabled/Editable";

const Adjustments = ({
  show,
  handleClose,
  employee,
  payroll,
  updateAmount,
  currency,
}) => {
  //   console.log(employee);
  // baseAmaount, employeeId, totalTime
  const [add, setAdd] = useState("empty");
  const [amount, setAmount] = useState();
  const [comment, setComment] = useState();
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adjustments</Modal.Title>
        </Modal.Header>
        <Modal.Body className="adjustments-modal">
          <div className="adjustments-details">
            <div className="adjustments-employee-details">
              <div className="adjustments-detail">
                <h5>Name</h5>
                <span>{employee?.employeeUsername}</span>
              </div>
              <div className="adjustments-detail">
                <h5>Worked Time</h5>
                <span>{employee?.totalTime}</span>
              </div>
              <div className="adjustments-detail">
                <h5>Base Amount</h5>
                <span>
                  {currency?.symbol} {""}{" "}
                  {Number(employee?.baseAmount).toFixed(3)}
                </span>
              </div>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Adjustment</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {employee?.adjustments.length > 0 && (
                  <>
                    {employee?.adjustments.map((ad, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {currency?.symbol} {""}
                            {ad.adjustment}
                          </td>
                          <td>{ad.comment}</td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </Table>
          </div>
          {JSON.parse(localStorage.getItem("user")).role !== "Employee" && (
            <>
              {add !== "empty" ? (
                <>
                  <input
                    type="number"
                    placeholder={`Enter Amount in ${currency?.symbol}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="inputTextFields"
                  />
                  <input
                    type="text"
                    placeholder="Enter Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="inputTextFields"
                  />
                  <SkipBack onClick={() => setAdd("empty")} />
                </>
              ) : (
                <>
                  <Button variant="primary mx-2" onClick={() => setAdd("add")}>
                    Add Amount
                  </Button>
                  <Button
                    variant="primary mx-2"
                    onClick={() => setAdd("subtract")}
                  >
                    Subtract Amount
                  </Button>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setAdd("empty");
              handleClose();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (add && comment) {
                var adjustment = amount.toString();
                if (add === "add") adjustment = "+" + adjustment;
                if (add === "subtract") adjustment = "-" + adjustment;
                updateAmount(adjustment, comment, employee);
                setAdd("empty");
                setAmount();
                setComment();
                handleClose();
              } else {
                toast.error("Please Fill All Fields");
              }
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Adjustments;
