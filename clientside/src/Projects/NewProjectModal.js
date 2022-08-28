import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
import axios from "axios";
import EmployeesTable from "./EmployeesTable";
const NewProjectModal = ({ handleClose, show, newProject, setNewProject }) => {
  const [check, setCheck] = useState();
  const [fileName, setFileName] = useState();
  //   const [type, setType] = useState();
  //   const [projectName, setProjectName] = useState();
  //   const [projectDescription, setProjectDescription] = useState();
  //   const [dueDate, setDueDate] = useState();
  const [milestones30, setMilestones30] = useState();
  const [milestones60, setMilestones60] = useState();
  const [milestones100, setMilestones100] = useState();
  const [employees, setEmployees] = useState([]);

  const [showw, setShoww] = useState(false);
  const handleClosee = () => setShoww(false);
  const handleShoww = () => setShoww(true);

  const getFiles = (files) => {
    setFileName(files.name);
    const type = files.base64.split(";")[0].split(":")[1];
    // setType(type);
    // console.log(type);
    if (
      //   type.includes("image") ||
      //   type.includes("video") ||
      type.includes("pdf")
    ) {
      setCheck(files.base64);
    } else {
      toast.info("you can only Upload pdf");
    }
  };

  const handleCreateProject = () => {
    // console.log(newProject);
    if (!check) {
      toast.error("Please Select a Pdf file");
    } else if (
      newProject.projectName &&
      newProject.projectDescription &&
      newProject.projectCost &&
      milestones100
    ) {
      // create new project
      const myObj = {
        projectName: newProject.projectName,
        projectDescription: newProject.projectDescription,
        projectCost: newProject.projectCost,
        projectPriority: newProject.priority,
        projectAssignedBy: JSON.parse(localStorage.getItem("user")).username,
        projectAssignedTo: newProject.assignTo,
        projectAssignedToId: newProject.assignToId,
        helpingMaterial: check,
        fileName: fileName,
        hoursWorked: "3",
        hoursWorkedOn: "false",
        dueDate: milestones100,
        milestones: [
          {
            completionPercentage: "30%",
            dueDate: milestones30,
          },
          {
            completionPercentage: "60%",
            dueDate: milestones60,
          },
          {
            completionPercentage: "100%",
            dueDate: milestones100,
          },
        ],
        completed: "Incompleted",
      };
      if (!newProject.priority) {
        myObj.projectPriority = "Normal";
      }
      // console.log(myObj);
      //   console.table(myObj);
      axios
        .post("/myProjects/addNewProject", myObj)
        .then((res) => {
          console.log(res);
          toast.info(`${res.data.projectName} Created`);
          setNewProject({
            projectName: "",
            projectDescription: "",
            projectCost: "",
            assignTo: "",
            assignToId: "",
          });
          handleClose();
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Please fill all required fields");
    }
  };

  // Get All Employees
  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const res = await axios.get("http://localhost:5000/emp/");
      //   console.log(res.data);
      setEmployees(res.data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input
            type="text"
            placeholder="Enter Project Name"
            value={newProject.projectName}
            onChange={(e) =>
              setNewProject({ ...newProject, projectName: e.target.value })
            }
            className="inputTextFields"
          />
          <input
            type="text"
            placeholder="Enter Project Description"
            value={newProject.projectDescription}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                projectDescription: e.target.value,
              })
            }
            className="inputTextFields"
          />
          <input
            type="number"
            placeholder="Enter Project Cost"
            value={newProject.projectCost}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                projectCost: e.target.value,
              })
            }
            className="inputTextFields"
          />
          {/* Milestones */}
          <DatePicker
            placeholderText="30% due Date"
            selected={milestones30}
            onChange={(start) => setMilestones30(start)}
            dateFormat="MM/dd/yyyy"
            className="inputTextFields"
            minDate={new Date()}
          />
          <DatePicker
            placeholderText="60% due Date"
            selected={milestones60}
            onChange={(start) => setMilestones60(start)}
            dateFormat="MM/dd/yyyy"
            className="inputTextFields"
            minDate={new Date()}
          />
          <DatePicker
            placeholderText="100% due Date"
            selected={milestones100}
            onChange={(start) => setMilestones100(start)}
            dateFormat="MM/dd/yyyy"
            className="inputTextFields"
            minDate={new Date()}
          />
          <select
            name=""
            id=""
            value={newProject.priority}
            onChange={(e) =>
              setNewProject({ ...newProject, priority: e.target.value })
            }
            style={{
              width: "100%",
              marginTop: "10px",
              fontSize: "large",
              border: "none",
              borderBottom: "2px solid gray",
              outline: "none",
            }}
          >
            <option value="Normal">Normal</option>
            <option value="Important">Important</option>
            <option value="Critical">Critical</option>
          </select>
          {newProject.assignTo && (
            <input
              type="text"
              placeholder="Assign Project"
              value={newProject.assignTo}
              editable={false}
              className="inputTextFields"
            />
          )}

          <div style={{ margin: "10px 0 10px 0" }}>
            <Button variant="primary" onClick={handleShoww}>
              Assign Project To
            </Button>
          </div>

          <Modal show={showw} onHide={handleClosee}>
            <Modal.Header closeButton>
              <Modal.Title>My Employees</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EmployeesTable
                employees={employees}
                newProject={newProject}
                setNewProject={setNewProject}
                handleClosee={handleClosee}
              />
            </Modal.Body>
          </Modal>
          <div>
            <FileBase64 multiple={false} onDone={getFiles} />
            {/* {check && type.includes("image") && (
              <img
                src={check}
                alt="No Image"
                style={{
                  width: "100px",
                  height: "60px",
                  marginTop: "5px",
                }}
              />
            )} */}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateProject}>
          Create Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewProjectModal;
