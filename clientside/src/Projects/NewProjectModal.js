import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
import axios from "axios";
import EmployeesTable from "./EmployeesTable";
import { useNavigate } from "react-router-dom";
import TeamsSelectTable from "./TeamsSelectTable";
import Alert from "react-bootstrap/Alert";
const NewProjectModal = ({ handleClose, show, newProject, setNewProject }) => {
  const navigate = useNavigate();
  const [check, setCheck] = useState();
  const [fileName, setFileName] = useState();
  const [team, setTeam] = useState();
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
    // if (!check) {
    //   toast.error("Please Select a Pdf file");
    // } else
    if (newProject.projectName && milestones100) {
      // create new project
      const myObj = {
        projectName: newProject.projectName,
        // projectDescription: newProject.projectDescription,
        // projectCost: newProject.projectCost,
        projectPriority: newProject.priority,
        projectAssignedBy: JSON.parse(localStorage.getItem("user"))._id,
        // projectAssignedTo: newProject.assignTo,
        // projectAssignedToId: newProject.assignToId,
        // helpingMaterial: check,
        // fileName: fileName,
        // hoursWorked: "3",
        // hoursWorkedOn: "false",
        dueDate: milestones100,
        teamId: team && team._id,
        projectroles: team && team.teamLead,
        // milestones: [
        //   {
        //     completionPercentage: "30%",
        //     dueDate: milestones30,
        //   },
        //   {
        //     completionPercentage: "60%",
        //     dueDate: milestones60,
        //   },
        //   {
        //     completionPercentage: "100%",
        //     dueDate: milestones100,
        //   },
        // ],
      };
      // console.log(myObj);
      if (!newProject.priority) {
        myObj.projectPriority = "Normal";
      }
      // console.log(myObj);
      //   console.table(myObj);
      axios
        .post("/myProjects/addNewProject", myObj)
        .then((res) => {
          // console.log(res.data);
          toast.success(`${res.data.projectName} Created`);
          navigate(`/myproject/${res.data._id}`, {
            state: {
              project: res.data,
            },
          });
          setNewProject({
            projectName: "",
            projectDescription: "",
            // projectCost: "",
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
      const res = await axios.get("http://localhost:5000/emp/getmyemployees", {
        params: { _id: JSON.parse(localStorage.getItem("user"))._id },
      });
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
          {/* <input
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
          /> */}
          {/* <input
            type="number"
            placeholder="Enter Project Cost in $"
            value={newProject.projectCost}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                projectCost: e.target.value,
              })
            }
            className="inputTextFields"
          /> */}
          {/* <DatePicker
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
          /> */}
          <DatePicker
            placeholderText="Due Date"
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
          {/* {newProject.assignTo && (
            <input
              type="text"
              placeholder="Assign Project"
              value={newProject.assignTo}
              editable={false}
              className="inputTextFields"
            />
          )} */}

          {/* <div style={{ margin: "10px 0 10px 0" }}>
            <Button variant="primary" onClick={handleShoww}>
              Assign Project To
            </Button>
          </div> */}

          {/* <Modal show={showw} onHide={handleClosee}>
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
          </Modal> */}
          {/* <div>
            <FileBase64 multiple={false} onDone={getFiles} />
          </div> */}
          <div style={{ margin: "10px 0 10px 0" }}>
            <Button variant="primary" onClick={handleShoww}>
              Select Team
            </Button>
          </div>
          {team && (
            <Alert
              variant="danger"
              onClose={() => setTeam()}
              dismissible
              className="alert-dismiss-custom rounded-pill font-size-12 mb-1 selected-team"
              closeClassName="selected-media-close"
            >
              <p className="">Assign Project to {team.teamName}</p>
            </Alert>
          )}

          <Modal show={showw} onHide={handleClosee}>
            <Modal.Header closeButton>
              <Modal.Title>My Teams</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TeamsSelectTable
                team={team}
                setTeam={setTeam}
                handleClosee={handleClosee}
              />
            </Modal.Body>
          </Modal>
          {/* {teamSelect !== "empty" ? (
            <>
              <SearchbarTeams
                placeholder="Search Teams"
                projectRole={projectRole}
                setProjectRole={setProjectRole}
                setMemberId={setMemberId}
              />
              <input
                type="number"
                placeholder="Enter Amount"
                // value={amount}
                // onChange={(e) => setAmount(e.target.value)}
                className="inputTextFields"
              />
              <SkipBack onClick={() => setTeamSelect("empty")} />
            </>
          ) : (
            <>
              <Button
                variant="primary my-4"
                onClick={() => setTeamSelect("team")}
              >
                Select Team
              </Button>
              <Button
                variant="primary m-4"
                onClick={() => setTeamSelect("members")}
              >
                Select Members
              </Button>
            </>
          )} */}
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
