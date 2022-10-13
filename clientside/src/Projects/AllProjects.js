import Button from "react-bootstrap/Button";
import React, { useEffect } from "react";

import { useState } from "react";
import "./allProjects.css";
import ProjectCard from "./ProjectCard";
import NewProjectModal from "./NewProjectModal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import ProjectInfo from "./ProjectInfo";
import { useNavigate } from "react-router-dom";
const AllProjects = ({ user }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState();
  const [width, setWidth] = useState("0");
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectDescription: "",
    projectCost: "",
    assignTo: "",
    assignToId: "",
    priority: "",
  });

  const [role, setRole] = useState(localStorage.getItem("role"));
  const [searchInput, setSearchInput] = useState();
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);

    if (e.target.value) {
      if (role == "Employee") {
        axios
          .get(`/myprojects/employeesearchproject/${e.target.value}`, {
            params: { _id: user._id },
          })
          .then((records) => {
            // console.log(records.data);
            setProjects(records.data);
          })
          .catch((err) => console.log(err));
      } else {
        axios
          .get(`/myprojects/searchproject/${e.target.value}`, {
            params: { _id: user._id },
          })
          .then((records) => {
            // console.log(records.data);
            setProjects(records.data);
          })
          .catch((err) => console.log(err));
      }
    } else {
      fetchData().catch(console.error);
    }
  };

  const handleVolunteerClick = (project) => {
    axios
      .post("/myprojects/acceptvolunteerproject", {
        assignedTo: user.username,
        assignedToId: user._id,
        _id: project._id,
      })
      .then((rec) => {
        // remove the project from Projects
        const newProjects = projects.filter((proj) => proj._id !== project._id);
        setProjects([...newProjects, rec.data]);
      })
      .catch((err) => console.log(err));
  };

  const handleFilterChangeEmployee = (e) => {
    const category = e.target.value;
    if (category === "All") {
      fetchData().catch(console.error);
      return;
    } else if (category === "Completed") {
      axios
        .get("/myProjects/completed", { params: { _id: user._id } })
        .then((records) => {
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category === "Incompleted") {
      axios
        .get("/myProjects/incompleted", { params: { _id: user._id } })
        .then((records) => {
          // console.log(records.data);
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category == "Not Assigned") {
      // axios
      //   .get("/myprojects/notassigned", { params: { _id: user._id } })
      //   .then((rec) => {
      //     // console.log(rec);
      //     setProjects(rec.data);
      //   })
      //   .catch((err) => console.log(err));
      return;
    } else if (category == "Sort By Priority") {
      axios
        .get("/myProjects/employeeprojects", {
          params: { userId: user._id },
        })
        .then((rec) => {
          // console.log(rec);
          const order = ["Critical", "Important", "Normal"];
          const filterByPriorityProjects = rec.data.sort(
            (x, y) =>
              order.indexOf(x.projectPriority) -
              order.indexOf(y.projectPriority)
          );
          // console.log(filterByPriorityProjects);
          setProjects(filterByPriorityProjects);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category === "Sort By Date") {
      // Sort in Ascending order (low to high) i-e 2012,2013
      const sortedAsc = projects
        .map((obj) => {
          return { ...obj, dueDate: new Date(obj.dueDate) };
        })
        .sort((a, b) => a.dueDate - b.dueDate);
      // console.log(sortedAsc);
      setProjects(sortedAsc);
      return;
    }
  };

  const handleFilterChangeAdmin = (e) => {
    const category = e.target.value;
    if (category === "All") {
      fetchData().catch(console.error);
      return;
    } else if (category === "Completed") {
      axios
        .get("/myProjects/completedadmin", { params: { _id: user._id } })
        .then((records) => {
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category === "Incompleted") {
      axios
        .get("/myProjects/incompletedadmin", {
          params: { _id: user._id },
        })
        .then((records) => {
          // console.log(records.data);
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category === "Not Assigned") {
      axios
        .get("/myprojects/notassignedadmin", {
          params: { _id: user._id },
        })
        .then((rec) => {
          // console.log(rec);
          setProjects(rec.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category === "Sort By Priority") {
      axios
        .get("/myprojects/organizationprojects", {
          params: { _id: user._id },
        })
        .then((rec) => {
          // console.log(rec);
          const order = ["Critical", "Important", "Normal"];
          const filterByPriorityProjects = rec.data.sort(
            (x, y) =>
              order.indexOf(x.projectPriority) -
              order.indexOf(y.projectPriority)
          );
          // console.log(filterByPriorityProjects);
          setProjects(filterByPriorityProjects);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category === "Sort By Date") {
      // Sort in Ascending order (low to high) i-e 2012,2013
      const sortedAsc = projects
        .map((obj) => {
          return { ...obj, dueDate: new Date(obj.dueDate) };
        })
        .sort((a, b) => a.dueDate - b.dueDate);
      // console.log(sortedAsc);
      setProjects(sortedAsc);
      return;
    }
  };

  const handleClickOnProject = (project) => {
    // setWidth(wid);
    navigate(`/myproject/${project._id}`, {
      state: {
        project: project,
        // width: width,
      },
    });
    // user={user}
    //           project={projects[0]}
    //           setProjects={handleClickOnProject}
    //           width={width}
    //           setWidth={setWidth}
    // if (check) {
    //   fetchData().catch(console.error);
    //   setShowProjectInfo(true);
    // } else {
    //   // console.log(project);
    //   // console.log(check);
    //   setProjects([project]);
    //   setShowProjectInfo(false);
    // }
  };

  const fetchData = async () => {
    if (user.role === "Employee") {
      const res = await axios.get("/myProjects/employeeprojects", {
        params: { userId: user._id },
      });
      // console.log(res.data);
      setProjects(res.data);
    } else {
      const res = await axios.get("/myProjects/organizationprojects", {
        params: { _id: user._id },
      });
      // console.log(res.data);
      setProjects(res.data);
    }
  };
  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  return (
    <div className="projectContainer">
      {showProjectInfo ? (
        <>
          <div className="project-header">
            <div className="search-container">
              <Form.Control
                type="search"
                placeholder="Search Projects"
                className="me-2 search-projects"
                aria-label="Search"
                value={searchInput}
                onChange={handleSearchChange}
                style={{ boxShadow: "#da0d50 !important" }}
              />
            </div>
            <div className="project-button-container">
              <select
                className="selectFilter"
                onChange={
                  user.role === "Employee"
                    ? handleFilterChangeEmployee
                    : handleFilterChangeAdmin
                }
              >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Incompleted">Incompleted</option>
                {user?.role !== "Employee" && (
                  <option value="Not Assigned">Not Assigned</option>
                )}
                <option value="Sort By Priority">Sort By Priority</option>
                <option value="Sort By Date">Sort By Date</option>
              </select>
              {role === "Employee" ? null : (
                <div className="create-project">
                  <Button
                    style={{ backgroundColor: "#1890ff" }}
                    onClick={handleShow}
                  >
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          </div>
          {projects?.length < 1 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "10%",
              }}
            >
              <h1>NO PROJECTS TO SHOW</h1>
            </div>
          )}
          <div className="allProjects">
            {projects?.map((project, index) => {
              return (
                <ProjectCard
                  project={project}
                  setProjects={handleClickOnProject}
                />
              );
              // if (
              //   role == "Employee" &&
              //   user._id == project.projectAssignedToId
              // ) {
              //   return (
              //     <ProjectCard
              //       project={project}
              //       setProjects={handleClickOnProject}
              //       role={role}
              //       userEmail={user.email}
              //     />
              //   );
              // } else if (role == "admin") {
              //   return (
              //     <ProjectCard
              //       project={project}
              //       setProjects={handleClickOnProject}
              //     />
              //   );
              // } else if (!project.projectAssignedTo) {
              //   return (
              //     <ProjectCard
              //       project={project}
              //       setProjects={handleClickOnProject}
              //       volunteer={false}
              //       handleVolunteerClick={handleVolunteerClick}
              //     />
              //   );
              // }
            })}
          </div>

          {show && (
            <NewProjectModal
              handleClose={handleClose}
              show={show}
              newProject={newProject}
              setNewProject={setNewProject}
            />
          )}
        </>
      ) : (
        <>
          {/* <ProjectCard
            project={projects[0]}
            setProjects={handleClickOnProject}
            role={role}
            userEmail={user.email}
          /> */}
          {projects && (
            <ProjectInfo
              user={user}
              project={projects[0]}
              setProjects={handleClickOnProject}
              width={width}
              setWidth={setWidth}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AllProjects;
