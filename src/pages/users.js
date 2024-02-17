import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Card, Container, Row, Col, Button, Modal, Image } from 'react-bootstrap';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userTodos, setUserTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <Navbar />
      <Container>
        <Row>
          {users.map((user) => (
            <Col key={user.id} xs={12} sm={6} md={4} style={{ marginBottom: '20px' }}>
              <Card
                style={{
                  border: `2px solid #0F6BAE`,
                  backgroundColor: 'black',
                  color: 'white',
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
                  <Card.Title style={{ color: '#83B8FF', marginBottom: '10px' }}>{user.name}</Card.Title>
                  <Card.Text style={{ color: '#C6CDFF', marginBottom: '10px' }}>{user.email}</Card.Text>
                  <Card.Text style={{ color: '#C6CDFF', marginBottom: '20px' }}>{user.username}</Card.Text>
                  <Button
                    onClick={() => fetchUserTodos(user.id)}
                    variant="outline-light"
                    style={{
                      border: '2px solid #0F6BAE',
                      transition: 'background-color 0.3s',
                      color: 'white',
                    }}
                    className="todos-button"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0F6BAE';
                      e.target.style.color = 'white'; 
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'white';
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
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#0F6BAE' }}>Todos</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'black', color: 'white' }}>
          <ul>
            {userTodos.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal} style={{ borderColor: '#0F6BAE' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;