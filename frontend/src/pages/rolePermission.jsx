import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Navbar, Nav,Image,Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbars from './Navbar';
function RolePermissions() {
    const [roles, setRoles] = useState([]);
    const [selectedRoleName, setSelectedRoleName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const allPermissions = ['addPatient', 'viewPatient', 'editPatient', 'deletePatient', 'addStent', 'viewResearch', 'addResearch','contactDR','myStentRecord','setRole','viewDailyReport','viewSpecificTimeReport','viewFurtherReport','addUser','viewUser','updateUser','deleteUser','myPatient','chatbot'];
    const [selectedHospital, setSelectedHospital] = useState('Hospital A');
    const hospitals = ['Hospital A', 'Hospital B', 'Hospital C']; // Add your list of hospitals
  
    const handleHospitalChange = (event) => {
      setSelectedHospital(event.target.value);
      // Add logic to handle hospital change, such as fetching data for the selected hospital
    };
    useEffect(() => {
        axios.get('http://localhost:5555/role')
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => console.error('Error fetching roles:', error));
    }, []);

    useEffect(() => {
        const selectedRole = roles.find(role => role.name === selectedRoleName);
        setPermissions(selectedRole ? selectedRole.permissions : []);
    }, [selectedRoleName, roles]);

    const handleRoleChange = (event) => {
        setSelectedRoleName(event.target.value);
    };

    const togglePermission = (permission) => {
        setPermissions(prevPermissions =>
            prevPermissions.includes(permission)
                ? prevPermissions.filter(p => p !== permission)
                : [...prevPermissions, permission]
        );
    };

    const updateRolePermissions = () => {
        axios.put('http://localhost:5555/role', {
            name: selectedRoleName,
            permissions: permissions
        })
            .then(response => {
                console.log('Permissions updated:', response.data);
                setShowModal(true);
            })
            .catch(error => console.error('Error updating permissions:', error));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        window.location.reload(); // Refresh the page
    };

    const isPermissionInRole = (permission) => permissions.includes(permission);

    return (
        <div>
           
           <Navbars/>
           <div style={{ backgroundImage: "linear-gradient(#dfe3ee,#dfe3ee)", height: "100%"  }} className="d-flex flex-column justify-content-center align-items-center  ">
<div style={{
  backgroundImage: "#00d5ff"
}}>
 <br></br>
 <br></br>
</div>
      <div  style={{
        background: '#fff',
         // Add padding as needed
         width: '90%',
         height: 'auto',
         // Add overflow property to make it scrollable if content exceeds the height
         borderRadius: '10px',
       
        
      }}>  
      <Container> 
        <br></br>
            <h1 >Role and Permissions</h1>
            <div >
                <Form.Group controlId="roleSelect">
                    <br></br>
                    <Form.Label>Select a role:</Form.Label>
                    <Form.Control as="select" value={selectedRoleName} onChange={handleRoleChange}>
                        <option value="">Select a role</option>
                        {roles.map(role => (
                            <option key={role.name} value={role.name}>{role.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </div>
            <br></br>
            <div>
                <h2>Permissions:</h2>
                <div>
                    {allPermissions.map((permission, index) => (
                        <Button
                            key={index}
                            variant={isPermissionInRole(permission) ? 'primary' : 'secondary'}
                            className="m-1"
                            onClick={() => togglePermission(permission)}
                        >
                            {permission}
                        </Button>
                    ))}
                </div>
                <div className="d-flex justify-content-end ml-auto">
                <Button className="m-1 mt-3" variant="success" onClick={updateRolePermissions}>
                    Update Permissions
                </Button>
</div>
            </div>

            {/* Success Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>Permissions have been updated successfully.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            </Container>    
            <br></br>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        </div>
        </div>
    );
}

export default RolePermissions;
