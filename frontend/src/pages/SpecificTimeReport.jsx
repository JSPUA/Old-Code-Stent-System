import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme,VictoryTooltip, VictoryVoronoiContainer,VictoryLabel,VictoryBar } from 'victory';
import Navbars from './Navbar';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {Navbar, Nav, NavDropdown,Image,Form,Row,Col,Button, Container} from 'react-bootstrap';
import * as XLSX from 'xlsx';





function SpecificTimeReport() {
    const [hospitalName, setHospitalName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stentCounts, setStentCounts] = useState(null);
    const [stentStatusCounts, setStentStatusCounts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState({ newStentData: [], replacedStentData: [], removedStentData:[] });
    const [chartStatusData, setChartStatusData] = useState({ activeData: [], dueData: [], expiredData: [] });
    const [combinedChartData, setCombinedChartData] = useState([]);
    const location =useLocation();
    const [dependencies, setDependencies]=useState([]);
    const navigate = useNavigate();
    const { icNo, activeTab } = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
    const [newStentData, setNewStentData] = useState([]);
  const [removedStentData, setRemovedStentData] = useState([]);
  const [replacedStentData, setReplacedStentData] = useState([]);
  const [activeStentData, setActiveStentData] = useState([]);
  const [dueStentData, setDueStentData] = useState([]);
  const [expiredStentData, setExpiredStentData] = useState([]);
  const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('All Hospitals');
  const [patientRoleData, setPatientRoleData] = useState(null);
  const [uniqueChartData, setUniqueChartData] = useState([]);

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
        const response = await fetch('http://localhost:5555/hospitalsP');
        const data = await response.json();
        setHospitalNames(data.hospitals);
      } catch (error) {
        console.error('Error fetching hospital names:', error);
      }
    };

    fetchHospitalNames();
   
  }, []);


  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch data here
        } catch (e) {
            setError('Failed to fetch data');
        }
        setIsLoading(false);
    };

    fetchData();
}, [dependencies]);

if (isLoading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;

    

  const fetchStentCounts = async () => {
    try {
        setLoading(true);

        // Determine the hospital name to use based on the user's position
        let hospitalNameToUse = selectedHospital;
        if (userData && userData.position === 'admin') {
            hospitalNameToUse = userData.hospitalName;
        }

        const url = hospitalNameToUse === 'All Hospitals' ? 'http://localhost:5555/all-range-count' : 'http://localhost:5555/range-count';
        const response = await axios.get(url, {
            params: {
                hospitalName: hospitalNameToUse === 'All Hospitals' ? '' : hospitalNameToUse,
                startDate,
                endDate
            }
        });
        setStentCounts(response.data);


        
        setLoading(false);
    } catch (err) {
        console.error(err);
        setError('Error fetching data');
        setLoading(false);
    }
};


  //   const fetchStentStatusCounts = async () => {
  //     try {
  //         setLoading(true);
  //         const url = selectedHospital === 'All Hospitals' ? 'http://localhost:5555/all-dailyStentStatus' : 'http://localhost:5555/dailyStentStatus';
  //         const response = await axios.get(url, {
  //             params: {
  //                 hospitalName: selectedHospital === 'All Hospitals' ? '' : selectedHospital,
  //                 startDate,
  //                 endDate
  //             }
  //         });
  //         setStentStatusCounts(response.data.dailyStentStatusCounts);
  //         setLoading(false);
  //     } catch (err) {
  //         console.error(err);
  //         setError('Error fetching data');
  //         setLoading(false);
  //     }
  // };


  
  const handleGenerateExcel = () => {
    
    const dataForExcel = [
        ["Date", "New Stent", "Remove", "Replace", "Active", "Due", "Expired"]
    ];

    
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    while (currentDate <= endDateObj) {
        const dateStr = currentDate.toLocaleDateString();

        
        const newStent = 
        chartData.newStentData.find(d => d.x.toLocaleDateString() === dateStr)?.y 
        || 0;
        const removedStent = 
        chartData.removedStentData.find(d => d.x.toLocaleDateString() === dateStr)?.y 
        || 0;
        const replacedStent =
         chartData.replacedStentData.find(d => d.x.toLocaleDateString() === dateStr)?.y 
         || 0;
        const active = 
        chartStatusData.activeData.find(d => d.x.toLocaleDateString() === dateStr)?.y 
        || 0;
        const due = 
        chartStatusData.dueData.find(d => d.x.toLocaleDateString() === dateStr)?.y 
        || 0;
        const expired = 
        chartStatusData.expiredData.find(d => d.x.toLocaleDateString() === dateStr)?.y 
        || 0;

       
        dataForExcel.push([dateStr, newStent, removedStent,
           replacedStent, active, due, expired]);

       
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Convert data to worksheet
    const ws = XLSX.utils.aoa_to_sheet(dataForExcel);

    // Create a new workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StentData");

    // Generate Excel file and trigger download
    let hospitalSuffix = '';
    if (userData.position === 'superAdmin') {
        hospitalSuffix = selectedHospital ? `_${selectedHospital}` : '';
    } else if (userData.position === 'admin') {
        hospitalSuffix = `_${userData.hospitalName}`;
    }


    XLSX.writeFile(wb, `StentDataReport_${startDate}_to_${endDate}
    ${hospitalSuffix}.xlsx`);
};


  const fetchStentStatusCounts = async () => {
    try {
        setLoading(true);

        // Determine the hospital name to use based on the user's position
        let hospitalNameToUse = selectedHospital;
        if (userData && userData.position === 'admin') {
            hospitalNameToUse = userData.hospitalName;
        }

        const url = hospitalNameToUse === 'All Hospitals' ? 'http://localhost:5555/all-dailyStentStatus' : 'http://localhost:5555/dailyStentStatus';
        const response = await axios.get(url, {
            params: {
                hospitalName: hospitalNameToUse === 'All Hospitals' ? '' : hospitalNameToUse,
                startDate,
                endDate
            }
        });
        setStentStatusCounts(response.data.dailyStentStatusCounts);
        setLoading(false);
    } catch (err) {
        console.error(err);
        setError('Error fetching data');
        setLoading(false);
    }
};

const handleShowMyPatientList = () => {
  // Check if the user data and hospitalName are available
  if (userData && userData.hospitalName) {
    // Navigate to the patient page and pass the hospitalName in the state
    navigate('/patient-list', { state: { hospitalName: userData.hospitalName } });
  } else {
    // Handle the case where userData or hospitalName is not available
    console.error('Error: userData or hospitalName not available');
  }
};

    useEffect(() => {
        if (stentCounts && stentStatusCounts) {
            const newStentData = stentCounts.map(item => ({ x: new Date(item.date), y: item.newStentCount }));
            const replacedStentData = stentCounts.map(item => ({ x: new Date(item.date), y: item.replacedStentCount }));
            const removedStentData = stentCounts.map(item => ({ x: new Date(item.date), y: item.removedStentCount }));
            const activeData = stentStatusCounts.map(item => ({ x: new Date(item.date), y: item.active, type: 'Active '  }));
             const dueData = stentStatusCounts.map(item => ({ x: new Date(item.date), y: item.due, type: 'Due '  }));
             const expiredData = stentStatusCounts.map(item => ({ x: new Date(item.date), y: item.expired, type: 'Expired '  }));

            //  const combinedData = [...activeData, ...dueData, ...expiredData];
            //  setCombinedChartData(combinedData);
             

            setChartData({ newStentData, replacedStentData, removedStentData });
            setChartStatusData({ activeData, dueData, expiredData });
           
        }


    }, [stentCounts],[stentStatusCounts]);

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
            console.log(response.data.staff.position);
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
     
    useEffect(() => {
      // Ensure both dates are selected before fetching data
      if (startDate && endDate) {
          fetchStentCounts();
          fetchStentStatusCounts();
      }
  }, [startDate, endDate, selectedHospital]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStentCounts();
        fetchStentStatusCounts();

    };

    const newDataWithLabels = chartData.newStentData.map((dataPoint) => ({
        ...dataPoint,
        label: `Count: ${dataPoint.y}` // Customize your label text as needed
      }));

      

      
    return (
        <div>
          <div>
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
        {isPermissionInRole('addPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/researchList",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Research List
    </Link>
  </NavDropdown.Item>
)}
        {isPermissionInRole('addResearch') && <NavDropdown.Item href="/uploadPDF">Add Research</NavDropdown.Item>}
      </NavDropdown>
 )}

      {/* Stents Dropdown */}
      
      {/* Additional Links */}
      {isPermissionInRole('contactDR') && <Nav.Link href="#">Contact DR</Nav.Link>}
      {/* Add other navigation links as needed */}

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

</div>
<div style={{ backgroundImage: "linear-gradient(#dfe3ee,#dfe3ee)", height: "100%"  }} className="d-flex flex-column justify-content-center align-items-center ">
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
 <div><h3>Stent Report by Specific Date</h3></div>
<div className="d-flex justify-content-end ml-auto">

            <Form>
            <Row>
                <Col>
                    <Form.Group controlId="formStartDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={startDate} 
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formEndDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={endDate} 
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                
            <Col><Button variant="primary" onClick={handleGenerateExcel}>Generate Excel Report</Button></Col>    
            </Row>

            {/* ... other form elements */}
            
        </Form>
        
</div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {/* {stentCounts && (
                <div>
                    <h3>Stent Counts:</h3>
                    <ul>
                        {stentCounts.map((item, index) => (
                            <li key={index}>
                                Date: {item.date}, New Stents: {item.newStentCount}, Replaced Stents: {item.replacedStentCount}, Removed Stents: {item.removedStentCount}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
            <br></br>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
 <div style={{ maxWidth: '1500px',maxHeight: '1500px',background: "white" , borderRadius: "20px", textAlign: "center", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}> 
 
 <h3 >New Stent Counts Chart:</h3>
 <VictoryChart 
  animate={{
    duration: 2000, // Duration of the animation in milliseconds
    easing: "linear" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
  }}
  theme={VictoryTheme.material} 
  scale={{ x: "time" }}
  containerComponent={<VictoryVoronoiContainer />}
  width={400}  // Set the width of the chart
    height={500}  // Set the height of the chart
>

  <VictoryAxis tickFormat={(x) => `${x.getDate()}/${x.getMonth() + 1}`}
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  
  />
  <VictoryAxis dependentAxis
   style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  />
  <VictoryBar
    data={chartData.newStentData.map(d => ({
      ...d,
      label: `Date: ${d.x.toLocaleDateString()}\nCount: ${d.y}` // Add labels to your data
    }))}
    // style={{ data: { stroke: "#c43a31" } }}
    style={{ data: { fill: "#c43a31" } }}
    labels={({ datum }) => datum.label}
    labelComponent={
      <VictoryTooltip
        style={{ fontSize: 20 }}
        flyoutStyle={{ stroke: "#c43a31", strokeWidth: 2, fill: "white" }}
      />
    }
  />
</VictoryChart>
</div>
<div style={{ maxWidth: '1500px',maxHeight: '1500px',background: "white" , borderRadius: "20px", textAlign: "center", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}> 

            <h3>Removed Stent Counts Chart:</h3>
            <VictoryChart 
             animate={{
                duration: 2000, // Duration of the animation in milliseconds
                easing: "linear" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
              }}
  theme={VictoryTheme.material} 
  scale={{ x: "time" }}
  containerComponent={<VictoryVoronoiContainer />}
  width={400}  // Set the width of the chart
    height={500}  // Set the height of the chart
>
{/* <VictoryLabel 
    text="Removed Stent Counts Chart" 
    x={200} 
    y={30} 
    textAnchor="middle"
    style={{ fontSize: 20 }}
  /> */}
  <VictoryAxis tickFormat={(x) => `${x.getDate()}/${x.getMonth() + 1}`}
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  />
  <VictoryAxis dependentAxis
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  />
  <VictoryBar
    data={chartData.removedStentData.map(d => ({
      ...d,
      label: `Date: ${d.x.toLocaleDateString()}\nCount: ${d.y}` // Add labels to your data
    }))}
    style={{ data: { fill: "orange" } }}
    labels={({ datum }) => datum.label}
    labelComponent={
      <VictoryTooltip
        style={{ fontSize: 20 }}
        flyoutStyle={{ stroke: "orange", strokeWidth: 2, fill: "white" }}
      />
    }
  />
</VictoryChart>
</div>
<div style={{ maxWidth: '1500px',maxHeight: '1500px',background: "white" , borderRadius: "20px", textAlign: "center", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}> 

            <h3>Replaced Stent Counts Chart:</h3>
            <VictoryChart 
             animate={{
                duration: 2000, // Duration of the animation in milliseconds
                easing: "linear" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
              }}
  theme={VictoryTheme.material} 
  scale={{ x: "time" }}
  containerComponent={<VictoryVoronoiContainer />}
  width={400}  // Set the width of the chart
    height={500}  // Set the height of the chart
>

  <VictoryAxis tickFormat={(x) => `${x.getDate()}/${x.getMonth() + 1}`} 
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  
  />
  <VictoryAxis dependentAxis
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  
  />
  <VictoryBar
    data={chartData.replacedStentData.map(d => ({
      ...d,
      label: `Date: ${d.x.toLocaleDateString()}\nCount: ${d.y}` // Add labels to your data
    }))}
    style={{ data: { fill: "green" } }}
    labels={({ datum }) => datum.label}
    labelComponent={
      <VictoryTooltip
        style={{ fontSize: 20 }}
        flyoutStyle={{ stroke: "green", strokeWidth: 2, fill: "white" }}
      />
    }
  />
</VictoryChart>
</div>
</div>
<br></br>

{/* chartStatusData.activeData */}
<div style={{ display: 'flex', justifyContent: 'space-around' }}>
<div style={{ maxWidth: '900px',maxHeight: '1500px',background: "white" , borderRadius: "20px", textAlign: "center", boxShadow:" 8px 8px 8px rgba(0, 0, 0, .1)" }}> 

            <h3>Active Stent Counts Chart:</h3>
            <VictoryChart 
             animate={{
                duration: 2000, // Duration of the animation in milliseconds
                easing: "linear" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
              }}
  theme={VictoryTheme.material} 
  
  scale={{ x: "time" }}
  containerComponent={<VictoryVoronoiContainer />}
  width={400}  // Set the width of the chart
  height={500}  // Set the height of the chart
>

  <VictoryAxis tickFormat={(x) => `${x.getDate()}/${x.getMonth() + 1}`}
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  
  />
  <VictoryAxis dependentAxis
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  />
  <VictoryBar
    data={chartStatusData.activeData .map(d => ({
      ...d,
      label: `Date: ${d.x.toLocaleDateString()}\nCount: ${d.y}` // Add labels to your data
    }))}
    style={{ data: { fill: "yellow" } }}
    labels={({ datum }) => datum.label}
    labelComponent={
      <VictoryTooltip
        style={{ fontSize: 20 }}
        flyoutStyle={{ stroke: "yellow", strokeWidth: 2, fill: "white" }}
      />
    }
  />
</VictoryChart>
</div>
{/* chartStatusData.dueData */}
<div style={{ maxWidth: '900px',maxHeight: '1500px',background: "white" , borderRadius: "20px", textAlign: "center", boxShadow:" 8px 4px 8px rgba(0, 0, 0, .1)" }}> 

            <h3>Due Stent Counts Chart:</h3>
            <VictoryChart 
             animate={{
                duration: 2000, // Duration of the animation in milliseconds
                easing: "linear" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
              }}
  theme={VictoryTheme.material} 
  scale={{ x: "time" }}
  containerComponent={<VictoryVoronoiContainer />}
  width={400}  // Set the width of the chart
  height={500}  // Set the height of the chart
>

  <VictoryAxis tickFormat={(x) => `${x.getDate()}/${x.getMonth() + 1}`} 
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  
  />
  <VictoryAxis dependentAxis
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  />
  <VictoryBar
    data={chartStatusData.dueData .map(d => ({
      ...d,
      label: `Date: ${d.x.toLocaleDateString()}\nCount: ${d.y}` // Add labels to your data
    }))}
    style={{ data: { fill: "blue" } }}
    labels={({ datum }) => datum.label}
    labelComponent={
      <VictoryTooltip
        style={{ fontSize: 20 }}
        flyoutStyle={{ stroke: "blue", strokeWidth: 2, fill: "white" }}
      />
    }
  />
</VictoryChart>
</div>
{/* chartStatusData.expiredData */}
<div style={{ maxWidth: '900px',maxHeight: '1500px',background: "white" , borderRadius: "20px", textAlign: "center", boxShadow:" 8px 4px 8px rgba(0, 0, 0, .1)" }}> 
         
            <h3>Expired Stent Counts Chart:</h3>
        
<VictoryChart 
 animate={{
    duration: 2000, // Duration of the animation in milliseconds
    easing: "linear" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
  }}
  theme={VictoryTheme.material} 
  scale={{ x: "time" }}
  containerComponent={<VictoryVoronoiContainer />}
  width={400}  // Set the width of the chart
  height={500}  // Set the height of the chart
>

  <VictoryAxis tickFormat={(x) => `${x.getDate()}/${x.getMonth() + 1}`} 
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  
  />
  <VictoryAxis dependentAxis
  style={{
    tickLabels: { fontSize: 15, padding: 5 }, // Increase font size for tick labels
    axisLabel: { fontSize: 20, padding: 30 } // Optional: Style for axis title
  }}
  />
  <VictoryBar
    data={chartStatusData.expiredData.map(d => ({
      ...d,
      label: `Date: ${d.x.toLocaleDateString()}\nCount: ${d.y}` // Format the date and include it in the label
    }))}
    style={{ data: { fill: "purple" } }}
    labels={({ datum }) => datum.label}
    labelComponent={
      <VictoryTooltip
        style={{ fontSize: 20 }}
        flyoutStyle={{ stroke: "purple", strokeWidth: 2, fill: "white" }}
      />
    }
  />
</VictoryChart>
            </div>
        </div>
</Container>
<br></br>

        </div>
        <br></br>
        </div>
       
        </div>
    );
}

export default SpecificTimeReport;
