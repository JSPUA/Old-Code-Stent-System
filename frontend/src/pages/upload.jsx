import React, { useState,useEffect } from "react";
import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css";
import { Link } from "react-router-dom";

function Upload() {
  const application = new FormData();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    surname: "",
    dob: "",
    icNo: "",
    gender: "",
    address: "",
    mobileNo: "",
    email: "",
    hospitalName: "",
    department: "",
    position: "",
    mmcRegistrationNo: "",
    photo: null,
    apc: null,
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  // useEffect(() => {
  //   getImage();
  // }, []);

  // const submitImage = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("image", image);
  //   formData.append("imageSecond", imageSecond);
  //   formData.append("username", username);
  //   formData.append("firstName", firstName);
  //   formData.append("surname", surname);
  //   formData.append("dob", dob);
  //   formData.append("icNo", icNo);
  //   formData.append("gender", gender);
  //   formData.append("address", address);
  //   formData.append("mobileNo", mobileNo);
  //   formData.append("email", email);
  //   formData.append("hospitalName", hospitalName);
  //   formData.append("department", department);
  //   formData.append("position", position);
  //   formData.append("mmcRegistrationNo", mmcRegistrationNo);

  //   const result = await axios.post(
  //     "http://localhost:5555/upload-image",
  //     formData,
  //     {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     }
  //   );

  //   // After successful image upload, update the state with the new image and username
  //   setAllImage([...allImage, { image: result.data.image, username }]);
  //   setShowSuccessModal(true);
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHospitalChange = (event) => {
    const selectedHospital = event.target.value;
    setFormData({
      ...formData,
      hospitalName: selectedHospital, // Update the hospitalName field
    });
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setFormData({
      ...formData,
      gender: selectedGender, // Update the hospitalName field
    });
  };

  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setFormData({
      ...formData,
      department: selectedDepartment, // Update the hospitalName field
    });
  };

  const handlePositionChange = (event) => {
    const selectedPosition = event.target.value;
    setFormData({
      ...formData,
      position: selectedPosition, // Update the hospitalName field
    });
  };

  const handlePhotoUpload = (e) => {
    const { files } = e.target;
    console.log("Photo file:", files[0]);
    setFormData({
      ...formData,
      photo: files[0],
    });
  };

  const handleCertificateUpload = (e) => {
    const { files } = e.target;
    setFormData({
      ...formData,
      apc: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    application.append("username", formData.username);
    application.append("firstName", formData.firstName);
    application.append("surname", formData.surname);
    application.append("dob", formData.dob);
    application.append("icNo", formData.icNo);
    application.append("gender", formData.gender);
    application.append("address", formData.address);
    application.append("mobileNo", formData.mobileNo);
    application.append("email", formData.email);
    application.append("hospitalName", formData.hospitalName);
    application.append("department", formData.department);
    application.append("position", formData.position);
    application.append("mmcRegistrationNo", formData.mmcRegistrationNo);
    application.append("photo", formData.photo);
    application.append("apc", formData.apc);

    console.log("mmc", application.get("address"));

    const response = await fetch("http://localhost:5555/api/userRegistration", {
      method: "POST",
      body: application,
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      const sendMail = await fetch("http://localhost:5555/api/mail/signup", {
        method: "POST",
        // Add any data you need to send in the body
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const secondJson = await sendMail.json();

      // Handle the response from the second API request
      console.log("Email sent", secondJson);

      handleShowModal();

      setFormData({
        username: "",
        firstName: "",
        surname: "",
        dob: "",
        icNo: "",
        gender: "",
        address: "",
        mobileNo: "",
        email: "",
        hospitalName: "",
        department: "",
        position: "",
        mmcRegistrationNo: "",
        photo: null,
        apc: null,
      });

      setError(null);
    }

    console.log("Application submitted", json);
  };


  

  return (
//     <div>
//       <Navbars/>
//       <div style={{ backgroundImage: "linear-gradient(#dfe3ee,#dfe3ee)", height: "100%"  }} className="d-flex flex-column justify-content-center align-items-center  ">
// <div style={{
//   backgroundImage: "#00d5ff"
// }}>
//  <br></br>
//  <br></br>
// </div>
//       <div  style={{
//         background: '#fff',
//          // Add padding as needed
//          width: '90%',
//          height: 'auto',
//          // Add overflow property to make it scrollable if content exceeds the height
//          borderRadius: '10px',
       
        
//       }}>   
    
//       <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//               <Card.Header style={{ position: 'relative', display: 'inline-block' }}>
                
//                 <div className="text-center">
//                   <Image
//                     src="./logo.png"
//                     alt="Logo"
//                     fluid
//                     style={{ width: '100px', height: 'auto' }}
//                     className="mx-auto"
//                   />
//                 </div>
//               </Card.Header>
//     <div className="card">
//       <div className="card-body">
//       <form onSubmit={submitImage} className="mb-3">
//   <div className="row">
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Username:</label>
//         <input
//           type="text"
//           placeholder="Enter Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>First Name:</label>
//         <input
//           type="text"
//           placeholder="First Name"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Surname:</label>
//         <input
//           type="text"
//           placeholder="Surname"
//           value={surname}
//           onChange={(e) => setSurname(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//   </div>
//   <br></br>
//   <div className="row">
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Date of Birth:</label>
//         <input
//           type="date"
//           placeholder="Date of Birth"
//           value={dob}
//           onChange={(e) => setDob(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>IC No:</label>
//         <input
//           type="number"
//           placeholder="IC No"
//           value={icNo}
//           onChange={(e) => setIcNo(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Gender</label>
//         <select
//           value={gender}
//           onChange={(e) => setGender(e.target.value)}
//           className="form-control"
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>
//       </div>
//     </div>
//   </div>
//   <br></br>
//   <div className="row">
//     <div className="col-md-6">
//       <div className="form-group">
//         <label>Address:</label>
//         <input
//           type="text"
//           placeholder="Address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     <div className="col-md-6">
//       <div className="form-group">
//         <label>Mobile Phone:</label>
//         <input
//           type="number"
//           placeholder="Mobile Phone No"
//           value={mobileNo}
//           onChange={(e) => setMobileNo(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//   </div>
//   <br></br>
//   <div className="row">
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Email:</label>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Name of Hospital:</label>
//         <input
//           type="text"
//           placeholder="Hospital Name"
//           value={hospitalName}
//           onChange={(e) => setHospitalName(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Department:</label>
//         <input
//           type="text"
//           placeholder="Department"
//           value={department}
//           onChange={(e) => setDepartment(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//   </div>
//   <br></br>
//   <div className="row">
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Position:</label>
//         <input
//           type="text"
//           placeholder="Position"
//           value={position}
//           onChange={(e) => setPosition(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
   
    
  
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>MMC Registration No:</label>
//         <input
//           type="text"
//           placeholder="MMC Registration No"
//           value={mmcRegistrationNo}
//           onChange={(e) => setMmcRegistrationNo(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </div>
//     </div>
//     <br></br>
//   <div className="row">
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>Profile photo:</label>
        
//         <input
//           type="file"
//           accept="image/*"
//           onChange={onInputChange}
//           className="form-control"
//         />
//       </div>
//     </div>
  

  
//     <div className="col-md-4">
//       <div className="form-group">
//         <label>APC Certificate:</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={onInputChangeSecond}
//           className="form-control"
//         />
//       </div>
//     </div>
//     </div>
  
//    <div className="d-flex justify-content-end" >
//   <button type="submit" className="btn btn-primary">
//     Submit
//   </button>
//   </div>
// </form>


//         <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
//           <Modal.Header closeButton>
//             <Modal.Title>Success</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="text-center">
//             <FontAwesomeIcon
//               icon={faExclamationTriangle}
//               style={{
//                 fontSize: "3rem",
//                 color: "orange",
//                 marginBottom: "1rem",
//               }}
//             />
//             <p>
//               You are successfully submit your form for verification. Once
//               verification is done, you will receive an email. Verification may
//               take around 5 working days.
//             </p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="primary" onClick={handleCloseSuccessModal}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </div>
//     </Card>
   
//     </div>
//     <br></br>
//     </div>
//     </div>

<Container
      fluid="md"
      className="container"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          padding: "20px",
        }}
      >
        Signup as Staff User
      </h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formGridusername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formGridFirstname">
              <Form.Label>First name</Form.Label>
              <Form.Control
                placeholder="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group as={Col} controlId="formGridSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                placeholder="Surname"
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <input
                type="date"
                placeholder="Enter Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </Col>

          <Form.Group as={Col} controlId="formGridIC">
            <Form.Label>IC Number</Form.Label>
            <Form.Control
              placeholder="012345100123"
              type="text"
              name="icNo"
              value={formData.icNo}
              onChange={handleInputChange}
            />
            </Form.Group>

<Form.Group as={Col} controlId="formGridGender">
  <Form.Label>Gender</Form.Label>
  <Form.Select value={formData.gender} onChange={handleGenderChange}>
    <option>Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </Form.Select>
</Form.Group>
</Row>

<Row className="mb-3">
<Col>
  <Form.Group controlId="formGridAddress">
    <Form.Label>Address</Form.Label>
    <Form.Control
      type="text"
      name="address"
      value={formData.address}
      onChange={handleInputChange}
    />
  </Form.Group>
</Col>
</Row>

<Row className="mb-3">
<Col>
  <Form.Group controlId="formGridMobile">
    <Form.Label>Mobile Number</Form.Label>
    <Form.Control
      placeholder="0123456789"
      type="text"
      name="mobileNo"
      value={formData.mobileNo}
      onChange={handleInputChange}
    />
  </Form.Group>
</Col>

<Col>
  <Form.Group controlId="formGridEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control
      placeholder="example@email.com"
      type="text"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
    />
  </Form.Group>
</Col>
</Row>

<Row className="mb-3">
<Col>
  <Form.Group controlId="formGridHospital">
    <Form.Label>Hospital</Form.Label>
    <Form.Select
      value={formData.hospitalName}
      onChange={handleHospitalChange}
    >
      <option>Select Hospital</option>
      <option value="HSAAS">HSAAS</option>
    </Form.Select>
  </Form.Group>
</Col>

<Col>
  <Form.Group controlId="formGridDepartment">
    <Form.Label>Department</Form.Label>
    <Form.Select
      value={formData.department}
      onChange={handleDepartmentChange}
    >
      <option>Select Department</option>
      <option value="Urology">Urology</option>
    </Form.Select>
  </Form.Group>
</Col>

<Col>
  <Form.Group controlId="formGridPosition">
    <Form.Label>Position/Designation</Form.Label>
    <Form.Select
      value={formData.position}
      onChange={handlePositionChange}
    >
      <option>Select Position</option>
      <option value="doctor">Doctor</option>
      <option value="admin">Admin</option>
      <option value="superAdmin">Super Admin</option>
    </Form.Select>
  </Form.Group>
</Col>
</Row>

<Row className="mb-3">
<Col>
  <Form.Group controlId="formGridMMC">
    <Form.Label>MMC Registration Number</Form.Label>
    <Form.Control
      type="text"
      name="mmcRegistrationNo"
      value={formData.mmcRegistrationNo}
      onChange={handleInputChange}
    />
  </Form.Group>
</Col>

<Col>
  <Form.Group>
    <Form.Label>Photo</Form.Label>
    <Form.Control
      type="file"
      name="photo"
      onChange={handlePhotoUpload}
    />
  </Form.Group>
</Col>

<Col>
  <Form.Group>
    <Form.Label>APC Certificate</Form.Label>
    <Form.Control
      type="file"
      name="apc"
      onChange={handleCertificateUpload}
    />
  </Form.Group>
</Col>
</Row>

<Button variant="primary" type="submit" style={{ marginRight: "10px" }}>
Submit
</Button>
<Link to="/login">
<Button variant="danger">Back</Button>
</Link>
</Form>

<Modal show={showModal} onHide={handleCloseModal}>
<Modal.Header closeButton>
<Modal.Title>Submission Successful</Modal.Title>
</Modal.Header>
<Modal.Body>Your form has been submitted successfully!</Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={handleCloseModal}>
  Close
</Button>
</Modal.Footer>
</Modal>
</Container>
);
}

export default Upload;
