import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import "./allProjects.css";
import ProjectCard from "./ProjectCard";
import NewProjectModal from "./NewProjectModal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import ProjectInfo from "./ProjectInfo";
// var getProjects = [
//   {
//     _id: 1,
//     projectName: "Java",
//     projectAssignedBy: "Naseer",
//     projectDescription:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint ill consectetur id fugiat natus! Ab, cumque fugiat illo mollitia quamsuscipit iste, eveniet a quae saepe et aut ducimus aliquid!",
//     hoursWorked: "3hrs",
//     dueDate: "2022-02-24",
//     projectAssignedTo: "Sani",
//     milestones: "30%",
//     completed: "Incompleted",
//   },
//   {
//     _id: 2,
//     projectName: "Python",
//     projectAssignedBy: "Naseer",
//     projectDescription:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint ill consectetur id fugiat natus! Ab, cumque fugiat illo mollitia quamsuscipit iste, eveniet a quae saepe et aut ducimus aliquid!",
//     hoursWorked: "3hrs",
//     dueDate: "2027-02-24",
//     projectAssignedTo: "Sani",
//     milestones: "60%",
//     completed: "Incompleted",
//   },
//   {
//     _id: 3,
//     projectName: "C++",
//     projectAssignedBy: "Naseer",
//     projectDescription:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint ill consectetur id fugiat natus! Ab, cumque fugiat illo mollitia quamsuscipit iste, eveniet a quae saepe et aut ducimus aliquid!",
//     hoursWorked: "3hrs",
//     dueDate: "2023-02-24",
//     projectAssignedTo: "Sani",
//     milestones: "100%",
//     completed: "Completed",
//   },
//   {
//     _id: 4,
//     projectName: "JavaScript",
//     projectAssignedBy: "Naseer",
//     projectDescription:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint ill consectetur id fugiat natus! Ab, cumque fugiat illo mollitia quamsuscipit iste, eveniet a quae saepe et aut ducimus aliquid!",
//     hoursWorked: "3hrs",
//     dueDate: "2050-02-24",
//     projectAssignedTo: "Sani",
//     milestones: "40%",
//     completed: "Incompleted",
//   },
//   {
//     _id: 5,
//     projectName: "C#",
//     projectAssignedBy: "Sani",
//     projectDescription:
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit",
//     hoursWorked: "3hrs",
//     dueDate: "2043-02-24",
//     projectAssignedTo: "Naseer",
//     milestones: "90%",
//     completed: "Incompleted",
//   },
// ];
const AllProjects = ({ user }) => {
  const [projects, setProjects] = useState();
  const [width, setWidth] = useState("0");
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectDescription: "",
    projectCost: "",
    assignTo: "",
    assignToId: "",
    priority: "",
    // milestones: [
    //   {
    //     completionPercentage: "",
    //     dueDate: "",
    //   },
    // ],
    // endDate: "",
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

    axios
      .get(`/myprojects/${e.target.value}`)
      .then((records) => {
        // console.log(records.data);
        setProjects(records.data);
      })
      .catch((err) => console.log(err));
  };

  // const filterProjects = (category) => {
  //   if (category == "All") {
  //     //   setProjects(getProjects);
  //     axios
  //       .get("/myProjects")
  //       .then((records) => {
  //         console.log(records.data);
  //         setProjects(records.data);
  //       })
  //       .catch((err) => console.log(err));
  //     return;
  //   } else if (category == "Completed") {
  //     axios
  //       .get("/myProjects/completed")
  //       .then((records) => {
  //         setProjects(records.data);
  //       })
  //       .catch((err) => console.log(err));
  //     return;
  //   } else if (category == "Incompleted") {
  //     axios
  //       .get("/myProjects/incompleted")
  //       .then((records) => {
  //         setProjects(records.data);
  //       })
  //       .catch((err) => console.log(err));
  //     return;
  //   }
  //   // const newFilterProjects = projects.filter(
  //   //   (project) => project.completed == category
  //   // );
  //   // setProjects(newFilterProjects);
  // };

  // const filterProjectsDate = () => {
  //   // const convertStringDatesToDate = projects.map((obj) => {
  //   //   return { ...obj, dueDate: new Date(obj.dueDate) };
  //   // });

  //   // Sort in Ascending order (low to high) i-e 2012,2013
  //   const sortedAsc = projects
  //     .map((obj) => {
  //       return { ...obj, dueDate: new Date(obj.dueDate) };
  //     })
  //     .sort((a, b) => a.dueDate - b.dueDate);
  //   // console.log(sortedAsc);
  //   setProjects(sortedAsc);
  // };

  // const filterByAssigned = () => {
  //   axios
  //     .get("/myprojects/assigned")
  //     .then((rec) => {
  //       // console.log(rec);
  //       setProjects(rec.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const filterByPriority = () => {
  //   axios
  //     .get("/myprojects")
  //     .then((rec) => {
  //       // console.log(rec);
  //       const order = ["Critical", "Important", "Normal"];
  //       const filterByPriorityProjects = rec.data.sort(
  //         (x, y) =>
  //           order.indexOf(x.projectPriority) - order.indexOf(y.projectPriority)
  //       );
  //       console.log(filterByPriorityProjects);
  //       setProjects(filterByPriorityProjects);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const handleVolunteerClick = (project) => {
    axios
      .post("/myprojects/acceptvolunteerproject", {
        assignedTo: user.username,
        assignedToId: user._id,
        _id: project._id,
      })
      .then((rec) => {
        // remove the project from Projects
        const newProjects = projects.filter((proj) => proj._id != project._id);
        setProjects([...newProjects, rec.data]);
      })
      .catch((err) => console.log(err));
  };

  const handleFilterChange = (e) => {
    const category = e.target.value;
    if (category == "All") {
      //   setProjects(getProjects);
      axios
        .get("/myProjects")
        .then((records) => {
          // console.log(records.data);
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category == "Completed") {
      axios
        .get("/myProjects/completed")
        .then((records) => {
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category == "Incompleted") {
      axios
        .get("/myProjects/incompleted")
        .then((records) => {
          // console.log(records.data);
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category == "Not Assigned") {
      axios
        .get("/myprojects/assigned")
        .then((rec) => {
          // console.log(rec);
          setProjects(rec.data);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category == "Sort By Priority") {
      axios
        .get("/myprojects")
        .then((rec) => {
          // console.log(rec);
          const order = ["Critical", "Important", "Normal"];
          const filterByPriorityProjects = rec.data.sort(
            (x, y) =>
              order.indexOf(x.projectPriority) -
              order.indexOf(y.projectPriority)
          );
          console.log(filterByPriorityProjects);
          setProjects(filterByPriorityProjects);
        })
        .catch((err) => console.log(err));
      return;
    } else if (category == "Sort By Date") {
      // const convertStringDatesToDate = projects.map((obj) => {
      //   return { ...obj, dueDate: new Date(obj.dueDate) };
      // });

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

  const handleClickOnProject = (project, check, wid) => {
    setWidth(wid);
    if (check) {
      axios
        .get("/myProjects")
        .then((records) => {
          setProjects(records.data);
          setShowProjectInfo(true);
        })
        .catch((err) => console.log(err));
    } else {
      // console.log(project);
      // console.log(check);
      setProjects([project]);
      setShowProjectInfo(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/myProjects");
      // console.log(res.data);
      setProjects(res.data);
    };
    fetchData().catch(console.error);
  }, [newProject]);

  return (
    <div className="projectContainer">
      {showProjectInfo ? (
        <>
          <div className="project-header">
            <div className="search-container">
              <Form.Control
                type="search"
                placeholder="Search Projects"
                className="me-2"
                aria-label="Search"
                value={searchInput}
                onChange={handleSearchChange}
                style={{ boxShadow: "#da0d50 !important" }}
              />
            </div>
            <div className="project-button-container">
              <select className="selectFilter" onChange={handleFilterChange}>
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Incompleted">Incompleted</option>
                <option value="Not Assigned">Not Assigned</option>
                <option value="Sort By Priority">Sort By Priority</option>
                <option value="Sort By Date">Sort By Date</option>
              </select>
            </div>
            {role == "Employee" ? null : (
              <div className="create-project">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleShow}
                >
                  Create Project
                </Button>
              </div>
            )}
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
              if (
                role == "Employee" &&
                user._id == project.projectAssignedToId
              ) {
                return (
                  <ProjectCard
                    project={project}
                    setProjects={handleClickOnProject}
                    role={role}
                    userEmail={user.email}
                  />
                );
              } else if (role == "admin") {
                return (
                  <ProjectCard
                    project={project}
                    setProjects={handleClickOnProject}
                  />
                );
              } else if (!project.projectAssignedTo) {
                return (
                  <ProjectCard
                    project={project}
                    setProjects={handleClickOnProject}
                    volunteer={false}
                    handleVolunteerClick={handleVolunteerClick}
                  />
                );
              }
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
