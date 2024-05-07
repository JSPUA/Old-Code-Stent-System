import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux'; // Assuming you are using redux
import { useNavigate } from 'react-router-dom';
import Navbars from './Navbar';

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


function StentRecordsPage() {
  const [stentRecords, setStentRecords] = useState([]);
  const [removeRecords, setRemovedRecords] = useState([]);
  const [replaceRecords, setReplacedRecords] = useState([]);
const[userData, setUserData]=useState([]);
const [patientRoleData, setPatientRoleData] = useState(null);
  const { icNo, activeTab } = useSelector((state) => state.user);
const navigate =useNavigate();
//   useEffect(() => {
//     const fetchStentRecords = async () => {
//       try {
//         const stentResponse = await axios.get(`http://localhost:5555/stentRecords/${userData.mrnNo}`);
//         setStentRecords(stentResponse.data);

//         const removedResponse = await axios.get(`http://localhost:5555/removedStents/${userData.mrnNo}`);
//         setRemovedRecords(removedResponse.data);

//         const replaceResponse = await axios.get(`http://localhost:5555/replaceStents/${userData.mrnNo}`);
//         setReplacedRecords(replaceResponse.data);
//       } catch (error) {
//         console.error('Error fetching stent records:', error);
//       }
//     };

//     if (icNo) {
//       fetchStentRecords();
//     }
//   }, [icNo]);

useEffect(() => {
    const fetchStentRecords = async () => {
      // Check if userData and userData.mrnNo are available
      if (!userData || !userData.mrnNo) {
        console.log('userData or userData.mrnNo is not available');
        // Optionally, handle this case (e.g., show a message or redirect)
        return; // Exit the function early
      }
  
      try {
        const stentResponse = await axios.get(`http://localhost:5555/stentRecords/${userData.mrnNo}`);
        setStentRecords(stentResponse.data);
  
        const removedResponse = await axios.get(`http://localhost:5555/removedStents/${userData.mrnNo}`);
        setRemovedRecords(removedResponse.data);
  
        const replaceResponse = await axios.get(`http://localhost:5555/replaceStents/${userData.mrnNo}`);
        setReplacedRecords(replaceResponse.data);
      } catch (error) {
        console.error('Error fetching stent records:', error);
      }
    };
  
    fetchStentRecords();
  }, [userData]); 


  useEffect(() => {
    // Fetch additional user data based on the stored token or user information
    const fetchUserData = async () => {
      try {
       
        
        // You should ideally send the authentication token with the request
        // For simplicity, assuming the server knows the user based on the token
        let endpoint = '';
        if (activeTab === 'staff') {
          endpoint = `http://localhost:5555/getStaffByEmail/${icNo}`;
        } else if (activeTab === 'patient') {
          endpoint = `http://localhost:5555/getPatientByEmail/${icNo}`;
        } else {
          // Handle other cases or show an error
          console.error('Invalid user type:', activeTab);
          // Redirect to login or handle the error as needed
          navigate('/login');
          return;
        }
  
        const response = await axios.get(endpoint, {
          // headers: { Authorization: `Bearer ${yourAuthToken}` },
        });
  

        if (activeTab === 'staff') {
          setUserData(response.data.staff); // Change from 'user' to 'patient' based on your server response
          const roleResponse = await axios.get(`http://localhost:5555/role/${response.data.staff.position}`);
          setRoleData(roleResponse.data);
       

          
        }
        else if(activeTab === 'patient'){
          setUserData(response.data.patient);
          const patientRoleResponse = await axios.get(`http://localhost:5555/role/patient`);
          setPatientRoleData(patientRoleResponse.data);
          
        }
        
        else {
          // Handle other cases or show an error
          console.error('Invalid user type:', activeTab);
          // Redirect to login or handle the error as needed
          navigate('/login');
          return;
        }
       // Default image


        
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error (e.g., redirect to login)
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate, icNo]); 


  // Render your tables here
  return (
    <div>
        <Navbars/>

        <div style={{ backgroundImage: "linear-gradient(#f0f0f0,#f0f0f0,#f0f0f0)", height: "100%"  }} className="d-flex flex-column justify-content-center align-items-center ">
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
       
        <div><div>
      <h5>Stent Insertion Records</h5>
      <Table striped bordered hover responsive >
        <thead>
          <tr>
           <th>No</th>
            <th>Case ID</th>
            <th>Hospital Name</th>
            <th>Laterality</th>
            <th>Inserted Date</th>
            <th>Duration</th>
            {/* Add more headers based on the data */}
          </tr>
        </thead>
        <tbody>
        {stentRecords.map((record, index) => {
      // Sort stentData by insertedDate in descending order
     
      return (
        <tr key={record._id}>
          <td>{index + 1}</td>
          <td>{record.stentData.map(stent => stent.caseId).join(', ')}</td>
          <td>{record.stentData.map(stent => stent.hospitalName).join(', ')}</td>
          <td>{record.stentData.map(stent => stent.laterality).join(', ')}</td>
          <td>{record.stentData.map(stent => formatDate(stent.insertedDate)).join(', ')}</td>
          <td>{record.stentData.map(stent => stent.dueDate).join(', ')}</td>
          {/* Add more data cells based on the data */}
        </tr>
      );
    })}
        </tbody>
      </Table>
    </div></div>

    
    </Container>
    
    </div>
    <br></br>
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
      <div> <div>
      <h5>Remove Stent Records</h5>
      <Table striped bordered hover responsive >
        <thead>
          <tr>
           <th>No</th>
            <th>Case ID</th>
            <th>Hospital Name</th>
            <th>Laterality</th>
            <th>Remove by</th>
            <th>Removal Date</th>
            {/* Add more headers based on the data */}
          </tr>
        </thead>
        <tbody>
        {removeRecords.map((record, index) => {
      // Sort stentData by insertedDate in descending order
     
      return (
        <tr key={record._id}>
          <td>{index + 1}</td>
          <td>{record.caseId}</td>
          <td>{record.removalLocation}</td>
          <td>{record.laterality}</td>
          <td>{record.removedBy}</td>
          
          <td>{formatDate(record.timestamp)}</td>
          {/* Add more data cells based on the data */}
        </tr>
      );
    })}
        </tbody>
      </Table>
    </div></div>
    </Container>
    </div>
    <br></br>
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
      <div> <div>
      <h5>Replace Stent Records</h5>
      <Table striped bordered hover responsive >
        <thead>
          <tr>
           <th>No</th>
            <th>Old Case ID</th>
            {/* <th>New Case ID</th> */}
            <th>Hospital Name</th>
            <th>Laterality</th>
            <th>Remove by</th>
            <th>Removal Date</th>
            {/* Add more headers based on the data */}
          </tr>
        </thead>
        <tbody>
        {replaceRecords.map((record, index) => {
      // Sort stentData by insertedDate in descending order
     
      return (
        <tr key={record._id}>
          <td>{index + 1}</td>
          <td>{record.removedStent.caseId}</td>
          {/* <td>{record.newStent.caseId}</td> */}
          <td>{record.removedStent.removalLocation}</td>
          <td>{record.removedStent.laterality}</td>
          <td>{record.removedStent.removedBy}</td>
          
          
          <td>{formatDate(record.timestamp)}</td>
          {/* Add more data cells based on the data */}
        </tr>
      );
    })}
        </tbody>
      </Table>
    </div></div>  
    </Container> 
    </div>
    <br></br>
    <br></br>
    </div>
    </div>
  );
}

export default StentRecordsPage;
