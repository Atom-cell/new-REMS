import React from "react";
import { useLocation } from "react-router-dom";

const TeamInfo = () => {
  const {
    state: { project },
  } = useLocation();
  console.log(project);
  return (
    <div>
      <h1>{project.teamName}</h1>
      <h2>{project.teamDesp}</h2>
      {project.members.map((m) => {
        return <p>{m.username}</p>;
      })}
    </div>
  );
};

export default TeamInfo;
