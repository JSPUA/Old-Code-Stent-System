import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link,useNavigate } from "react-router-dom";
import { Modal, Button, Form,Table,Image,Row,Col,Container, Badge } from "react-bootstrap";
import { faExclamationTriangle, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineSearch,MdOutlineDelete,MdOutlineCached } from "react-icons/md";
import Navbars from "./Navbar";
import AnimatedCountdown2 from "./AnimatedCountdown2";




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


function StentDataPage() {
  const { id } = useParams();
  const { icNo, activeTab } = useSelector((state) => state.user);
  const [patientData, setPatientData] = useState(null);
  const [userData, setUserData] = useState(null);
const [roleData, setRoleData] = useState(null);
  const [stentData, setStentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stentInfo, setStentInfo] = useState({});
  const [editedStentData, setEditedStentData] = useState({});
  const [editStentIndex, setEditStentIndex] = useState(null); // Store the stent index to edit
  const [showAddStentModal, setShowAddStentModal] = useState(false);
  const [showReplaceAddStentModal, setShowReplaceAddStentModal] = useState(false);
  const [replaceStentId, setReplaceStentId] = useState(null);
  const [deletedStentIdForReplacement, setDeletedStentIdForReplacement] = useState(null);
  const [records, setRecords] = useState([]);
  const [removeRecords, setRemoveRecords] = useState([]);
  const [replaceRecords, setReplaceRecords] = useState([]);
  const [newStentData, setNewStentData] = useState({


    caseId: "", 
    mrnNo: '',
    laterality: 'left',
     hospitalName: '',
     insertedDate: '',
     dueDate: '2 weeks',
     doctor: "",
     Due: '',
     size: '',
     length: '',
     stentType: "Polyurethane",
     stentBrand: 'Boston Scientific',
   
     remarks: '',
     stentTypeOther: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    caseId: "", 
    mrnNo: '',
    laterality: '',
     hospitalName: '',
     insertedDate: '',
     dueDate: '',
     doctor: "",
     size: '',
     length: '',
     stentType: "polyurethane",
     stentBrand: 'Boston Scientific',
    
     remarks: '',
  });

  const [showReplaceDeleteModal, setReplaceShowDeleteModal] = useState(false);
  const [replaceDeleteInfo, setReplaceDeleteInfo] = useState({
    caseId: "", 
    mrnNo: '',
    laterality: '',
     hospitalName: '',
    
     insertedDate: '',
     dueDate: '',
     doctor: '',
     size: '',
     length: '',
     stentType: "polyurethane",
     stentBrand: 'Boston Scientific',
    
     remarks: '',
  });

  const [calculatedDueDate, setCalculatedDueDate] = useState('');
  const [validationMessage, setValidationMessage] = useState("");
const navigate =useNavigate();

  // Define the fetchData function at the component level
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5555/getPatientById/${id}`
      );
      const { patient, stentData } = response.data;
      setPatientData(patient);
      setStentData(stentData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call fetchData when the component mounts
    fetchData();
  }, [id]);

  useEffect(() => {
    if (replaceStentId) {
      openReplaceAddStentModal();
    }
  }, [replaceStentId]);

  useEffect(() => {
    if (patientData && patientData.mrnNo) 
    axios.get(`http://localhost:5555/stentRecords/${patientData.mrnNo}`) // Adjust the URL to your API endpoint
      .then(response => {
        setRecords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stent records!', error);
      });
  }, [patientData]);


  useEffect(() => {
    if (patientData && patientData.mrnNo) 
    axios.get(`http://localhost:5555/stentRecords/${patientData.mrnNo}`) // Adjust the URL to your API endpoint
      .then(response => {
        setRecords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stent records!', error);
      });
  }, [patientData]);


  useEffect(() => {
    if (patientData && patientData.mrnNo) 
    axios.get(`http://localhost:5555/removedStents/${patientData.mrnNo}`) // Adjust the URL to your API endpoint
      .then(response => {
        setRemoveRecords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stent records!', error);
      });
  }, [patientData]);

  useEffect(() => {
    if (patientData && patientData.mrnNo) 
    axios.get(`http://localhost:5555/replaceStents/${patientData.mrnNo}`) // Adjust the URL to your API endpoint
      .then(response => {
        setReplaceRecords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stent records!', error);
      });
  }, [patientData]);


  useEffect(() => {
    // Fetch additional user data based on the stored token or user information
    const fetchUserData = async () => {
      try {
        console.log(icNo);
        console.log(activeTab);
        
        let endpoint = '';
        if (activeTab === 'staff') {
          endpoint = `http://localhost:5555/getStaffByEmail/${icNo}`;
        } else if (activeTab === 'patient') {
          endpoint = `http://localhost:5555/getPatientByEmail/${icNo}`;
        } else {
          console.error('Invalid user type:', activeTab);
          navigate('/login');
          return;
        }
  
        const response = await axios.get(endpoint);
  
        if (activeTab === 'staff') {
          setUserData(response.data.staff);
          const roleResponse = await axios.get(`http://localhost:5555/role/${response.data.staff.position}`);
          setRoleData(roleResponse.data);
        } else if (activeTab === 'patient') {
          setUserData(response.data.patient);
          const patientRoleResponse = await axios.get(`http://localhost:5555/role/patient`);
          setPatientRoleData(patientRoleResponse.data);
        } else {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };
  
    fetchUserData();
  }, [navigate, icNo]); 
  
  const deleteStent = (stentIndex) => {
    if (!deleteInfo.caseId || !deleteInfo.laterality  || !deleteInfo.removedBy  || !deleteInfo.removalDate || !deleteInfo.removalLocation ) {
      setValidationMessage("Please fill out all required fields.");
      return;
    }
    setValidationMessage("");

    axios
      .delete(
        `http://localhost:5555/deleteStent/${id}/${stentIndex}`
      )
      .then((response) => {
        console.log("Stent record deleted:", response.data);

        const updatedStentData = [...patientData.stentData];
        updatedStentData.splice(stentIndex, 1);
        setPatientData({ ...patientData, stentData: updatedStentData });
      })
      .catch((error) => {
        console.error("Error deleting stent record:", error);
      });
  };

  const replaceDeleteStent = (stentIndex) => {
    axios
      .delete(
        `http://localhost:5555/replaceDeleteStent/${id}/${stentIndex}`
      )
      .then((response) => {
        console.log("Stent record deleted:", response.data);

        const updatedStentData = [...patientData.stentData];
        updatedStentData.splice(stentIndex, 1);
        setPatientData({ ...patientData, stentData: updatedStentData });
      })
      .catch((error) => {
        console.error("Error deleting stent record:", error);
      });
  };

  const showStentInfo = (stentIndex) => {
    axios
      .get(`http://localhost:5555/getStent/${id}/${stentIndex}`)
      .then((response) => {
        // Set the stent info to display in the modal
        setStentInfo(response.data);
        
        setEditedStentData(response.data);
        // Open the modal
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching stent record info:", error);
      });
  };

 

  // Function to handle saving edited stent data
  const saveEditedStentData = () => {
    // Make a PUT request to update the stent data on the server
    axios
      .put(
        `http://localhost:5555/updateStent/${id}/${editStentIndex}`,
        editedStentData
      )
      .then((response) => {
        console.log("Stent record updated:", response.data);

        // Close the edit modal after successful update
        setIsEditModalOpen(false);

        // You may want to refresh the stent data on the main page after the update
        // You can call fetchData or any other function that fetches and updates the stent data.
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating stent record:", error);
      });
  };

 
  //   try {
  //     const response = await axios.get('http://localhost:5555/getPatients');
  //     if (response.status === 200) {
  //       // Check the structure of the response data
  //       const data = response.data;
  //       if (Array.isArray(data)) {
  //         return data;
  //       } else {
  //         throw new Error('API response does not contain an array');
  //       }
  //     } else {
  //       throw new Error('API request failed');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching all patients data:', error);
  //     return []; // Return an empty array or handle the error as needed
  //   }
  // };
  

  // const generateUniqueCaseID = async () => {
  //   try {
  //     // Fetch data for all patients
  //     const allPatients = await fetchAllPatientsData();
  
  //     if (!Array.isArray(allPatients)) {
  //       throw new Error('Invalid data format from fetchAllPatientsData');
  //     }
  
  //     // Find the highest case ID across all patients and stent data
  //     let highestCaseID = 0;
  //     allPatients.forEach((patient) => {
  //       if (Array.isArray(patient.stentData)) {
  //         patient.stentData.forEach((stent) => {
  //           const stentCaseID = parseInt(stent.caseId, 10);
  //           if (!isNaN(stentCaseID) && stentCaseID > highestCaseID) {
  //             highestCaseID = stentCaseID;
  //           }
  //         });
  //       }
  //     });
  
  //     // Generate a new unique case ID
  //     const newCaseID = highestCaseID + 1;
  //     return newCaseID.toString();
  //   } catch (error) {
  //     console.error('Error generating unique case ID:', error);
  //     return null; // Return a default value or handle the error as needed
  //   }
  // };
  

  // const openAddStentModal = () => {
   
  //   setShowAddStentModal(true);
  // };

  const openAddStentModal = async () => {
    try {
      const response = await axios.get('http://localhost:5555/getLastCaseId');
      const nextCaseId = response.data.nextCaseId;

      setNewStentData({
        ...newStentData,
        caseId: nextCaseId, // Set the next case ID
      });

      setShowAddStentModal(true);
    } catch (error) {
      console.error("Error fetching next case ID:", error);
      // Handle error or set a default case ID
    }
  };

  const openReplaceAddStentModal = () => {
   
    setShowReplaceAddStentModal(true);
  };

  const closeAddStentModal = () => {
    setShowAddStentModal(false);
  };

  const closeReplaceAddStentModal = () => {
    setShowReplaceAddStentModal(false);
  };

  const addStent = () => {
    
    if (!newStentData.caseId || !newStentData.laterality  || !newStentData.hospitalName  || !newStentData.insertedDate || !newStentData.dueDate || !newStentData.doctor || !newStentData.size || !newStentData.length || !newStentData.stentType || !newStentData.stentBrand || !newStentData.remarks ) {
      setValidationMessage("Please fill out all required fields.");
      return;
    }

    setValidationMessage("");
    axios
      .post(`http://localhost:5555/stents/${id}`, newStentData)
      .then((response) => {
        console.log("Stent record added:", response.data);

        // Close the add stent modal after a successful addition
        closeAddStentModal();

        // You may want to refresh the stent data on the main page after adding a stent
        // You can call fetchData or any other function that fetches and updates the stent data.
        fetchData();
      })
      .catch((error) => {
        console.error("Error adding stent record:", error);
      });
  };

  const replaceAddStent = () => {
    console.log(deletedStentIdForReplacement);
    // Make a POST request to add a new stent using newStentData
    axios
      .post(`http://localhost:5555/replaceAddStents/${id}`, {
        newStentData,
        caseId: deletedStentIdForReplacement  // Send the replaceStentId along with the new stent data
      })
      .then((response) => {
        console.log("Stent record added:", response.data);

        // Close the add stent modal after a successful addition
        closeReplaceAddStentModal();

        // You may want to refresh the stent data on the main page after adding a stent
        // You can call fetchData or any other function that fetches and updates the stent data.
        fetchData();
      })
      .catch((error) => {
        console.error("Error adding stent record:", error);
      });
  };

  const openDeleteModal = (stentIndex) => {
    

    const stentToDelete = patientData.stentData[stentIndex];

    // Set the stent data to state
    setStentData(stentToDelete);
  
    // Set the deleteInfo with the default or existing values
    setDeleteInfo({ ...deleteInfo, caseId: stentToDelete.caseId, laterality: stentToDelete.laterality });
    setEditStentIndex(stentIndex);
    setShowDeleteModal(true);
  };

  const openReplaceDeleteModal = (stentIndex) => {
    setReplaceDeleteInfo({
      caseId: "",
      removedBy: "",
      removalDate: "",
      removalLocation: "",
    });
    setEditStentIndex(stentIndex);
    setReplaceShowDeleteModal(true);
  };


  const handleStentTypeChange = (e) => {
    const { name, value } = e.target;
    if (name === "stentType") {
      setNewStentData({
        ...newStentData,
        stentType: value,
        stentTypeOther: '', // Reset the stentTypeOther field when changing stentType
      });
    } else if (name === "stentTypeOther") {
      setNewStentData({
        ...newStentData,
        stentTypeOther: value,
      });
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const closeReplaceDeleteModal = () => {
    setReplaceShowDeleteModal(false);
  };
  


  const submitDeleteModal = (stentIndex) => {
if (!deleteInfo.caseId || !deleteInfo.laterality  || !deleteInfo.removedBy  || !deleteInfo.removalDate || !deleteInfo.removalLocation ) {
      setValidationMessage("Please fill out all required fields.");
      return;
    }
    setValidationMessage("");

    const stentToRemove = patientData.stentData[editStentIndex];
    // Delete the stent from the list
    const updatedStentData = [...patientData.stentData];
    updatedStentData.splice(editStentIndex, 1);
    setPatientData({ ...patientData, stentData: updatedStentData });

    // Add the stent information to the "removedStent" collection
    const removedStentInfo = {
      caseId: deleteInfo.caseId,
      removedBy: deleteInfo.removedBy,
      removalDate: deleteInfo.removalDate,
      removalLocation: deleteInfo.removalLocation,
      laterality: stentToRemove.laterality, // You can add more properties here
    };

    // Make a POST request to add the removed stent information
    axios
      .post(`http://localhost:5555/removedStents/${id}`, removedStentInfo)
      .then((response) => {
        console.log("Removed Stent record added:", response.data);

        // Close the delete modal after a successful addition
        closeDeleteModal();
      })
      .catch((error) => {
        console.error("Error adding removed stent record:", error);
      });
  };



  // const submitDeleteModal = (stentIndex) => {
    
  //   // const stentToRemove = patientData.stentData[editStentIndex];
  //   // // Delete the stent from the list
  //   // const updatedStentData = [...patientData.stentData];
  //   // updatedStentData.splice(editStentIndex, 1);
  //   // setPatientData({ ...patientData, stentData: updatedStentData });

  //   // // Add the stent information to the "removedStent" collection
  //   // const removedStentInfo = {
  //   //   caseId: deleteInfo.caseId,
  //   //   removedBy: deleteInfo.removedBy,
  //   //   removalDate: deleteInfo.removalDate,
  //   //   removalLocation: deleteInfo.removalLocation,
  //   //   laterality: stentToRemove.laterality, // You can add more properties here
  //   // };

  //   // // Make a POST request to add the removed stent information
  //   // axios
  //   //   .post(`http://localhost:5555/removedStents/${id}`, removedStentInfo)
  //   //   .then((response) => {
  //   //     console.log("Removed Stent record added:", response.data);

  //   //     // Close the delete modal after a successful addition
  //   //     closeDeleteModal();
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error adding removed stent record:", error);
  //   //   });


  //   axios.get(`http://localhost:5555/getPatientById/${id}`)
  //   .then((response) => {
  //     const patientData = response.data; // Assuming the response contains patient data

  //     // Check if the specified stent exists
  //     if (stentIndex >= 0 && stentIndex < patientData.stentData.length) {
  //       const stentToRemove = patientData.stentData[stentIndex];

  //       // Add the stent information to the "removedStent" collection
  //       const removedStentInfo = {
  //         caseId: stentToRemove.caseId,
  //         removedBy: deleteInfo.removedBy,
  //         removalDate: deleteInfo.removalDate,
  //         removalLocation: deleteInfo.removalLocation,
  //         laterality: stentToRemove.laterality, // You can add more properties here
  //       };

  //       // Make a POST request to add the removed stent information
  //       axios.post(`http://localhost:5555/removedStents/${id}`, removedStentInfo)
  //         .then((response) => {
  //           console.log("Removed Stent record added:", response.data);

  //           // Optionally, update the local patient data to reflect the removal
  //           const updatedStentData = patientData.stentData.filter((_, index) => index !== stentIndex);
  //           setPatientData({ ...patientData, stentData: updatedStentData });

  //           // Close the delete modal after a successful addition
  //           closeDeleteModal();
  //         })
  //         .catch((error) => {
  //           console.error("Error adding removed stent record:", error);
  //         });
  //     } else {
  //       console.error("Stent not found at the specified index");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching patient data:", error);
  //   });
  // };

  const submitReplaceDeleteModal = (stentIndex) => {

    
    const stentToRemove = patientData.stentData[editStentIndex];
    // Delete the stent from the list
    const updatedStentData = [...patientData.stentData];
    updatedStentData.splice(editStentIndex, 1);
    setPatientData({ ...patientData, stentData: updatedStentData });

    // Add the stent information to the "removedStent" collection
    const removedStentInfo = {
      caseId: replaceDeleteInfo.caseId,
      removedBy: replaceDeleteInfo.removedBy,
      removalDate: replaceDeleteInfo.removalDate,
      removalLocation: replaceDeleteInfo.removalLocation,
      laterality: stentToRemove.laterality, // You can add more properties here
    };

    // Make a POST request to add the removed stent information
    axios
      .post(`http://localhost:5555/replaceStents/${id}`, removedStentInfo)
      .then((response) => {
        console.log("Removed Stent record added:", response.data);
        setDeletedStentIdForReplacement(replaceDeleteInfo.caseId);
        // Close the delete modal after a successful addition
        closeReplaceDeleteModal();
        openReplaceAddStentModal();
      })
      .catch((error) => {
        console.error("Error adding removed stent record:", error);
      });
  };


  const calculateDueDate = (insertedDate, dueIn) => {
    if (!insertedDate) {
      return '';
    }
  
    // Convert the dueIn value to the number of days
    let days = 0;
    switch (dueIn) {
      case '2 weeks':
        days = 14;
        break;
      case '1 month':
        days = 30;
        break;
      case '2 months':
        days = 60;
        break;
      case '3 months':
        days = 90;
        break;
      case '6 months':
        days = 180;
        break;
      case '12 months':
        days = 365; // Approximated to 365 days for a year
        break;
      case 'permanent':
        days = 0;
        break;
      default:
        days = 0;
    }
  
    // Calculate the due date by adding the number of days to the inserted date
    const insertedDateTime = new Date(insertedDate).getTime();
    const dueDateTime = new Date(insertedDateTime + days * 24 * 60 * 60 * 1000);
    const formattedDueDate = dueDateTime.toISOString().split('T')[0];
  
    return formattedDueDate;
  };
  
  // Update the onChange handler for "Inserted Date" and "Due In"
  const handleInsertDateChange = (e) => {
    const insertedDate = e.target.value;
    const dueDate = calculateDueDate(insertedDate, newStentData.dueDate);
  
    setNewStentData({
      ...newStentData,
      insertedDate,
      dueDate,
    });
  };
  
  const handleDueInChange = (e) => {
    const dueIn = e.target.value;
    const dueDate = calculateDueDate(newStentData.insertedDate, dueIn);
  
    setNewStentData({
      ...newStentData,
      dueDate,
      dueIn,
    });
  };


// Function to convert the selected date to GMT+8
const convertToGMT8 = (dateString) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
  const klTime = new Date(date.getTime() + offset + (8 * 60 * 60000)); // UTC+8 for Kuala Lumpur
  return klTime.toISOString().split('T')[0]; // Format to YYYY-MM-DD
};


// Usage example
const handleDateChange = (e) => {
  const gmt8Date = convertToGMT8(e.target.value);
  setNewStentData({
    ...newStentData,
    insertedDate: gmt8Date,
  });
};



  const getStatusLabel = (stent) => {
    const dueDate = calculateDueDate(stent.insertedDate, stent.dueDate);
    const now = new Date().toISOString().split("T")[0];
    
    if (!dueDate) {
      return "N/A";
    } else {
      const daysDifference = Math.floor((new Date(dueDate) - new Date(now)) / (1000 * 60 * 60 * 24));
      console.log(daysDifference);
      if (daysDifference <= 0) {
        return "Expired";
      } else if (daysDifference <= 14) {
        return "Due";
      } else {
        return "Active";
      }
    }
  };
  

  const getStatusVariant = (stent) => {
    const dueDate = calculateDueDate(stent.insertedDate, stent.dueDate);
    const now = new Date().toISOString().split("T")[0];
    
    if (!dueDate) {
      return "secondary";
    } else {
      const daysDifference = Math.floor((new Date(dueDate) - new Date(now)) / (1000 * 60 * 60 * 24));
      if (daysDifference <= 0) {
        return "danger"; // Expired (red)
      } else if (daysDifference <= 14) {
        return "warning"; // Due (yellow)
      } else {
        return "success"; // Active (green)
      }
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

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
    <Container>

    <div>
      <br></br>
      <h2>Patient Information</h2>

      {patientData && (
        <div>
          <p>MRN No: {patientData.mrnNo}</p>
          <p>
            Name: {patientData.firstName} {patientData.surname}
          </p>
          <p>No of stent: {patientData.stentData.length}</p>
          <p>Email: {patientData.email}</p>
        </div>
      )}
<br></br>

<div>
<div className="status-legend">
  <h3>Legend</h3>
  <Row className="justify-content-end align-items-center">
    <Col xs="10"><Badge bg="success">Active</Badge></Col>
    <Col xs="2"><h5>Days Left &gt;14 days</h5></Col>
  </Row>
  <Row className="justify-content-end align-items-center">
    <Col xs="10"><Badge bg="warning">Due</Badge></Col>
    <Col xs="2"><h5>14 &lt;=Days Left &lt;0 day</h5></Col>
  </Row>
  <Row className="justify-content-end align-items-center">
    <Col xs="10"><Badge bg="danger">Expired</Badge></Col>
    <Col xs="2"><h5>0 day left</h5></Col>
  </Row>
</div>



</div>

      <h4>Stent Data</h4>
      
      
      {patientData.stentData && patientData.stentData.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead className="text-center">
            <tr>
            <th>Case ID</th>
              <th>Laterality</th>
             
              <th>Inserted Date</th>
              <th>Due Date</th>
              <th>Due when</th>
              <th>Countdown</th>
              <th>Status</th>
              
             
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
         
            {patientData.stentData.map((stent, index) => (
              <tr key={index} className="text-center">
                <td>{stent.caseId}</td>
                <td>{stent.laterality}</td>
               
                <td>{formatDate(stent.insertedDate)}</td>
                <td>{stent.dueDate}</td>
                
                <td>{ calculateDueDate(stent.insertedDate, stent.dueDate)}</td>
                <td>
                <span style={{ fontSize: '16px' }}>
  <AnimatedCountdown2 insertedDate={formatDate(stent.insertedDate)} dueDate={calculateDueDate(stent.insertedDate, stent.dueDate)} />
  </span>
</td>
<td>
            <Badge bg={getStatusVariant(stent)}> {/* Use the getStatusVariant function to determine the label variant */}
              {getStatusLabel(stent)}
            </Badge>

          </td>
               
               
                <td>
                  {/* <button onClick={() => deleteStent(index)}>Delete</button> */}
                  <Button  variant="primary" onClick={() => showStentInfo(index)}>
                   View Details
                  </Button>
                 
                  {/* <button onClick={() => handleEditStentData(index)}>
                    Edit
                  </button> */}
                  {/* {userData && userData.position === 'doctor' && ( */}
    <>
      <Button variant="primary" onClick={() => openDeleteModal(index)}>
        Remove Stent
      </Button>
      <Button variant="primary" onClick={() => openReplaceDeleteModal(index)}>
        Replace Stent
      </Button>
    </>
  {/* )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table >
        
      ) 
      : (
        <p>No stent data available.</p>
      )}

{/* {userData && userData.position === 'doctor' && ( */}
  <>
    {patientData.stentData.length < 2 && (
      <div className="d-flex justify-content-end ml-auto">
        <Button variant="primary" onClick={() => openAddStentModal()}>
          Add Stent
        </Button>
      </div>
    )}
  </>
{/* )} */}
<br></br>



      {/* Modal for show stent info*/ }
      <Modal
  show={isModalOpen}
  onHide={() => setIsModalOpen(false)}
  contentlabel="Stent Information"
  dialogClassName="custom-modal"
>
  <Modal.Header closeButton>
    <Modal.Title>Stent Information</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {stentInfo ? (
      <div>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Case ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Case ID"
                value={stentInfo.caseId}
                onChange={(e) => handleFieldChange('caseId', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>MRN NO</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter MRN NO"
                value={patientData.mrnNo}
                onChange={(e) => handleFieldChange('mrnNo', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Laterality</Form.Label>
              <Form.Control
                as="select"
                value={stentInfo.laterality}
                onChange={(e) => handleFieldChange('laterality', e.target.value)}
              >
                <option value="Left">Left</option>
                <option value="Right">Right</option>
                <option value="None">None</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
<br></br>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Hospital Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Hospital Name"
                value={stentInfo.hospitalName}
                onChange={(e) => handleFieldChange('hospitalName', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Inserted Date</Form.Label>
              <Form.Control
                type="date"
                value={formatDate(stentInfo.insertedDate)}
                onChange={(e) => handleFieldChange('insertedDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Due In</Form.Label>
              <Form.Control
                as="select"
                value={stentInfo.dueDate}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              >
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
                <option value="permanent">Permanent</option>
              </Form.Control>
            </Form.Group>
           
           
          </Col>
          <Col>
        <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
              
                value={ calculateDueDate(stentInfo.insertedDate, stentInfo.dueDate)}
           
              >
              
              </Form.Control>
            </Form.Group>
            </Col>
        </Row>
        <br></br>
        <Row>
          <Col>
          <Form.Group>
              <Form.Label>Doctor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Doctor Name"
                value={stentInfo.doctor}
                onChange={(e) => handleFieldChange('doctor', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Size (fr)</Form.Label>
              <Form.Control
                type="text"
                value={stentInfo.size}
                onChange={(e) => handleFieldChange('size', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Length (cm)</Form.Label>
              <Form.Control
                type="text"
                value={stentInfo.length}
                onChange={(e) => handleFieldChange('length', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Stent Type</Form.Label>
              <Form.Control
                type="text"
                value={stentInfo.stentType}
                onChange={(e) => handleFieldChange('stentType', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
<br></br>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Stent Brand</Form.Label>
              <Form.Control
                as="select"
                value={stentInfo.stentBrand}
                onChange={(e) => handleFieldChange('stentBrand', e.target.value)}
              >
                 <option value="Boston Scientific">Boston Scientific</option>
                 <option value="Cook Medical">Cook Medical</option>
                 <option value="Bard Medical">Bard Medical</option>
                 <option value="Olympus">Olympus</option>
                 <option value="Teleflex">Teleflex</option>
                 <option value="Others">Others</option>
                </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            {/* <Form.Group>
              <Form.Label>Place of Insertion</Form.Label>
              <Form.Control
                type="text"
                value={stentInfo.placeOfInsertion}
                onChange={(e) => handleFieldChange('placeOfInsertion', e.target.value)}
              />
            </Form.Group> */}
            {/* <Form.Group>
              <Form.Label>Insertion Body Part</Form.Label>
              <Form.Control
                as="select"
                value={stentInfo.placeOfInsertion}
                onChange={(e) => handleFieldChange('placeOfInsertion', e.target.value)}
              >
                <option value="Kidney">Kidney</option>
                <option value="Ureter">Ureter</option>
               
                <option value="Bladder">Bladder</option>
              </Form.Control>
            </Form.Group> */}
          </Col>
          
        </Row>
        <br></br>
        <Row>
        <Col>
            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                value={stentInfo.remarks}
                onChange={(e) => handleFieldChange('remarks', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
    ) : (
      <p>No stent record available.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

      {/*Modal for edit, maybe need to delete */}
      <Modal
        show={isEditModalOpen}
        onHide={() => setIsEditModalOpen(false)}
        contentlabel="Stent Information"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Stent Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Laterality:</label>

            <input
              type="text"
              placeholder="Enter laterality"
              name="laterality"
              value={editedStentData.laterality}
              onChange={(e) =>
                setEditedStentData({
                  ...editedStentData,
                  laterality: e.target.value,
                })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Hospital Name:</label>
            <input
              type="text"
              placeholder="Enter Hospital Name"
              name="hospitalName"
              value={editedStentData.hospitalName}
              onChange={(e) =>
                setEditedStentData({
                  ...editedStentData,
                  hospitalName: e.target.value,
                })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Inserted Date:</label>
            <input
              type="date"
              placeholder="Enter Inserted Date"
              name="insertedDate"
              value={editedStentData.insertedDate}
              onChange={(e) =>
                setEditedStentData({
                  ...editedStentData,
                  insertedDate: e.target.value,
                })
              }
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEditedStentData}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

       {/*Modal for add stent */}
       <Modal show={showAddStentModal} onHide={() => closeAddStentModal()}  dialogClassName="custom-modal">
       <Modal.Header closeButton>
  
    <Modal.Title>Add Stent</Modal.Title>
  
</Modal.Header>

  <Modal.Body>
  {validationMessage && <div className="alert alert-danger">{validationMessage}</div>}
    <Form>
    {/* <div className="text-center">
    <Image
      src={`/MML.png`}
      alt="Logo"
      fluid
      style={{ width: '100px', height: 'auto' }}
      className="float-right"
    />
    
  </div>
  <br></br> */}
      <div className="row">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Case ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Case ID"
              value={newStentData.caseId}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  caseId: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>MRN NO</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter MRN NO"
              value={patientData.mrnNo}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  mrnNo: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
        <Form.Group>
            <Form.Label>Laterality</Form.Label>
            <Form.Control
              as="select"
              value={newStentData.laterality}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  laterality: e.target.value,
                })
              }
            >
              <option value="Left">Left</option>
              <option value="Right">Right</option>
              
            </Form.Control>
          </Form.Group>
        </div>
      </div>
<br></br>
      <div className="row">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Hospital Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Hospital Name"
              value={newStentData.hospitalName}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  hospitalName: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Insert Date</Form.Label>
            <Form.Control
              type="date"
              value={newStentData.insertedDate}
              onChange={handleDateChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
        <Form.Group>
  <Form.Label>Due In</Form.Label>
  <Form.Control
    as="select"
    value={newStentData.dueDate}
    onChange={(e) => {
      const selectedValue = e.target.value;
      let days = 0;

      // Calculate the number of days based on the selected option
      switch (selectedValue) {
        case '2 weeks':
          days = 14;
          break;
        case '1 month':
          days = 30;
          break;
        case '2 months':
          days = 60;
          break;
        case '3 months':
          days = 90;
          break;
        case '6 months':
          days = 180;
          break;
        case '12 months':
          days = 365; // Approximated to 365 days for a year
          break;
        case 'permanent':
          days = 0; // You can set this to any specific value for "permanent"
          break;
        default:
          days = 0; // Default to 0 if none of the above options
      }

      // Update the "dueDate" and "length" fields
      setNewStentData({
        ...newStentData,
        dueDate: selectedValue,
        Due: days.toString(),
      });
    }}
  >
    <option value="2 weeks">2 weeks</option>
    <option value="1 month">1 month</option>
    <option value="2 months">2 months</option>
    <option value="3 months">3 months</option>
    <option value="6 months">6 months</option>
    <option value="12 months">12 months</option>
    <option value="permanent">Permanent</option>
  </Form.Control>
</Form.Group>
        </div>
      </div>
      <br></br>
      <div className="row">
      <div className="col-md-3">
          <Form.Group>
            <Form.Label>Doctor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Doctor Name"
              value={newStentData.doctor}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  doctor: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Size (fr)</Form.Label>
            <Form.Control
              type="number"
              value={newStentData.size}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  size: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Length (cm)</Form.Label>
            <Form.Control
              type="number"
              value={newStentData.length}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  length: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Stent Type</Form.Label>
            <Form.Control
              as="select"
              name="stentType"
              value={newStentData.stentType}
              onChange={handleStentTypeChange}
            >
              <option value="polyurethane">Polyurethane</option>
              <option value="silicon">Silicon</option>
              <option value="metallic">Metallic</option>
              <option value="others">Others</option>
            </Form.Control>
          </Form.Group>
        </div>
      </div>
   
      {newStentData.stentType === "others" && (
        <div className="row">
          <div className="col-md-12">
            <Form.Group>
              <Form.Label>Stent Type (Other)</Form.Label>
              <Form.Control
                type="text"
                name="stentTypeOther"
                placeholder="Specify the stent type"
                value={newStentData.stentTypeOther}
                onChange={handleStentTypeChange}
              />
            </Form.Group>
          </div>
        </div>
      )}
<br></br>
      <div className="row">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Stent Brand</Form.Label>
            <Form.Control
              as="select"
              value={newStentData.stentBrand}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  stentBrand: e.target.value,
                })
              }
            >
               <option value="Boston Scientific">Boston Scientific</option>
                 <option value="Cook Medical">Cook Medical</option>
                 <option value="Bard Medical">Bard Medical</option>
                 <option value="Olympus">Olympus</option>
                 <option value="Teleflex">Teleflex</option>
                 <option value="Others">Others</option>
              </Form.Control>
          </Form.Group>
        </div>
        {/* <div className="col-md-4">
          <Form.Group>
            <Form.Label>Insertion Body Part</Form.Label>
            <Form.Control
              as="select"
              value={newStentData.placeOfInsertion}
              onChange={(e) =>setNewStentData({
                  ...newStentData,
                  placeOfInsertion: e.target.value,
                })}>
               <option value="Kidney">Kidney</option>
              <option value="Ureter">Ureter</option>
               
                <option value="Bladder">Bladder</option>
              </Form.Control>
          </Form.Group>
        </div> */}
      </div>
      <br></br>
      <div className="row">
        <div className="col-md-12">
          <Form.Group>
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              type="text"
              value={newStentData.remarks}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  remarks: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
      </div>

      {/* Add other stent data fields */}
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => closeAddStentModal()}>
      Close
    </Button>
    <Button variant="primary" onClick={() => addStent()}>
      Add Stent
    </Button>
  </Modal.Footer>
</Modal>

  {/*Modal for replace add stent */}
  <Modal show={showReplaceAddStentModal} onHide={() => closeReplaceAddStentModal()}  dialogClassName="custom-modal">
   
       <Modal.Header closeButton>
  
    <Modal.Title>Replace Add Stent</Modal.Title>
  
</Modal.Header>

  <Modal.Body>
   <Form>
    
  
  
      <div className="row">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Case ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Case ID"
              value={newStentData.caseId}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  caseId: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>MRN NO</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter MRN NO"
              value={patientData.mrnNo}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  mrnNo: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
         
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Laterality</Form.Label>
            <Form.Control
              as="select"
              value={newStentData.laterality}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  laterality: e.target.value,
                })
              }
            >
              <option value="Left">Left</option>
              <option value="Right">Right</option>
              
            </Form.Control>
          </Form.Group>
        </div>
      </div>
<br></br>
      <div className="row">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Hospital Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Hospital Name"
              value={newStentData.hospitalName}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  hospitalName: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Insert Date</Form.Label>
            <Form.Control
              type="date"
              value={newStentData.insertedDate}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  insertedDate: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
        <Form.Group>
  <Form.Label>Due In</Form.Label>
  <Form.Control
    as="select"
    value={newStentData.dueDate}
    onChange={(e) => {
      const selectedValue = e.target.value;
      let days = 0;

      // Calculate the number of days based on the selected option
      switch (selectedValue) {
        case '2 weeks':
          days = 14;
          break;
        case '1 month':
          days = 30;
          break;
        case '2 months':
          days = 60;
          break;
        case '3 months':
          days = 90;
          break;
        case '6 months':
          days = 180;
          break;
        case '12 months':
          days = 365; // Approximated to 365 days for a year
          break;
        case 'permanent':
          days = 0; // You can set this to any specific value for "permanent"
          break;
        default:
          days = 0; // Default to 0 if none of the above options
      }

      // Update the "dueDate" and "length" fields
      setNewStentData({
        ...newStentData,
        dueDate: selectedValue,
        Due: days.toString(),
      });
    }}
  >
    <option value="2 weeks">2 weeks</option>
    <option value="1 month">1 month</option>
    <option value="2 months">2 months</option>
    <option value="3 months">3 months</option>
    <option value="6 months">6 months</option>
    <option value="12 months">12 months</option>
    <option value="permanent">Permanent</option>
  </Form.Control>
</Form.Group>
        </div>
      </div>
      <br></br>
      
      <div className="row">
      <div className="col-md-3">
          <Form.Group>
            <Form.Label>Doctor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Doctor Name"
              value={newStentData.doctor}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  doctor: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Size (fr)</Form.Label>
            <Form.Control
              type="number"
              value={newStentData.size}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  size: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Length (cm)</Form.Label>
            <Form.Control
              type="number"
              value={newStentData.length}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  length: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Stent Type</Form.Label>
            <Form.Control
              as="select"
              name="stentType"
              value={newStentData.stentType}
              onChange={handleStentTypeChange}
            >
              <option value="polyurethane">Polyurethane</option>
              <option value="silicon">Silicon</option>
              <option value="metallic">Metallic</option>
              <option value="others">Others</option>
            </Form.Control>
          </Form.Group>
        </div>
      </div>
   
      {newStentData.stentType === "others" && (
        <div className="row">
          <div className="col-md-12">
            <Form.Group>
              <Form.Label>Stent Type (Other)</Form.Label>
              <Form.Control
                type="text"
                name="stentTypeOther"
                placeholder="Specify the stent type"
                value={newStentData.stentTypeOther}
                onChange={handleStentTypeChange}
              />
            </Form.Group>
          </div>
        </div>
      )}
<br></br>
 
      <div className="row">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Stent Brand</Form.Label>
            <Form.Control
              as="select"
              value={newStentData.stentBrand}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  stentBrand: e.target.value,
                })
              }
            >
               <option value="Boston Scientific">Boston Scientific</option>
                 <option value="Cook Medical">Cook Medical</option>
                 <option value="Bard Medical">Bard Medical</option>
                 <option value="Olympus">Olympus</option>
                 <option value="Teleflex">Teleflex</option>
                 <option value="Others">Others</option>
              </Form.Control>
          </Form.Group>
        </div>
       
      </div>
      <br></br>
      <div className="row">
        <div className="col-md-12">
          <Form.Group>
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              type="text"
              value={newStentData.remarks}
              onChange={(e) =>
                setNewStentData({
                  ...newStentData,
                  remarks: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
      </div> 

     
    </Form>
   
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => closeReplaceAddStentModal()}>
      Close
    </Button>
    <Button variant="primary" onClick={() => replaceAddStent()}>
      Add Stent
    </Button>
  </Modal.Footer>
</Modal>


       {/*Modal for  delete */}
      
      <Modal
        show={showDeleteModal}
        onHide={() => closeDeleteModal()}
        contentlabel="Delete Stent"
        dialogClassName="custom-modal"
      >

        <Modal.Header closeButton>
          <Modal.Title>Delete Stent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {validationMessage && <div className="alert alert-danger">{validationMessage}</div>}
          <Form>
            <Row>
              <Col>
            <Form.Group>
              <Form.Label>Case ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Case ID"
                value={deleteInfo.caseId}
                onChange={(e) =>
                  setDeleteInfo({ ...deleteInfo, caseId: e.target.value })
                }
              />
            </Form.Group>
            </Col>
            <Col>
            <Form.Group>
              <Form.Label>Removal Doctor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Removal Doctor Name"
                value={deleteInfo.removedBy}
                onChange={(e) =>
                  setDeleteInfo({ ...deleteInfo, removedBy: e.target.value })
                }
              />
            </Form.Group>
            </Col>
            </Row>
            <br></br>
            <Row>
            <Col>
            <Form.Group>
              <Form.Label>Removal Date</Form.Label>
              <Form.Control
                type="date"
                value={deleteInfo.removalDate}
                onChange={(e) =>
                  setDeleteInfo({ ...deleteInfo, removalDate: e.target.value })
                }
              />
            </Form.Group>
            </Col>
            <Col>
            <Form.Group>
              <Form.Label>Removal Hospital</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Removal Hospital"
                value={deleteInfo.removalLocation}
                onChange={(e) =>
                  setDeleteInfo({
                    ...deleteInfo,
                    removalLocation: e.target.value,
                  })
                }
              />
            </Form.Group>
           </Col>
            </Row>
            <br></br>
            <Row>
            <Col>
            <Form.Group>
              <Form.Label>Laterality</Form.Label>
              <Form.Control
              as="select"
              value={deleteInfo.laterality}
              onChange={(e) =>
                setDeleteInfo({
                  ...deleteInfo,
                  laterality : e.target.value,
                })
                }
              >
            
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            
            </Form.Control>
            </Form.Group>

            
            </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeDeleteModal()}>
            Close
          </Button>
          <Button
            variant="primary"
          
            onClick={() => {
              submitDeleteModal(),  deleteStent(editStentIndex);
            }}
          >
            Delete Stent
          </Button>
        </Modal.Footer>
      </Modal>

 {/*Modal for  delete for replace */}
      <Modal
        show={showReplaceDeleteModal}
        onHide={() => closeReplaceDeleteModal()}
        contentlabel="Delete Stent"
      >
        <Modal.Header closeButton>
          <Modal.Title>Replace Delete Stent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Case ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Case ID"
                value={replaceDeleteInfo.caseId}
                onChange={(e) =>
                  setReplaceDeleteInfo({ ...replaceDeleteInfo, caseId: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Removal Doctor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Removal Doctor Name"
                value={replaceDeleteInfo.removedBy}
                onChange={(e) =>
                  setReplaceDeleteInfo({ ...replaceDeleteInfo, removedBy: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Removal Date</Form.Label>
              <Form.Control
                type="date"
                value={replaceDeleteInfo.removalDate}
                onChange={(e) =>
                  setReplaceDeleteInfo({ ...replaceDeleteInfo, removalDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Removal Hospital </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Removal Hospital"
                value={replaceDeleteInfo.removalLocation}
                onChange={(e) =>
                  setReplaceDeleteInfo({
                    ...replaceDeleteInfo,
                    removalLocation: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
  <Form.Label>Laterality</Form.Label>
  <Form.Control
    as="select"
    value={replaceDeleteInfo.laterality}
    onChange={(e) =>
      setReplaceDeleteInfo({
        ...replaceDeleteInfo,
        laterality: e.target.value,
      })
    }
  >
    <option value="Left">Left</option>
    <option value="Right">Right</option>
  </Form.Control>
</Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeReplaceDeleteModal()}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              submitReplaceDeleteModal(), replaceDeleteStent(editStentIndex);
            }}
            // 
          >
            Delete Stent
          </Button>
        </Modal.Footer>
      </Modal>

      
    </div>
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
      <h4>Stent Records</h4>
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
        {records.map((record, index) => {
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
       
        
      }}> <Container>
    
      <div> <div>
      <br></br>
        <h4>Remove Stent Records</h4>
        <Table striped bordered hover responsive >
          <thead>
            <tr>
             <th>No</th>
              <th>Case ID</th>
              <th>Hospital Name</th>
              <th>Laterality</th>
              <th>Removal Doctor Name</th>
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
  
     
      </Container></div>
      <br></br>
      <div  style={{
        background: '#fff',
         // Add padding as needed
         width: '90%',
         height: 'auto',
         // Add overflow property to make it scrollable if content exceeds the height
         borderRadius: '10px',
       
        
      }}> <Container>
     
  
     
  
      <div> <div>
      <br></br>
        <h4>Replace Stent Records</h4>
        <Table striped bordered hover responsive >
          <thead>
            <tr>
             <th>No</th>
              <th>Old Case ID</th>
              {/* <th>New Case ID</th> */}
              <th>Hospital Name</th>
              <th>Laterality</th>
              <th>Removal Doctor Name</th>
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
      </Container></div>
      <br></br>
    </div>
    </div>
  );
}

export default StentDataPage;
