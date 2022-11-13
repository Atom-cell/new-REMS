import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import "./allpayroll.css";
import axios from "axios";
import { toast } from "react-toastify";
const AllPayroll = ({ user }) => {
  const publishableKey =
    "pk_test_51Izy3ZSCK5aoLzPXKSUJYks26dOaC522apZtLjmsLaHccU4kSw8Ez6RA0Bi6O0Ylbm3zIrir8ITdjhGnsHnDBMcZ00erYP3yzo";
  const navigate = useNavigate();
  const [allPayrolls, setAllPayrolls] = useState();

  const handleTokenPay = async (token, id, amount) => {
    amount = parseInt(amount);
    console.log(typeof amount);
    console.log(amount);
    //name, address, postcode, city, India
    // token.card.name = "asdf";
    // token.card.address_line1 = "asd";
    // token.card.address_zip = "45400";
    // token.card.address_city = "Bara kau";
    // token.card.address_country = "Pakistan";
    // token.card.address_state = "Federal Capial &AJK";
    // console.log(token);
    await axios
      .post("/myPayroll/payment", {
        token: token,
        amount: amount,
        payrollId: id,
      })
      .then((rec) => {
        // console.log(rec.data);
        if (rec.data.status === "success") {
          toast.success("Payroll Paid");
          fetchData();
        }
      })
      .catch((err) => console.log(err));
  };

  // function exportToExcel(tableSelect, filename = "") {
  //   alert("hl");
  //   var downloadurl;
  //   var dataFileType = "application/vnd.ms-excel";
  //   // var tableHTMLData = tableSelect.outerHTML.replace(/ /g, "%20");

  //   // Specify file name
  //   filename = filename ? filename + ".xls" : "export_excel_data.xls";

  //   // Create download link element
  //   downloadurl = document.createElement("a");

  //   document.body.appendChild(downloadurl);

  //   if (navigator.msSaveOrOpenBlob) {
  //     var blob = new Blob(["\ufeff", tableSelect], {
  //       type: dataFileType,
  //     });
  //     navigator.msSaveOrOpenBlob(blob, filename);
  //   } else {
  //     // Create a link to the file
  //     downloadurl.href = "data:" + dataFileType + ", " + tableSelect;

  //     // Setting the file name
  //     downloadurl.download = filename;

  //     //triggering the function
  //     downloadurl.click();
  //   }
  // }

  const fetchData = async () => {
    const rec = await axios.get("/myPayroll/getallpayrolls", {
      params: { employerId: user._id },
    });
    //   console.log(res.data);
    setAllPayrolls(rec.data);
  };

  useEffect(() => {
    fetchData().catch(console.error + "line 66 in All Payroll");
  }, []);
  return (
    <div className="projectContainer">
      <div className="project-header">
        {/* <div className="search-container">
          <Form.Control
            type="search"
            placeholder="Search Payroll"
            className="me-2 search-projects"
            aria-label="Search"
            // value={searchInput}
            // onChange={handleSearchChange}
            style={{ boxShadow: "#da0d50 !important" }}
          />
        </div> */}
        <div className="create-project">
          <Button
            style={{ backgroundColor: "#1890ff" }}
            onClick={() => navigate("/allpayroll/newpayroll")}
          >
            Create New Payroll
          </Button>
        </div>
      </div>
      <div className="table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Payroll #</th>
              {/* <th>Status</th> */}
              <th>Date Range</th>
              <th>Total Time</th>
              <th>Total Amount</th>
              <th># of People</th>
              <th>View</th>
              <th>Download</th>
              <th>Pay</th>
              {/* <th>Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {allPayrolls?.map((p, i) => {
              return (
                <tr key={i}>
                  <td>{p._id}</td>
                  <td>{p.dateRange}</td>
                  <td>{p.totalTime}</td>
                  <td>{p.totalAmount}</td>
                  <td>{p.employees.length}</td>
                  {/* <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td> */}
                  <td
                    onClick={() =>
                      navigate("/allpayroll/payrolldetails", {
                        state: p,
                      })
                    }
                  >
                    View
                  </td>
                  <td>Download</td>
                  {/* <td onClick={() => exportToExcel(p)}>Download</td> */}
                  {/* <td>Pay</td> */}
                  <td>
                    {p.paid ? (
                      "Paid"
                    ) : (
                      <>
                        <StripeCheckout
                          stripeKey={publishableKey}
                          label="Pay"
                          name="Pay With Credit Card"
                          // billingAddress
                          // shippingAddress
                          amount={p.totalAmount}
                          description={`Total Amount to be paid is: ${p.totalAmount}`}
                          token={(token) =>
                            handleTokenPay(token, p._id, p.totalAmount)
                          }
                        />
                      </>
                    )}
                  </td>
                  {/* <td>Delete</td> */}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AllPayroll;
