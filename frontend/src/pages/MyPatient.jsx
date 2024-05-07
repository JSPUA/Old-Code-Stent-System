import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table,Button,Modal,Container,Row,Col,InputGroup,Form } from 'react-bootstrap';
import Navbars from './Navbar';
import {useLocation,Link } from 'react-router-dom';
import { MdOutlineDelete, MdOutlineEdit, MdOutlineInfo, MdOutlineSearch, MdOutlineEmail } from 'react-icons/md';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';
function formatDate(isoDate) {
    if (!isoDate) {
      return '';
    }
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }


function DoctorPatientsTable() {
  const [patients, setPatients] = useState([]);
const location=useLocation();
//const hospitalName=location.state.hospitalName;
const doctorName=location.state?.doctorName;
const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  // ... other state and useEffect ...

  // Add a function to handle filter input changes
  const handleFilterChange = (e) => {
    setFilterQuery(e.target.value.toLowerCase());
  };

  // Filter patients based on query
  const filteredPatients = patients.filter((patient) => {
    return (
      patient.mrnNo.toLowerCase().includes(filterQuery) ||
      patient.firstName.toLowerCase().includes(filterQuery) ||
      patient.surname.toLowerCase().includes(filterQuery) ||
      patient.icNo.toLowerCase().includes(filterQuery)||
      patient.mobileNo.toLowerCase().includes(filterQuery)
     // patient.stentData.length.toLowerCase().includes(filterQuery)
      // Add more fields if necessary
    );
  });


  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/patients/doctor?doctor=${doctorName}`);
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients', error);
      }
    };

    fetchPatients();
  }, [doctorName]); // Depend on doctorName, re-fetch if it changes

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Implement your delete logic here
    axios
      .delete(`http://localhost:5555/deletePatient/${patientToDelete._id}`)
      .then(() => {
        setShowSuccessModal(true);
        setPatients((prevPatients) => prevPatients.filter((p) => p._id !== patientToDelete._id));
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error('Error deleting patient:', error);
      });
  };

  const handleCancelDelete = () => {
    setPatientToDelete(null);
    setShowDeleteModal(false);
  };


  return (
    <div>
        <Navbars/>
       
        <div style={{ backgroundImage: "linear-gradient(#dfe3ee,#dfe3ee,#dfe3ee)", height: "100%"  }} className="d-flex flex-column justify-content-center align-items-center ">
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
      <br></br> 
       
        <Container>
        
        {/* <input
          type="text"
          placeholder="Search Patients"
          value={filterQuery}
          onChange={handleFilterChange}
          style={{ margin: '10px 0', padding: '5px' }}
        />  */}

<Row className="mt-3 mb-3">
          <Col md={7}>
          <h5>My Patient List</h5> 
          </Col>
          <Col md={5} className="d-flex justify-content-end">
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by criteria..."
                value={filterQuery}
                onChange={handleFilterChange}
              />
              <InputGroup.Text>
                <BsSearch />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

    <Table striped bordered hover responsive>
      <thead>
        <tr>
        <th> No</th>
          <th>MRN No</th>
          <th>Name</th>
          <th>Date of Birth</th>
          <th>IC NO</th>
      <th>Gender</th>
      <th>Mobile NO</th>
      <th>No of stent(s)</th>
      <th>Opearations</th>
          {/* ... other table headers ... */}
        </tr>
      </thead>
      <tbody>
      {filteredPatients.map((patient, index) => (
    
<tr key={patient._id}>
<td>{index + 1}</td>
<td>{patient.mrnNo}</td>
<td>{patient.firstName}{patient.surname}</td>
        <td>{formatDate(patient.dob)}</td>
        <td>{patient.icNo}</td>
        <td>{patient.gender}</td>
        <td>{patient.mobileNo}</td>
        <td>{patient.stentData.length}</td>
        <td className="text-center">
                  
                  <Link  to={`/showStent/${patient._id}`}>
                  <Button variant='primary'> Show Stent</Button> 
                  </Link>
                  <Link  to={`/showPatientByID/${patient._id}`}>
                    <Button variant="light" className="transparent-button">
                      <MdOutlineSearch className="blue-icon icon-large" />
                    </Button>
                  </Link>
                  
                  <Link  to={`/updatePatientByID/${patient._id}`}>
                  <Button
                    variant="light"
                    className="transparent-button"
                    
                  >
                    <MdOutlineEdit className="black-icon icon-large" />
                  </Button>
                  </Link>
                  <Button
                    variant="light"
                    className="transparent-button"
                    onClick={() => handleDeleteClick(patient)}
                  >
                    <MdOutlineDelete className="red-icon icon-large" />
                  </Button>
                </td>
</tr>
))}
</tbody>
</Table>
</Container>
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
<Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {patientToDelete && (
            <p>Are you sure you want to delete {patientToDelete.firstName} {patientToDelete.surname}?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Patient deleted successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
</div>
);
}

export default DoctorPatientsTable;