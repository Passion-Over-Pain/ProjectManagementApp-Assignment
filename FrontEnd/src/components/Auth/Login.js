// src/Login.js
import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5220/api/auth/login",
        {
          email,
          password,
        }
      );
      const { employeeId } = response.data;
      localStorage.setItem("employeeId", employeeId);
      toast.success("Login successful!");
      if (email == "s224145312@mandela.ac.za") {
        navigate("/admin/dashboard");
      } else if (email == "s227284240@mandela.ac.za") {
        navigate("/task-manager/dashboard");
      } else {
        navigate("/project-manager/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <Container className="login-container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          {/* To be Moved Eventually */}
          <h1>Information Technology Project Management System</h1>{" "}
          <h2 className="text-center">
            Login
          </h2>
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group
              controlId="formPassword"
              className="mt-3 position-relative"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "38px",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
