import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Form,InputGroup,Navbar,Nav,NavDropdown,Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdOutlineDelete, MdOutlineEdit,MdOutlineSearch,MdOutlineAdd } from 'react-icons/md';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';
import { FaGlobe,FaSignInAlt,FaUser, FaWhatsapp } from 'react-icons/fa';
import { setUser } from '../pages/userAction.js';
import Navbars from '../pages/Navbar.jsx'

function ViewResearchList() {
  const [pdfData, setPDFData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const ResourcesdropdownRef = useRef(null);

  const handleResourcesMouseEnter = () => {
    setIsResourcesDropdownOpen(true);
  };

  const handleResourcesMouseLeave = () => {
    setIsResourcesDropdownOpen(false);
  };
 

  useEffect(() => {
    // Fetch PDF data when the component mounts
    axios
      .get('http://localhost:5555/pdf-upload')
      .then((response) => {
        setPDFData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching PDF data:', error);
      });
  }, []);

 

 
  const filteredPDFData = pdfData.filter((pdf) => {
    const titleMatch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || descriptionMatch;
  });

  return (
    <div style={{ background: "#f0f0f0", height: "100%"  }} >
     {/* <div><Navbars/></div> */}
     <div>  <Navbar expand="lg" className="bg-body-tertiary">
      
      <Navbar.Brand href="/">
      <Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} /> 
    </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">HOME</Nav.Link>
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            <Nav onMouseEnter={handleResourcesMouseEnter} onMouseLeave={handleResourcesMouseLeave}>
            <NavDropdown
        show={isResourcesDropdownOpen}
        title="RESOURCES"
        id="basic-nav-dropdown"
        ref={ResourcesdropdownRef}
      >
        <NavDropdown.Item href="#action/public">For Public</NavDropdown.Item>
        <NavDropdown.Item href="#action/hp">
          For Healthcare Professional
        </NavDropdown.Item>
      </NavDropdown>
      </Nav>
            {/* <Link to="/research"><Nav.Link to="/research">RESEARCH</Nav.Link></Link> */}
            <Nav.Link href="/viewResearchList" className="no-underline-link">RESEARCH</Nav.Link>            
          </Nav>
          
          
          
          <Nav onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <NavDropdown
        show={isDropdownOpen}
        title={(
        "LANGUAGE"
        )}
        id="basic-nav-dropdown"
        ref={dropdownRef}
      >
        <NavDropdown.Item href="#action/3.1">English</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">BM</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">华文</NavDropdown.Item>
      </NavDropdown>
    </Nav>
          
          <Nav>
  <Link to="/login">
    <Button
      variant="primary"
      style={{
        backgroundColor: isButtonHovered ? 'darkblue' : 'blue',
        color: 'white',
        width: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
    >
      <span>Login</span>
      <FaSignInAlt />
    </Button>
  </Link>
</Nav>
        </Navbar.Collapse>
      
     
    </Navbar></div>
     <br></br>
     <Container>
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
      <Row className="mt-3 mb-3">
        
        <Col md={7}>
         
          <h5>RESEARCH LIST</h5>
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
        <br></br>
        <Row>
          {filteredPDFData.map((pdf, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={4}>
              <Card className="mb-4" style={{ width: '350px', height: '800px' }}>
                <Card.Header>{pdf.title}</Card.Header>
                <Card.Img
                  variant="top"
                  src={`/pdf/${pdf.picture}`}
                  alt="Research Image"
                  style={{ width: '100%', height: '60%' }}
                />
                <Card.Body>
                  <Card.Text>{pdf.description}</Card.Text>
                </Card.Body>
                <div className="card-icons">
                  <Link to={`/pdf/${pdf._id}`}>
                    <div>
                     <MdOutlineSearch className="icon-large "/>
                     </div> 
                     </Link>
                  
                </div>
              </Card>



            </Col>
          ))}
        </Row>
        

      </Container>
    
     
  <Row className="mt-3 mb-3">
    {/* Your existing code for the header and search functionality */}
  </Row>
  <Container>
  {filteredPDFData.map((pdf, index) => (
   
      <Card style={{ width: '100%', borderRadius: '20px' }}>
        <Card.Header >{pdf.title}</Card.Header>
        <Card.Body>
          <Row>
            {/* Picture Column */}
            <Col md={3}>
              <Card.Img
                variant="top"
                src={`/pdf/${pdf.picture}`}
                alt="Research Image"
                style={{ width: '200px', height: '200px' }}
              />
            </Col>

            {/* Description Column */}
            <Col md={7} >
              <Card.Text>{pdf.description}</Card.Text>
            </Col>

            {/* Buttons Column */}
            <Col md={3} className="d-flex flex-column align-items-center">
           
</Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
        <Link to={`/pdf/${pdf._id}`}>
                    
                    <MdOutlineSearch className="icon-largeB "/>
                   
                    </Link>
                
        </Card.Footer>
      </Card>
   
  ))}
  </Container>


      {/* Delete Confirmation Modal */}
     
      </div>
      </Container>

<br></br>

    </div>
  );
}

export default ViewResearchList;
