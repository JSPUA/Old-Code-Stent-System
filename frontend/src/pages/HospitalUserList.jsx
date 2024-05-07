import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Table, Button, Form, InputGroup, Modal, Badge,Navbar, Nav, NavDropdown,Image  } from 'react-bootstrap';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';
import { MdOutlineDelete, MdOutlineEdit, MdOutlineInfo, MdOutlineSearch, MdOutlineEmail } from 'react-icons/md';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../pages/userAction.js';

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

function HospitalUserList() {
  const [users, setUsers] = useState([]); // Updated variable name to "users"
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Updated variable name to "userToDelete"
  const [lastMrnNo, setLastMrnNo] = useState(0);
  const location =useLocation();
    const navigate = useNavigate();
    const { icNo, activeTab } = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const hospitalName = "UPM";
  const [hospitalNames, setHospitalNames] = useState([]);
const [selectedHospital, setSelectedHospital] = useState('All Hospitals');
const [patientRoleData, setPatientRoleData] = useState(null);

const isPermissionInRole = (permission) => {
  return roleData ? roleData.permissions.includes(permission) : (patientRoleData && patientRoleData.permissions.includes(permission));
};

const handleProfileClick = () => {
  // Assuming you want to navigate to the '/profile' route
  if(activeTab === 'staff'){
    navigate('/profileInfo', { state: { icNo: userData.icNo, role: roleData.name,activeTab: activeTab  } });
  }
  else if(activeTab === 'patient'){
    navigate('/profileInfo', { state: { icNo: userData.icNo, role: "patient" ,activeTab: activeTab} });
  }
 
}; 

const handleLogout = async () => {
  try {
    const response = await axios.post('http://localhost:5555/logout');
    if (response.data.success) {
      console.log("Logout");
      // Redirect to the login page or perform any other necessary actions
      navigate('/login');
    } else {
      console.error('Logout failed:', response.data.message);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};


useEffect(() => {
  const fetchHospitalNames = async () => {
    try {
      const response = await fetch('http://localhost:5555/hospitals');
      const data = await response.json();
      setHospitalNames(data.hospitals);
    } catch (error) {
      console.error('Error fetching hospital names:', error);
    }
  };

  fetchHospitalNames();
 
}, []);

const handleHospitalSelect = async (hospital) => {
   
  setSelectedHospital(hospital);

 
};

useEffect(() => {
  // Fetch additional user data based on the stored token or user information
  const fetchUserData = async () => {
    try {
      console.log(icNo);
      console.log(activeTab);
      
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

  // useEffect(() => {

  //   if (!hospitalName) {
  //     // Handle the case where hospitalName is not available
  //     console.error('Hospital name not found in location state.');
  //     return;
  //   }
  //   // Fetch user data when the component mounts
  //   axios
  //     .get(`http://localhost:5555/users/${hospitalName}`) // Updated endpoint to fetch users based on hospitalName
  //     .then((response) => {
  //       setUsers(response.data.users);
  //       const lastUser = response.data.users.reduce((prev, current) => {
  //         return prev.mrnNo > current.mrnNo ? prev : current;
  //       }, {});

  //       setLastMrnNo(lastUser.mrnNo);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching user data:', error);
  //     });
  // }, [hospitalName]);

  // useEffect(() => {
  //   // Function to fetch users
  //   const fetchUsers = async () => {
  //     try {
  //       // Determine the hospital name to use based on the user's position
  //       let hospitalNameToUse = selectedHospital;
  //       if (userData && userData.position === 'admin') {
  //         hospitalNameToUse = userData.hospitalName;
  //       }
  
  //       // Update the endpoint based on the selected hospital
  //       const endpoint = hospitalNameToUse === 'All Hospitals' ? 'http://localhost:5555/users' : `http://localhost:5555/users/${hospitalNameToUse}`;
        
  //       const response = await axios.get(endpoint);
  //       setUsers(response.data.users);
  
  //       // Find the last MRN number
  //       // const lastUser = response.data.users.reduce((prev, current) => {
  //       //   return (prev.mrnNo || 0) > (current.mrnNo || 0) ? prev : current;
  //       // }, {});
        
  //       // setLastMrnNo(lastUser.mrnNo || 0);
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };
  
  //   fetchUsers();
  // }, [selectedHospital, userData]); // Depend on selectedHospital and userData for re-fetching when they change
  

  //for all
  useEffect(() => {
    // Function to fetch users
    const fetchUsers = async () => {
      try {
        // Determine the hospital name to use based on the user's position
        let hospitalNameToUse = selectedHospital;
        console.log(hospitalNameToUse);
        if (userData && userData.position === 'admin') {
          hospitalNameToUse = userData.hospitalName;
        }
  
        // Update the endpoint based on the selected hospital
        const endpoint = hospitalNameToUse === 'All Hospitals' ? 'http://localhost:5555/users' : `http://localhost:5555/users/${hospitalNameToUse}`;
        
        const response = await axios.get(endpoint);
        console.log('Fetching from endpoint:', endpoint);
        setUsers(response.data.users);
  
       
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUsers();
  }, [selectedHospital, userData]);

  // useEffect(() => {
  //   // Function to fetch users
  //   const fetchUsers = async () => {
  //     try {
  //       // Always use the endpoint for fetching all users
  //       const endpoint = `http://localhost:5555/users/${hospitalNameToUse}`;
        
  //       const response = await axios.get(endpoint);
  //       console.log('Fetching from endpoint:', endpoint); // Optional: for debugging
  //       setUsers(response.data.users); // Update the state with the fetched users
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };
  
  //   fetchUsers();
  // }, []);


  // const filteredUsers = users && users.length > 0 ? users.filter((user) => {
  //   const mrnNo = user.mrnNo || '';
  //   const fullName = `${user.firstName || ''} ${user.surname || ''}`;
  //   const dob = formatDate(user.dob) || '';
  //   const icNo = user.icNo ? user.icNo.toString() : '';
  //   const gender = user.gender || '';
  //   const mobileNo = user.mobileNo ? user.mobileNo.toString() : '';
  //   const email = user.email || '';
  
  //   return (
  //     mrnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     dob.includes(searchTerm) ||
  //     icNo.includes(searchTerm) ||
  //     gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     mobileNo.includes(searchTerm) ||
  //     email.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }) : [];

  const filteredUsers = users && users.length > 0 ? users.filter((user) => {
    // Additional check for hospital name, if it's relevant
    const isHospitalMatch = selectedHospital === 'All Hospitals' || user.hospitalName === selectedHospital;
    
    const mrnNo = user.mrnNo || '';
    const fullName = `${user.firstName || ''} ${user.surname || ''}`;
    const dob = formatDate(user.dob) || '';
    const icNo = user.icNo ? user.icNo.toString() : '';
    const gender = user.gender || '';
    const mobileNo = user.mobileNo ? user.mobileNo.toString() : '';
    const email = user.email || '';
    
    return isHospitalMatch && (
      mrnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dob.includes(searchTerm) ||
      icNo.includes(searchTerm) ||
      gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mobileNo.includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Implement your delete logic here
    axios
      .delete(`http://localhost:5555/user/${userToDelete._id}`) // Updated endpoint to delete users
      .then(() => {
        setShowSuccessModal(true);
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userToDelete._id));
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const generateNextMrnNo = () => {
    // Increment the last mrnNo
    setLastMrnNo((prevMrnNo) => prevMrnNo + 1);
    return lastMrnNo + 1;
  };

  

  return (
    <div>
      <div><div>
{userData ? (
        <>
       { (activeTab==="patient")||userData.position==="admin"||userData.position==="doctor" ?(
       <>
        <Navbar bg="light"  expand="lg" >
       <Navbar.Brand>
  <Link to="/mainPage">
    <Image src="./logo.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} />
  </Link>
</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                   
   
                         {/* Patients Dropdown */}
                         {(isPermissionInRole('addPatient') || isPermissionInRole('viewPatient') || isPermissionInRole('editPatient') || isPermissionInRole('deletePatient')) && (                  
      <NavDropdown title="Patients" id="nav-patients-dropdown">
      {isPermissionInRole('viewPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/showPatient",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Patients
    </Link>
  </NavDropdown.Item>
)}
      {isPermissionInRole('addPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/addPatient",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Patients
    </Link>
  </NavDropdown.Item>
)}
       
      
      </NavDropdown>
                         )}
{(isPermissionInRole('myPatient')) && (
  <NavDropdown title="My Patients" id="nav-patients-dropdown">
    {isPermissionInRole('myPatient') && (
      <NavDropdown.Item as="div">
        <button onClick={handleShowMyPatientList} style={{ textDecoration: 'none', color: 'inherit', background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', outline: 'inherit' }}>
          My Patients
        </button>
      </NavDropdown.Item>
    )}
  </NavDropdown>
)} 
{(isPermissionInRole('viewUser') || isPermissionInRole('addUser') || isPermissionInRole('updateUser') || isPermissionInRole('deleteUser') ) && ( 
      <NavDropdown title="User" id="nav-research-dropdown">
        {isPermissionInRole('viewUser') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/user-list",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View User
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('addUser') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/upload",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
     Add User
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

      {/* Research Dropdown */}
 {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Research" id="nav-research-dropdown">
        {isPermissionInRole('viewResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/researchList",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Research
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('addResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/uploadPDF",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Research
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

   
      
     
      {isPermissionInRole('contactDR') && <Nav.Link href="#">Contact DR</Nav.Link>}
     
                      
          {(isPermissionInRole('setRole') ) && (                  
      <NavDropdown title="Role And Permission" id="nav-patients-dropdown">
      {isPermissionInRole('setRole') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/rolePermission",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Role and Permission Setting
    </Link>
  </NavDropdown.Item>
)}
      
      </NavDropdown>
                         )}
 {(isPermissionInRole('viewDailyReport') || isPermissionInRole('viewSpecificTimeReport')|| isPermissionInRole('viewFurtherReport') ) && ( 
      <NavDropdown title="Reports" id="nav-research-dropdown">
        {isPermissionInRole('viewDailyReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/dailyCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Daily Report
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('viewSpecificTimeReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/specificDateCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position,hospitalName: userData.hospitalName}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Specific Time Range Report
    </Link>
  </NavDropdown.Item>
)}
  {isPermissionInRole('viewFurtherReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/chart",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
    Insertion and Forgotten Report
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}


               
                    </Nav>
                    
                </Navbar.Collapse>
                
       <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
      <Nav>
        <NavDropdown
          title={
            <img
            src={`/images/${(activeTab === 'staff' ? userData.image : userData.profilePic) || 'DefaultProfilePic.jpg'}`}
            
            alt='Profile Image'
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              border: '2px solid #fff',
            }}
          />
          }
          id="collasible-nav-dropdown"
          className="responsive-navbar-nav .nav-dropdown" // Add a custom class for styling
        >
          <NavDropdown.Item onClick={handleProfileClick} >Your Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
        
      </Nav>
      <Nav>
  ROLE: {
    userData.position === 'doctor' ? 'Doctor' :
    userData.position === 'admin' ? 'Admin' :
    userData.position === 'superAdmin' ? 'Super Admin' :
    'Patient'
  }
</Nav>
    </Navbar.Collapse>
            </Navbar>
       </>
       ): userData.position==="superAdmin"?(
       <>
       <Navbar bg="light"  expand="lg" >
       <Navbar.Brand>
  <Link to="/mainPage">
    <Image src="./logo.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} />
  </Link>
</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                   

                         {/* Patients Dropdown */}
                         {(isPermissionInRole('addPatient') || isPermissionInRole('viewPatient') || isPermissionInRole('editPatient') || isPermissionInRole('deletePatient')) && (                  
      <NavDropdown title="Patients" id="nav-patients-dropdown">
      {isPermissionInRole('addPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/addPatient",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Patients
    </Link>
  </NavDropdown.Item>
)}
       {isPermissionInRole('viewPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/showPatient",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Patients
    </Link>
  </NavDropdown.Item>
)}
        {isPermissionInRole('editPatient') && <NavDropdown.Item href="#">Edit Patients</NavDropdown.Item>}
        {isPermissionInRole('deletePatient') && <NavDropdown.Item href="#">Delete Patients</NavDropdown.Item>}
      </NavDropdown>
                         )}

{(isPermissionInRole('viewUser') || isPermissionInRole('addUser') || isPermissionInRole('updateUser') || isPermissionInRole('deleteUser') ) && ( 
      <NavDropdown title="User" id="nav-research-dropdown">
        {isPermissionInRole('viewUser') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/user-list",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View User
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('addUser') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/upload",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
     Add User
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

      {/* Research Dropdown */}
 {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Research" id="nav-research-dropdown">
        {isPermissionInRole('viewResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/researchList",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Research
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('addResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/uploadPDF",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Research
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

      {/* Stents Dropdown */}
      {/* {(isPermissionInRole('addStent')  ) && ( 
      <NavDropdown title="Stents" id="nav-stents-dropdown">
          {isPermissionInRole('addStent') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Research
    </Link>
  </NavDropdown.Item>
)}
        {isPermissionInRole('addStent') && <NavDropdown.Item href="#">Add Stent</NavDropdown.Item>}
        {isPermissionInRole('myStentRecord') && <NavDropdown.Item href="#">My Stent Record</NavDropdown.Item>}
      </NavDropdown>
      )} */}
      
      {/* Additional Links */}
      {isPermissionInRole('contactDR') && <Nav.Link href="#">Contact DR</Nav.Link>}
      {/* Add other navigation links as needed */}
                        {/* Add other navigation links based on permissions */}
                      
          {(isPermissionInRole('setRole') ) && (                  
      <NavDropdown title="Role And Permission" id="nav-patients-dropdown">
      {isPermissionInRole('setRole') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/rolePermission",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Role and Permission Setting
    </Link>
  </NavDropdown.Item>
)}
      
      </NavDropdown>
                         )}
 {(isPermissionInRole('viewDailyReport') || isPermissionInRole('viewSpecificTimeReport')|| isPermissionInRole('viewFurtherReport') ) && ( 
      <NavDropdown title="Reports" id="nav-research-dropdown">
        {isPermissionInRole('viewDailyReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/dailyCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Daily Report
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('viewSpecificTimeReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/specificDateCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position,hospitalName: userData.hospitalName}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Specific Time Range Report
    </Link>
  </NavDropdown.Item>
)}
  {isPermissionInRole('viewSpecificTimeReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/chart",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
    Insertion and Forgotten Report
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

<NavDropdown title={selectedHospital || 'Select Hospital'} id="basic-nav-dropdown">
  <NavDropdown.Item key="all-hospitals" onClick={() => handleHospitalSelect('All Hospitals')}>
    All Hospitals
  </NavDropdown.Item>
  {hospitalNames.map((hospital, index) => (
    <NavDropdown.Item key={index} onClick={() => handleHospitalSelect(hospital)}>
      {hospital}
    </NavDropdown.Item>
  ))}
</NavDropdown>                   
                    </Nav>
                    
                </Navbar.Collapse>
                
       <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
      <Nav>
        <NavDropdown
          title={
            <img
            src={`/images/${(activeTab === 'staff' ? userData.image : userData.profilePic) || 'DefaultProfilePic.jpg'}`}
            
            alt='Profile Image'
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              border: '2px solid #fff',
            }}
          />
          }
          id="collasible-nav-dropdown"
          className="responsive-navbar-nav .nav-dropdown" // Add a custom class for styling
        >
          <NavDropdown.Item onClick={handleProfileClick} >Your Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
        
      </Nav>
      <Nav>
  ROLE: {
    userData.position === 'doctor' ? 'Doctor' :
    userData.position === 'admin' ? 'Admin' :
    userData.position === 'superAdmin' ? 'Super Admin' :
    'Patient'
  }
</Nav>
    </Navbar.Collapse>
            </Navbar>
       </>):
       (<>
       </>)
       }
      
            </>):(<p>Error</p>)}

          
</div></div>
<div style={{ backgroundImage: "linear-gradient(#dfe3ee,#dfe3ee,#dfe3ee)", height: "100%"  }} className="d-flex flex-column justify-content-center align-items-center text-center ">
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
        <Row className="mt-3 mb-3">
          <Col md={7}>
            
          
            <h1>{userData && userData.position === 'admin' ? userData.hospitalName : selectedHospital} USER LIST</h1>
         



          </Col>
          <Col md={5} className="d-flex justify-content-end">
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by criteria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroup.Text>
                <BsSearch />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>No</th>
                  <th>MMC No</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>IC No</th>
                  <th>Gender</th>
                  <th>Mobile No</th>
                  <th>Department</th>
                  <th>Position</th>
<th>Operations</th>

                  {/* Add additional table headers based on your user data */}
                  {/* <th>No of Stent</th>
                    <th>Operation</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.mmcRegistrationNo}</td>
                    <td>{`${user.firstName} ${user.surname}`}</td>
                    <td>{formatDate(user.dob)}</td>
                    <td>{user.icNo}</td>
                    <td>{user.gender}</td>
                    <td>{user.mobileNo}</td>
                    <td>{user.department}</td>
                    <td>{user.position}</td>
                    
                    <td className="text-center">
                  
                  
                <Link key={user._id} to={`/user/details/${user._id}`}>
                    <Button variant="light" className="transparent-button" >
                      <MdOutlineSearch className="blue-icon icon-large" />
                    </Button>
                    </Link>
                    
                  <Button
                    variant="light"
                    className="transparent-button"
                    onClick={() => handleEditClick(patient)}
                  >
                   
                  </Button>
                  <Link key={user._id} to={`/updateUser/${user._id}`}>
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
                    onClick={() => handleDeleteClick(user)}
                  >
                    <MdOutlineDelete className="red-icon icon-large" />
                  </Button>
                </td>
                    {/* Add additional table data based on your user data */}
                    {/* <td>{user.stentData.length}</td>
                        <td className="text-center">
                          <Link to={`/showStent/${user._id}`}>
                            <Button variant='primary'> Show Stent</Button>
                          </Link>
                          <Link to={`/showUserByID/${user._id}`}>
                            <Button variant="light" className="transparent-button">
                              <MdOutlineSearch className="blue-icon icon-large" />
                            </Button>
                          </Link>
                          <Button
                            variant="light"
                            className="transparent-button"
                            onClick={() => handleEditClick(user)}
                          >
                            <MdOutlineEmail className="brown-icon icon-large" />
                          </Button>
                          <Link to={`/updateUserByID/${user._id}`}>
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
                            onClick={() => handleDeleteClick(user)}
                          >
                            <MdOutlineDelete className="red-icon icon-large" />
                          </Button>
                        </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {/* Add your buttons or other UI elements here */}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <p>Are you sure you want to delete {userToDelete.firstName} {userToDelete.surname}?</p>
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
          <p>User deleted successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>


      {/* {filteredUsers.map((user, index) => (
  <div key={index}>{`${user.firstName} ${user.surname}`}</div>
))} */}
{console.log(users)}
    </div>
    <br></br>
    </div>
    </div>
  );
}

export default HospitalUserList;