import React from "react";
import Table from "react-bootstrap/Table";
const EmployeesTable = ({
  employees,
  newProject,
  setNewProject,
  handleClosee,
}) => {
  const handleSelect = (emp) => {
    setNewProject({
      ...newProject,
      assignTo: emp.username,
      assignToId: emp._id,
    });
    // console.log(newProject);
    handleClosee();
  };
  return (
    <div style={{ height: "50vh", overflow: "scroll" }}>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
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
