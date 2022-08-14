import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import "./allProjects.css";
import ProjectCard from "./ProjectCard";
import NewProjectModal from "./NewProjectModal";
import Form from "react-bootstrap/Form";
import axios from "axios";
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
const AllProjects = () => {
  const [projects, setProjects] = useState();
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectDescription: "",
    assignTo: "",
    assignToId: "",
    // milestones: [
    //   {
    //     completionPercentage: "",
    //     dueDate: "",
    //   },
    // ],
    // endDate: "",
  });

  const [searchInput, setSearchInput] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);

    axios
      .get(`/myprojects/${e.target.value}`)
      .then((records) => {
        console.log(records.data);
        setProjects(records.data);
      })
      .catch((err) => console.log(err));

    // if (searchInput?.length > 0) {
    //   var searchedProjects = projects.filter((obj) => {
    //     return obj.projectName.toLowerCase().match(searchInput);
    //   });
    //   console.log(searchedProjects);
    //   setProjects(searchedProjects);
    // }
  };

  const filterProjects = (category) => {
    if (category == "All") {
      //   setProjects(getProjects);
      axios
        .get("/myProjects")
        .then((records) => {
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
          setProjects(records.data);
        })
        .catch((err) => console.log(err));
      return;
    }
    // const newFilterProjects = projects.filter(
    //   (project) => project.completed == category
    // );
    // setProjects(newFilterProjects);
  };

  const filterProjectsDate = () => {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/myProjects");
      console.log(res.data);
      setProjects(res.data);
    };
    fetchData().catch(console.error);
  }, [newProject]);

  return (
    <div className="projectContainer">
      <div className="project-header">
        <div className="search-container">
          {/* <input
            type="text"
            placeholder="Search Project"
            value={searchInput}
            onChange={handleSearchChange}
          /> */}
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
          <Button
            variant="contained"
            color="secondary"
            onClick={() => filterProjects("All")}
          >
            All
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => filterProjects("Completed")}
          >
            Completed
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => filterProjects("Incompleted")}
          >
            InCompleted
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={filterProjectsDate}
          >
            Sort By Due Date
          </Button>
        </div>
        <div className="create-project">
          <Button variant="contained" color="secondary" onClick={handleShow}>
            Create Project
          </Button>
        </div>
      </div>
      <div className="allProjects">
        {projects?.map((project) => {
          return <ProjectCard project={project} />;
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
    </div>
  );
};

export default AllProjects;
