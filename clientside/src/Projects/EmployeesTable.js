import React from "react";
import Table from "react-bootstrap/Table";
const EmployeesTable = ({
  employees,
  fetchData,
  newProject,
  setNewProject,
  handleClosee,
  newConversation,
  assignTask,
}) => {
  const handleSelect = (emp) => {
    if (setNewProject !== undefined) {
      setNewProject({
        ...newProject,
        assignTo: emp.username,
        assignToId: emp._id,
      });
    } else if (assignTask !== undefined) {
      assignTask(emp);
    } else {
      newConversation(emp._id);
      fetchData();
    }
    // console.log(newProject);
    handleClosee();
  };
  return (
    <div className="chatBoxTop" style={{ height: "50vh", overflow: "scroll" }}>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => {
            return (
              <tr key={employee._id} onClick={() => handleSelect(employee)}>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeesTable;
