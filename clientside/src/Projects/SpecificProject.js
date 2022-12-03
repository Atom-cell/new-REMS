import React, { useEffect, useState } from "react";
import FileUpload from "../Chat/FileUpload";
import "./specificproject.css";
import {
  CheckSquare,
  Trash,
  Calendar,
  Users,
  Clipboard,
  Plus,
  File,
  ArrowRight,
} from "react-feather";
import { format } from "timeago.js";
import GroupsIcon from "@mui/icons-material/Groups";
import Editable from "../Boards/Editabled/Editable";
import { useLocation, useNavigate } from "react-router-dom";
import AttachmentIcon from "@mui/icons-material/Attachment";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Table,
  Button,
  Dropdown,
  Badge,
  DropdownButton,
} from "react-bootstrap";
import axios from "axios";
import ProjectMembers from "./ProjectMembers";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import AddMemberRole from "./AddMemberRole";
import AddEventModal from "../Calendar/AddEventModal";
const SpecificProject = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [myProject, setMyProject] = useState();
  const [myTeam, setMyTeam] = useState();
  const [myBoard, setMyBoard] = useState();
  const [goals, setGoals] = useState();
  const [projectRoleEmployee, setProjectRoleEmployee] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: null });

  const [showEditRemove, setShowEditRemove] = useState(false);

  const [selectedEmployees, setSelectedEmployees] = useState();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInviteModalRole, setShowInviteModalRole] = useState(false);
  const [role, setRole] = useState("");

  const handleClose = () => setShowInviteModal(false);
  const handleShow = () => setShowInviteModal(true);

  const handleClosee = () => setShowInviteModalRole(false);
  const handleShoww = () => setShowInviteModalRole(true);

  const handleCloseee = () => setModalOpen(false);
  const handleShowww = () => setModalOpen(true);

  function randomColor() {
    let maxVal = 0xffffff; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`;
  }

  //   console.log(location.state.project);
  const updateProjectName = (value) => {
    axios
      .put("/myprojects/updateprojectname", {
        projectId: location.state.project._id,
        name: value,
      })
      .then((res) => {
        // console.log(res.data);
        setMyProject(res.data);
      })
      .catch((err) => console.log(err + "Specific Project 19"));
  };
  const updateProjectDescription = (value) => {
    console.log("value");
    console.log(value);
    axios
      .put("/myprojects/updateprojectDescription", {
        projectId: myProject._id,
        description: value,
      })
      .then((res) => {
        // console.log(res.data);
        setMyProject(res.data);
      })
      .catch((err) => console.log(err + "Specific Project 35"));
  };
  const updateProjectDueDate = (value) => {
    // console.log(value);
    axios
      .put("/myprojects/updateprojectduedate", {
        projectId: myProject._id,
        dueDate: value,
      })
      .then((res) => {
        // console.log(res.data);
        setMyProject(res.data);
      })
      .catch((err) => console.log(err + "Specific Project 35"));
  };

  const updateProjectStatus = (value) => {
    axios
      .put("/myprojects/updateprojectstatus", {
        projectId: myProject._id,
        status: value,
      })
      .then((res) => {
        // console.log(res.data);
        // toast.success(`${myProject.projectName} status set to ${value}`);
        setMyProject(res.data);
      })
      .catch((err) => console.log(err + "Specific Project 35"));
  };

  const handleCreateBoard = () => {
    // console.log(user);
    axios
      .post("/myboards/createboardwithproject", {
        userId: user._id,
        projectId: myProject._id,
      })
      .then((rec) => {
        // console.log(rec.data);
        navigate(`/boards/${rec.data._id}`);
      })
      .catch((err) => console.log(err));
  };

  const handleViewBoard = () => {
    // console.log(myBoard);
    navigate(`/boards/${myBoard._id}`, {
      state: { hide: true },
    });
  };

  const handleSave = (type, id) => {
    // console.log(type, id);
    handleClosee();
    // const myObj = { type: type, id: id };
    axios
      .post("/myprojects/updateroles", {
        projectId: myProject._id,
        projectroles: id,
      })
      .then((res) => {
        // console.log(res.data);
        setMyProject(res.data);
        toast.success("Project Lead Added");
      })
      .catch((err) => console.log(err + "specific Project 135"));
  };

  const removeRole = () => {
    axios
      .post("/myprojects/updateroles", {
        projectId: myProject._id,
        projectroles: null,
      })
      .then((res) => {
        console.log(res.data);
        setMyProject(res.data);
        toast.success("Project Lead Removed");
      })
      .catch((err) => console.log(err + "specific Project 154"));
  };

  const addNewEvent = (newEvent) => {
    // console.log(newEvent);
    // set event category default value if category is not selected
    if (newEvent.title && newEvent.start) {
      // const formatted = moment(newEvent.start).toDate();
      // console.log(newEvent.start);
      var myObj = {
        // _id: Math.floor(Math.random() * 10000),
        madeBy: user._id,
        title: newEvent.title,
        startDate: newEvent.start,
        category: "Goal",
        projectId: myProject?._id,
      };
      axios
        .post("http://localhost:5000/myCalendar/addNewEvent", myObj)
        .then((res) => {
          // console.log("Event Added: " + res.data);
          toast.success(`${res.data.title} Added`);
          fetchData();
        });
      setNewEvent({ title: "", start: null });
      setModalOpen(false);
    } else {
      alert("Please fill all required fields");
    }
  };

  const deleteEvent = (event) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete goal?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete("http://localhost:5000/myCalendar/deleteEvent", {
                data: { _id: event._id },
              })
              .then((res) => {
                toast.success(`${res.data.title} Deleted`);
                fetchData();
              })
              .catch((err) => console.log(err));
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleFileUpload = (file) => {
    console.log(file);
    axios
      .post("/myProjects/uploadfile", { projectId: myProject._id, file: file })
      .then((rec) => {
        console.log(rec.data);
        toast.success("File Uploaded" + file.name);
        setMyProject(rec.data);
      })
      .catch((err) => console.log(err));
  };

  const deleteFile = (file) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete File?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete("http://localhost:5000/myProjects/deleteprojectfile", {
                data: { _id: myProject._id, fileId: file._id },
              })
              .then((rec) => {
                toast.success(`${file.fileName.substring(0, 15)} Deleted`);
                setMyProject(rec.data);
              })
              .catch((err) => console.log(err + "Specific Project 218"));
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const updateMilestone = (id, checked) => {
    axios
      .post("/myprojects/updatemilestone", {
        projectId: myProject._id,
        milestoneId: id,
        checked: checked,
      })
      .then((res) => {
        console.log(res.data);
        setMyProject(res.data);
      })
      .catch((err) => console.log(err + "specific Project 267"));
  };
  const removeMilestone = (id) => {
    axios
      .post("/myprojects/deletemilestone", {
        projectId: myProject._id,
        milestoneId: id,
      })
      .then((res) => {
        // console.log(res.data);
        setMyProject(res.data);
      })
      .catch((err) => console.log(err + "specific Project 259"));
  };
  const addMilestone = (value) => {
    const task = {
      task: value,
      completed: false,
    };

    axios
      .post("/myprojects/addmilestone", {
        projectId: myProject._id,
        task: value,
        completed: false,
      })
      .then((res) => {
        console.log(res.data);
        setMyProject(res.data);
      })
      .catch((err) => console.log(err + "specific Project 267"));
  };

  useEffect(() => {
    axios
      .get("/myboards/getprojectboard", {
        params: { projectId: location.state.project._id },
      })
      .then((res) => {
        // console.log(res.data[0]);
        setMyBoard(res.data[0]);
      })
      .catch((err) => console.log(err + "Specific Project 76"));
  }, []);

  useEffect(() => {
    axios
      .get("/myprojects/getmyproject", {
        params: { projectId: location.state.project._id },
      })
      .then((res) => {
        // console.log(res.data[0]);
        setMyProject(res.data[0]);
        setSelectedEmployees(res.data[0].projectAssignedTo);
      })
      .catch((err) => console.log(err + "Specific Project 250"));

    let r = localStorage.getItem("role");
    setRole(r);
  }, []);

  // get team
  useEffect(() => {
    // console.log(location.state.project.teamId);
    if (location.state.project.teamId) {
      // get team
      axios
        .get("http://localhost:5000/team/teambyid", {
          params: { teamId: location.state.project.teamId },
        })
        .then((rec) => {
          console.log(rec.data[0]);
          setMyTeam(rec.data[0]);
        })
        .catch((err) => console.log(err + "Line 358 in Specific Project"));
    }
  }, []);

  useEffect(() => {
    if (myProject) {
      console.log(myProject);
      axios
        .get("/emp/getemployeeinformation", {
          params: { _id: myProject.projectroles },
        })
        .then((rec) => {
          console.log(rec.data);
          setProjectRoleEmployee(rec.data[0]);
        })
        .catch((err) => console.log(err + "Specific Project 141"));
    }
  }, [myProject]);

  const fetchData = () => {
    axios
      .get("/mycalendar/getmyprojectgoal", {
        params: { projectId: location.state.project._id },
      })
      .then((res) => {
        // console.log(res.data[0]);
        setGoals(res.data);
      })
      .catch((err) => console.log(err + "Specific Project 138"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="project-overview-status-container">
      <div className="project-overview-container">
        <div className="overview-text">
          <Button
            variant="primary"
            className=""
            style={{ display: "flex", float: "right", marginRight: "10px" }}
            onClick={myBoard ? handleViewBoard : handleCreateBoard}
          >
            {myBoard ? "View Board" : "Create Board"}
          </Button>
          <div>
            <Editable
              displayClass="project-overview-text-title"
              editClass="project-overview-text-title-edit"
              defaultValue={myProject?.projectName}
              text={myProject?.projectName}
              type={"text"}
              placeholder="Enter Title"
              onSubmit={updateProjectName}
              emp={user?.role == "Employee" ? true : undefined}
            />
          </div>
          {/* <p>How we will collaborate</p> */}
          {/* <input type="text" placeholder="How we will collaborate" /> */}
          <div className="overview-text">
            {/* <textarea
              name=""
              id=""
              cols="70"
              rows="3"
              placeholder="Welcome to your team and set the tone for how you'll work together in REMS."
            ></textarea> */}
            <Editable
              displayClass="project-overview-text-area"
              editClass="project-overview-text-area-edit"
              defaultValue={myProject?.projectDescription}
              text={myProject?.projectDescription}
              type={"textarea"}
              placeholder="Welcome to your Project. Now set the tone for how you'll work together with your team in REMS."
              onSubmit={updateProjectDescription}
              emp={
                user?.role === "Employee" &&
                user?._id !== myProject?.projectroles
                  ? true
                  : undefined
              }
            />
          </div>
        </div>
        <div className="ProjectOverviewSection">
          <div className="ProjectOverviewSection-headingContainer">
            <h4 className="ProjectOverviewSection-heading Typography Typography--colorDarkGray3 Typography--h4 Typography--fontWeightMedium">
              Project Lead
            </h4>
            <div className="ProjectOverviewSection-headingExtraContent"></div>
          </div>
          <div className="ProjectOverviewSection-content">
            <div className="ProjectOverviewMembersSection-membersGrid">
              {myProject?.projectroles ? (
                <div
                  id="lui_430"
                  className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SubtleButtonCard ProjectOverviewMembersSection-member ProjectOverviewMember"
                  role="button"
                  aria-disabled="false"
                  aria-expanded="false"
                  tabindex="0"
                >
                  <div className="ProjectOverviewMember-avatar">
                    <div
                      aria-hidden="true"
                      className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--large AvatarPhoto--color3"
                    >
                      {projectRoleEmployee?.username
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                  </div>
                  <div className="ProjectOverviewMember-info">
                    <div className="ProjectOverviewMember-nameRow">
                      <h6 className="Typography Typography--colorDarkGray3 Typography--overflowTruncate Typography--h6 Typography--fontWeightMedium">
                        {projectRoleEmployee?.username}
                      </h6>
                    </div>
                    <span className="Typography Typography--colorDarkGray1 Typography--overflowTruncate Typography--s">
                      Project Lead
                    </span>
                  </div>
                  <div className="dropdown-status">
                    {user?.role === "admin" && (
                      <DropdownButton
                        variant="success"
                        id="dropdown-basic-button"
                        className="dropdown-role"
                        // title="Update Role"
                      >
                        {/* <Dropdown.Item>Change Role</Dropdown.Item> */}
                        <Dropdown.Item onClick={() => removeRole()}>
                          Remove role
                        </Dropdown.Item>
                        {/* <Dropdown.Item>Remove from Project</Dropdown.Item> */}
                      </DropdownButton>
                    )}
                  </div>
                  {/* <div className="ProjectOverviewMember-downIcon">
                  <svg
                    className="MiniIcon ArrowDownMiniIcon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    onClick={() => setShowEditRemove(!showEditRemove)}
                  >
                    <path d="M3.5,8.9c0-0.4,0.1-0.7,0.4-1C4.5,7.3,5.4,7.2,6,7.8l5.8,5.2l6.1-5.2C18.5,7.3,19.5,7.3,20,8c0.6,0.6,0.5,1.5-0.1,2.1 l-7.1,6.1c-0.6,0.5-1.4,0.5-2,0L4,10.1C3.6,9.8,3.5,9.4,3.5,8.9z"></path>
                  </svg>
                </div> */}
                </div>
              ) : (
                <>
                  {user?.role !== "Employee" ? (
                    <div
                      className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SubtleButtonCard ProjectOverviewMembersSection-addMemberButton"
                      role="button"
                      aria-disabled="false"
                      aria-expanded="false"
                      tabindex="0"
                    >
                      <div
                        className="ProjectOverviewMembersSection-addMemberButtonPlusIcon"
                        onClick={handleShoww}
                      >
                        <svg
                          className="Icon PlusIcon"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M26,14h-8V6c0-1.1-0.9-2-2-2l0,0c-1.1,0-2,0.9-2,2v8H6c-1.1,0-2,0.9-2,2l0,0c0,1.1,0.9,2,2,2h8v8c0,1.1,0.9,2,2,2l0,0c1.1,0,2-0.9,2-2v-8h8c1.1,0,2-0.9,2-2l0,0C28,14.9,27.1,14,26,14z"></path>
                        </svg>
                      </div>
                      <div
                        className="ProjectOverviewMembersSection-addMemberButtonTextContainer"
                        onClick={handleShoww}
                      >
                        <h6 className="ProjectOverviewMembersSection-addMemberButtonText Typography Typography--colorWeak Typography--h6 Typography--fontWeightMedium">
                          Add Project Lead
                        </h6>
                      </div>
                    </div>
                  ) : (
                    <span>Project lead not added</span>
                  )}
                </>
              )}
              <AddMemberRole
                show={showInviteModalRole}
                handleClose={handleClosee}
                handleSave={handleSave}
              />
              {showEditRemove && (
                <div className="specific-project-menu-dropdown">
                  <button>Change Role</button>
                  <button>Remove as Project Owner</button>
                  <button>Remove From Project</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ProjectOverviewSection">
          <div className="ProjectOverviewSection-headingContainer">
            <h4 className="ProjectOverviewSection-heading Typography Typography--colorDarkGray3 Typography--h4 Typography--fontWeightMedium">
              Goals
            </h4>
            {user?.role !== "Employee" && (
              <div
                className="ProjectOverviewSection-headingExtraContent"
                onClick={handleShowww}
                style={{ cursor: "pointer" }}
              >
                <Plus />
              </div>
            )}
          </div>
          <AddEventModal
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            addNewEvent={addNewEvent}
            modalOpen={modalOpen}
            handleClose={handleCloseee}
            category={"Goal"}
          />
          <div className="ProjectOverviewSection-content">
            <div className="ProjectOverviewGoalsEmptyState">
              {goals?.length > 0 ? (
                <div className="ProjectOverviewGoalsEmptyState-body">
                  <div className="allProjects">
                    <div className="project-column project-column-specific-project">
                      {goals?.map((goal) => {
                        return (
                          <div className="featuredItem featuredItem-specific-project">
                            {user?.role !== "Employee" && (
                              <div className="specific-project-trash-container">
                                <Trash
                                  className="trash"
                                  onClick={() => deleteEvent(goal)}
                                />
                              </div>
                            )}
                            <div className="assigned-by">
                              <span className="featuredSub">Title: </span>
                              <span className="featuredTitle">
                                {goal?.title}
                              </span>
                            </div>
                            <div className="assigned-by">
                              <span className="featuredSub">Start Date: </span>
                              <span className="featuredTitle">
                                {goal?.startDate.substring(0, 10)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ProjectOverviewGoalsEmptyState-body">
                  <div className="ProjectOverviewGoalsEmptyState-illustrationContainer">
                    <img
                      className="Illustration Illustration--small Illustration--spot"
                      alt=""
                      src="https://d3ki9tyy5l5ruj.cloudfront.net/obj/98e78878c97c4d398e6265b92028d97dfb33043c/shooting_target.svg"
                    />
                  </div>
                  <div className="ProjectOverviewGoalsEmptyState-content">
                    <span className="Typography Typography--m">
                      {user?.role !== "Employee"
                        ? "Connect or create a goal to link this project to a larger purpose."
                        : "Project goals will be shown here"}
                    </span>
                    {user?.role !== "Employee" && (
                      <div className="ProjectOverviewGoalsEmptyState-addGoalButton">
                        <div
                          className="ThemeableRectangularButtonPresentation--isEnabled ThemeableRectangularButtonPresentation ThemeableRectangularButtonPresentation--large SubtleButton--standardTheme SubtleButton--isCompact SubtleButton SubtleButton--standardTheme SubtleButton--isCompact SubtleButton"
                          role="button"
                          aria-disabled="false"
                          tabindex="0"
                          onClick={handleShowww}
                        >
                          <svg
                            className="Icon ThemeableRectangularButtonPresentation-leftIcon GoalSimpleIcon"
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path d="M31,21.5L19.5,4c-0.8-1.2-2.1-1.9-3.5-1.9S13.3,2.8,12.5,4L1,21.5c-0.9,1.3-0.9,2.9-0.2,4.3C1.6,27.2,2.9,28,4.5,28h23c1.6,0,2.9-0.8,3.7-2.2S31.8,22.8,31,21.5z M29.4,24.8C29,25.5,28.3,26,27.5,26h-23c-0.8,0-1.5-0.4-1.9-1.1c-0.4-0.7-0.3-1.5,0.1-2.2L14.2,5.1c0.4-0.6,1.1-1,1.8-1s1.4,0.4,1.8,1l11.5,17.6C29.8,23.3,29.8,24.1,29.4,24.8z"></path>
                          </svg>
                          Add goal
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ProjectOverviewSection">
          <div className="ProjectOverviewSection-headingContainer">
            <h4 className="ProjectOverviewSection-heading Typography Typography--colorDarkGray3 Typography--h4 Typography--fontWeightMedium">
              Key resources
            </h4>
            <FileUpload handleFileUpload={handleFileUpload} />
            {/* <Plus /> */}
            <div className="ProjectOverviewSection-headingExtraContent"></div>
          </div>
          {myProject?.projectFiles.length > 0 ? (
            <div className="allProjects">
              {myProject?.projectFiles?.map((f) => {
                return (
                  <div
                    className="messageFile project-column project-column-specific-project"
                    style={{
                      margin: "10px",
                    }}
                  >
                    <div style={{ margin: "8px" }}>
                      {/* <AttachmentIcon /> */}
                      <Trash className="trash" onClick={() => deleteFile(f)} />
                    </div>
                    <div className="message-file-name">
                      <a href={f.file} download={f.fileName}>
                        {f.fileName.length > 25
                          ? `${f.fileName.substring(0, 25)}....`
                          : f.fileName}
                      </a>
                    </div>
                    <div className="download-icon">
                      <a href={f.file} download={f.fileName}>
                        <FileDownloadIcon />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ProjectOverviewSection-content">
              <div>
                <div className="ProjectOverviewKeyResourcesEmptyState">
                  <div className="ProjectOverviewKeyResourcesEmptyState-withoutBrief">
                    <img
                      className="Illustration Illustration--medium Illustration--spot ProjectOverviewKeyResourcesEmptyState-illustration"
                      alt=""
                      src="https://d3ki9tyy5l5ruj.cloudfront.net/obj/f696815edc59be79affd1063efd6728836b8e5e4/key_resources.svg"
                    />
                    <div className="ProjectOverviewKeyResourcesEmptyState-content--flagEnabled ProjectOverviewKeyResourcesEmptyState-content">
                      <span className="Typography Typography--m">
                        Align your team around a shared vision with a project
                        brief and supporting resources.
                      </span>
                      <div className="ProjectOverviewKeyResourcesEmptyState-buttons">
                        {/* <div
                          className="ThemeableRectangularButtonPresentation--isEnabled ThemeableRectangularButtonPresentation ThemeableRectangularButtonPresentation--large SubtleButton--standardTheme SubtleButton--isCompact SubtleButton ProjectOverviewKeyResourcesEmptyState-projectBriefButton SubtleButton--standardTheme SubtleButton--isCompact SubtleButton ProjectOverviewKeyResourcesEmptyState-projectBriefButton"
                          role="button"
                          aria-disabled="false"
                          tabindex="0"
                        >
                          <svg
                            className="Icon ThemeableRectangularButtonPresentation-leftIcon BriefIcon"
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path d="M12.5,18.3c-0.3,0-0.6-0.1-0.9-0.3c-0.5-0.3-0.7-0.9-0.6-1.5l0.5-3.1l-2.3-2.2c-0.4-0.4-0.6-1-0.4-1.5c0.2-0.5,0.6-0.9,1.2-1l3.1-0.5l1.4-2.8c0.3-0.5,0.8-0.8,1.3-0.8s1.1,0.3,1.3,0.8l1.4,2.8l3.1,0.5c0.6,0.1,1,0.5,1.2,1c0.2,0.5,0,1.1-0.4,1.5l-2.3,2.2l0.5,3.1c0.1,0.6-0.1,1.1-0.6,1.5c-0.5,0.3-1.1,0.4-1.6,0.1L16,16.7l-2.8,1.5C13,18.2,12.7,18.3,12.5,18.3z M16,14.4l2.8,1.5l-0.5-3.1l2.3-2.2l-3.2-0.5L16,7.2l-1.4,2.9l-3.2,0.5l2.3,2.2l-0.5,3.1L16,14.4zM21.6,10.7L21.6,10.7L21.6,10.7z M24,32H8c-2.2,0-4-1.8-4-4V4c0-2.2,1.8-4,4-4h16c2.2,0,4,1.8,4,4v24C28,30.2,26.2,32,24,32z M8,2C6.9,2,6,2.9,6,4v24c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4c0-1.1-0.9-2-2-2H8z M23,21c0-0.6-0.4-1-1-1H10c-0.6,0-1,0.4-1,1s0.4,1,1,1h12C22.6,22,23,21.6,23,21z M23,25c0-0.6-0.4-1-1-1H10c-0.6,0-1,0.4-1,1s0.4,1,1,1h12C22.6,26,23,25.6,23,25z"></path>
                          </svg>
                          Create project brief
                        </div> */}
                        <span className="AddAttachmentsButton">
                          <div
                            id="lui_435"
                            className="ThemeableRectangularButtonPresentation--isEnabled ThemeableRectangularButtonPresentation ThemeableRectangularButtonPresentation--large SubtleButton--standardTheme SubtleButton--isCompact SubtleButton ProjectOverviewKeyResourcesEmptyState-addAttachmentButton SubtleButton--standardTheme SubtleButton--isCompact SubtleButton ProjectOverviewKeyResourcesEmptyState-addAttachmentButton"
                            role="button"
                            aria-disabled="false"
                            aria-expanded="false"
                            tabindex="0"
                          >
                            <FileUpload handleFileUpload={handleFileUpload} />
                            Add links &amp; files
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="ProjectOverviewSection milestones-container">
          <div className="ProjectOverviewSection-headingContainer">
            <h4 className="ProjectOverviewSection-heading Typography Typography--colorDarkGray3 Typography--h4 Typography--fontWeightMedium">
              MileStones
              <div className="checksquare">
                <CheckSquare />
              </div>
            </h4>
            <div className="ProjectOverviewSection-headingExtraContent"></div>
          </div>
          <div className="ProjectOverviewSection-content">
            <div className="cardinfo_box">
              <div className="cardinfo_box_task_list">
                {myProject?.milestones?.map((item) => (
                  <div key={item.id} className="cardinfo_box_task_checkbox">
                    <input
                      type="checkbox"
                      defaultChecked={item.completed}
                      onChange={(event) =>
                        updateMilestone(item._id, event.target.checked)
                      }
                    />
                    <p className={item.completed ? "completed" : ""}>
                      {item.task}
                    </p>
                    {(user?.role !== "Employee" ||
                      user?._id === myProject?.projectroles) && (
                      <Trash
                        className="trash"
                        onClick={() => removeMilestone(item._id)}
                      />
                    )}
                  </div>
                ))}
              </div>
              {user?.role !== "Employee" ||
              user?._id === myProject?.projectroles ? (
                <Editable
                  displayClass="add-milestone-button"
                  editClass="add-milestone-button-edit"
                  text={"Add Milestone"}
                  placeholder="Enter Milestone"
                  onSubmit={addMilestone}
                  emp={
                    user?.role === "Employee" &&
                    user?._id !== myProject?.projectroles
                      ? true
                      : undefined
                  }
                />
              ) : null}
            </div>
            {/* <div className="cardinfo_box">
              <div className="cardinfo_box_progress-bar">
                <div className="cardinfo_box_progress" />
              </div>
              <div className="cardinfo_box_task_list">
                <div className="cardinfo_box_task_checkbox">
                  <input
                    type="checkbox"
                    //   defaultChecked={item.completed}
                    //   onChange={(event) =>
                    //     updateTask(item._id, event.target.checked)
                    //   }
                  />
                  <p>some task</p>
                  <Trash />
                </div>
              </div>
              <Editable
                text={"Add a Task"}
                type={"text"}
                placeholder="Enter task"
                // onSubmit={addTask}
              />
            </div> */}
          </div>
        </div>
        {role === "admin" ? (
          <div className="ProjectOverviewSection milestones-container">
            <div className="ProjectOverviewSection-headingContainer">
              <h4 className="ProjectOverviewSection-heading Typography Typography--colorDarkGray3 Typography--h4 Typography--fontWeightMedium">
                Members Times
              </h4>
            </div>
            <Table className="table">
              <thead>
                <tr>
                  <th className="thead">Member Name</th>
                  <th className="thead">Active Time</th>
                </tr>
              </thead>
              <tbody>
                {myProject?.hoursWorked.map((w, index) => {
                  return (
                    <tr
                      key={index}
                      style={
                        index % 2 === 0
                          ? { backgroundColor: "#98A8F8" }
                          : { backgroundColor: "#BCCEF8" }
                      }
                    >
                      <td>{w.user}</td>
                      <td>{w.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="ProjectOverviewSection-content">
              <Table className="table">
                <thead>
                  <tr>
                    <th className="thead">Member Name</th>
                    <th className="thead">Pause Time</th>
                  </tr>
                </thead>
                <tbody>
                  {myProject?.numOfBreaks.map((w, ind) => {
                    return w.time.map((y, index) => {
                      return (
                        <tr
                          key={index}
                          style={
                            ind % 2 === 0
                              ? { backgroundColor: "#98A8F8" }
                              : { backgroundColor: "#BCCEF8" }
                          }
                        >
                          <td>{w.user}</td>
                          <td>{y}</td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </Table>
            </div>
            <div className="ProjectOverviewSection-content"></div>
          </div>
        ) : null}
      </div>
      <div className="project-status-container">
        <div className="project-status">
          <div class="ProjectOverviewActivityFeedPublishedReportSection-heading">
            <h4 class="Typography Typography--colorDarkGray1 Typography--h4 Typography--fontWeightMedium">
              {/* What's the status? */}
              {myProject?.status ? "Status" : "What's the status?"}
            </h4>
            {myProject?.status && (
              <>
                {user?.role === "admin" ||
                user?._id === myProject?.projectroles ? (
                  <div className="dropdown-status">
                    <DropdownButton
                      id="dropdown-basic-button"
                      title="Update Status"
                    >
                      <Dropdown.Item
                        onClick={() => updateProjectStatus("ontrack")}
                      >
                        On Track
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => updateProjectStatus("atrisk")}
                      >
                        At Risk
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => updateProjectStatus("offtrack")}
                      >
                        Off Track
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => updateProjectStatus("completed")}
                      >
                        Completed
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                ) : null}
              </>
            )}
          </div>
          {!myProject?.status ? (
            <>
              {user?.role !== "Employee" ? (
                <>
                  <div
                    className="badge-container badge-container-green"
                    onClick={() => updateProjectStatus("ontrack")}
                  >
                    <div className="green-badge">
                      <div className="badge-dot green-dot"></div>
                      <span class="Typography Typography--overflowTruncate Typography--m">
                        On track
                      </span>
                    </div>
                  </div>
                  <div
                    className="badge-container badge-container-at-risk"
                    onClick={() => updateProjectStatus("atrisk")}
                  >
                    <div className="at-risk-badge">
                      <div className="badge-dot at-risk-dot"></div>
                      <span class="Typography Typography--overflowTruncate Typography--m">
                        At Risk
                      </span>
                    </div>
                  </div>
                  <div
                    className="badge-container badge-container-off-track"
                    onClick={() => updateProjectStatus("offtrack")}
                  >
                    <div className="off-track-badge">
                      <div className="badge-dot off-track-dot"></div>
                      <span class="Typography Typography--overflowTruncate Typography--m">
                        Off track
                      </span>
                    </div>
                  </div>
                  <div
                    className="badge-container badge-container-completed"
                    onClick={() => updateProjectStatus("completed")}
                  >
                    <div className="completed-badge">
                      <div className="badge-dot completed-dot"></div>
                      <span class="Typography Typography--overflowTruncate Typography--m">
                        Completed
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <span>Not marked yet</span>
              )}
            </>
          ) : (
            <>
              {myProject.status === "ontrack" && (
                <div className="badge-container badge-container-green">
                  <div className="green-badge">
                    <div className="badge-dot green-dot"></div>
                    <span class="Typography Typography--overflowTruncate Typography--m">
                      On track
                    </span>
                  </div>
                </div>
              )}
              {myProject.status === "atrisk" && (
                <div className="badge-container badge-container-at-risk">
                  <div className="at-risk-badge">
                    <div className="badge-dot at-risk-dot"></div>
                    <span class="Typography Typography--overflowTruncate Typography--m">
                      At Risk
                    </span>
                  </div>
                </div>
              )}
              {myProject.status === "offtrack" && (
                <div className="badge-container badge-container-off-track">
                  <div className="off-track-badge">
                    <div className="badge-dot off-track-dot"></div>
                    <span class="Typography Typography--overflowTruncate Typography--m">
                      Off track
                    </span>
                  </div>
                </div>
              )}
              {myProject.status === "completed" && (
                <div className="badge-container badge-container-completed">
                  <div className="completed-badge">
                    <div className="badge-dot completed-dot"></div>
                    <span class="Typography Typography--overflowTruncate Typography--m">
                      Completed
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="project-due-date-container">
          <Calendar
            size={30}
            style={{ marginTop: "15px", marginRight: "5px" }}
          />
          <Editable
            displayClass="project-due-date"
            editClass="project-due-date-edit"
            defaultValue={myProject?.dueDate.slice(0, 10)}
            text={myProject?.dueDate.slice(0, 10)}
            type={"date"}
            placeholder="Enter Due Date"
            onSubmit={updateProjectDueDate}
            emp={
              user?.role === "Employee" && user?._id !== myProject?.projectroles
                ? true
                : undefined
            }
          />
        </div>
        <div className="project-members-container" onClick={handleShow}>
          <Users size={30} style={{ marginRight: "5px" }} />
          <span style={{ fontSize: "20px" }}>Members</span>
        </div>
        <ProjectMembers
          showInviteModal={showInviteModal}
          setShowInviteModal={setShowInviteModal}
          handleClose={handleClose}
          handleShow={handleShow}
          myProject={myProject}
          setMyProject={setMyProject}
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          user={user}
        />
        {myTeam && (
          <div
            className="project-members-container"
            onClick={() => navigate("/teamInfo", { state: { team: myTeam } })}
          >
            <GroupsIcon size={30} style={{ marginRight: "5px" }} />
            <span style={{ fontSize: "20px" }}>{myTeam?.teamName}</span>
            <ArrowRight size={30} style={{ marginRight: "5px" }} />
          </div>
        )}
        <div className="project-created-container">
          <div className="project-created-container-icon">
            <Clipboard size={40} />
          </div>
          <div className="project-created-container-info">
            <h5>Project Created</h5>
            <div className="project-created-container-info-time-ago">
              <h5>{user.username}</h5>
              <span className="project-created-span">
                {format(myProject?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificProject;
