// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For password toggle
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [show, setShow] = useState(false); // Modal visibility
  const [editEmployee, setEditEmployee] = useState(null); // For editing
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    surname: "",
    jobTitle: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5220/api/admin/employees"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching employees");
    }
  };

  // Handle Add or Edit Employee
  const handleSave = async () => {
    try {
      if (editEmployee) {
        // Update Employee
        await axios.put(
          `http://localhost:5220/api/admin/update-employee/${editEmployee.employeeId}`,
          newEmployee
        );
        toast.success("Employee updated successfully!");
      } else {
        // Add Employee
        await axios.post(
          "http://localhost:5220/api/admin/create-employee/",
          newEmployee
        );
        toast.success("Employee added successfully!");
      }
      fetchEmployees();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving employee");
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5220/api/admin/delete-employee/${id}`
      );
      toast.success("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting employee");
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setNewEmployee({
      name: employee.name,
      surname: employee.surname,
      jobTitle: employee.jobTitle,
      email: employee.email,
      password: "",
    });
    setShow(true);
  };
  const handleClose = () => {
    setEditEmployee(null);
    setNewEmployee({
      name: "",
      surname: "",
      jobTitle: "",
      email: "",
      password: "",
    });
    setShow(false);
  };

  // Logout function
  const handleLogout = () => {
    navigate("/"); // Redirect to login page
    toast.success("Logged out successfully");
  };

  return (
    <div className="container mt-5">
      <h2 className="heading">Admin Dashboard</h2>
      <Button variant="danger" className="mb-3" onClick={handleLogout}>
        Logout
      </Button>

      <Button variant="primary" className="mb-3" onClick={() => setShow(true)}>
        Add New Employee
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Job Title</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.employeeId}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.surname}</td>
              <td>{employee.jobTitle}</td>
              <td>{employee.email}</td>
              <td>
                <Button
                  variant="warning"
                  className="btnedit"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(employee.employeeId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editEmployee ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter surname"
                value={newEmployee.surname}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, surname: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                as="select"
                value={newEmployee.jobTitle}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, jobTitle: e.target.value })
                }
                required
              >
                <option value="">Select Job Title</option>
                {/* We do not need an Admin selection since there is only one admin */}
                <option value="Project Manager">Project Manager</option>
                <option value="System Analyst">System Analyst</option>
                <option value="Web Developer">Web Developer</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="position-relative">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "75%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
