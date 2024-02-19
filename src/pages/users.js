import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Card, Container, Row, Col, Button, Modal, Image } from 'react-bootstrap';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userTodos, setUserTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const savedDarkMode = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null;
    setDarkMode(savedDarkMode ? JSON.parse(savedDarkMode) : false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  const fetchUserTodos = async (userId) => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
      setUserTodos(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(`Error fetching todos for user ${userId}:`, error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserTodos([]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Container style={{ marginTop: '20px' }}>
        <Row>
          {users.map((user) => (
            <Col key={user.id} xs={12} sm={6} md={4} style={{ marginBottom: '20px' }}>
              <Card
                style={{
                  border: `2px solid ${darkMode ? '#ffffff' : '#0F6BAE'}`,
                  backgroundColor: darkMode ? '#333' : 'white',
                  color: darkMode ? '#ffffff' : 'black',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                className="user-card"
              >
                <Image
                  src={`https://i.pravatar.cc/150?u=${user.id}`}
                  alt={user.name}
                  roundedCircle
                  fluid
                  style={{ width: '100px', height: '100px', margin: '0 auto' }}
                />
                <Card.Body>
                  <Card.Title style={{ color: darkMode ? '#ffffff' : '#0F6BAE', marginBottom: '10px' }}>{user.name}</Card.Title>
                  <Card.Text style={{ color: darkMode ? '#ffffff' : '#333', marginBottom: '10px' }}>{user.email}</Card.Text>
                  <Card.Text style={{ color: darkMode ? '#ffffff' : '#333', marginBottom: '20px' }}>{user.username}</Card.Text>
                  <Button
                    onClick={() => fetchUserTodos(user.id)}
                    variant={darkMode ? 'outline-light' : 'outline-dark'}
                    style={{
                      border: `2px solid ${darkMode ? '#ffffff' : '#0F6BAE'}`,
                      transition: 'background-color 0.3s',
                      color: darkMode ? '#ffffff' : 'black',
                    }}
                    className="todos-button"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = darkMode ? '#0F6BAE' : '#ffffff';
                      e.target.style.color = darkMode ? 'white' : 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = darkMode ? '#ffffff' : 'black';
                    }}
                  >
                    View Todos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton style={{ backgroundColor: darkMode ? '#333' : 'white', borderBottom: `1px solid ${darkMode ? '#555' : '#ddd'}` }}>
          <Modal.Title style={{ color: darkMode ? '#ffffff' : '#0F6BAE' }}>Todos</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: darkMode ? '#333' : 'white', color: darkMode ? '#ffffff' : 'black' }}>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {userTodos.map((todo) => (
              <li key={todo.id} style={{ marginBottom: '8px', color: darkMode ? '#ffffff' : '#333' }}>{todo.title}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: darkMode ? '#333' : 'white', borderTop: `1px solid ${darkMode ? '#555' : '#ddd'}` }}>
        <Button variant="primary" onClick={handleCloseModal} style={{ borderColor: '#007BFF', color: 'white' }}>
          Close
        </Button>
        </Modal.Footer>
            </Modal>
          </div>
  );
};

export default Users;
