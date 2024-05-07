import React, { useState, useEffect } from 'react';
import { VictoryArea,VictoryBar, VictoryChart, VictoryAxis, VictoryTheme,VictoryPie,VictoryTooltip,VictoryLabel } from 'victory';
import Navbars from './Navbar';
import { Container,Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const Example = () => {
  const [stentData, setStentData] = useState({ male: { expired: 0 }, female: { expired: 0 } });
  const [stentDataByAge, setStentDataByAge] = useState({});
  const [stentDataByEthnicity, setStentDataByEthnicity] = useState({});
  const [stentDataByHospital, setStentDataByHospital] = useState({});
  const [stentInsertionsByGender, setStentInsertionsByGender] = useState([]);
  const [stentInsertionsByEthnicity, setStentInsertionsByEthnicity] = useState([]);
  const [stentInsertionsByHospital, setStentInsertionsByHospital] = useState([]);
  const [stentInsertionsByAgeRange, setStentInsertionsByAgeRange] = useState([]);

  useEffect(() => {
    // Fetch stent data from your API
    const fetchStentData = async () => {
      try {
        const response = await fetch('http://localhost:5555/getFotgottenStentPatientsGender2');
        const data = await response.json();
        setStentData(data.stentStatusCounts);
      } catch (error) {
        console.error('Error fetching stent data:', error);
      }
    };

    

    

    fetchStentData();
  }, []);

  useEffect(() => {
    // Fetch stent data from your API
    const fetchStentDataByAge = async () => {
      try {
        const response2 = await fetch('http://localhost:5555/getFotgottenStentPatientsAge');
        const data = await response2.json();
        setStentDataByAge(data.stentStatusCountsByAge);
      } catch (error) {
        console.error('Error fetching stent data:', error);
      }
    };

    fetchStentDataByAge();
  }, []);

  useEffect(() => {
    // Fetch stent data by ethnicity from your API
    const fetchStentDataByEthnicity = async () => {
      try {
        const response = await fetch('http://localhost:5555/getForgottenStentPatientsByEthnicity');
        const data = await response.json();
        setStentDataByEthnicity(data.stentStatusCountsByEthnicity);
      } catch (error) {
        console.error('Error fetching stent data by ethnicity:', error);
      }
    };
  
    fetchStentDataByEthnicity();
  }, []);



  useEffect(() => {
    const fetchStentDataByHospital = async () => {
      try {
        const response = await fetch('http://localhost:5555/getForgottenStentPatientsByHospital');
        const data = await response.json();
        setStentDataByHospital(data.stentStatusCountsByHospital);
      } catch (error) {
        console.error('Error fetching stent data by hospital:', error);
      }
    };
  
    fetchStentDataByHospital();
  }, []);

  useEffect(() => {
    const fetchStentInsertionsByGender = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByGender');
        const data = await response.json();
        setStentInsertionsByGender(data);
      } catch (error) {
        console.error('Error fetching stent insertions by gender:', error);
      }
    };

    fetchStentInsertionsByGender();
  }, []);

  useEffect(() => {
    const fetchStentInsertionsByEthnicity = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByEthnicity');
        const data = await response.json();
        setStentInsertionsByEthnicity(data);
      } catch (error) {
        console.error('Error fetching stent insertions by ethnicity:', error);
      }
    };

    fetchStentInsertionsByEthnicity();
  }, []);


  useEffect(() => {
    const fetchStentInsertionsByHospital = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByHospital');
        const data = await response.json();
        setStentInsertionsByHospital(data);
      } catch (error) {
        console.error('Error fetching stent insertions by hospital:', error);
      }
    };

    fetchStentInsertionsByHospital();
  }, []);


  useEffect(() => {
    const fetchStentInsertionsByAgeRange = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByAgeRange');
        const data = await response.json();
        data.sort((a, b) => {
          // Assuming age ranges are strings like '0-10', '11-20', etc.
          const rangeA = parseInt(a._id.split('-')[0], 10);
          const rangeB = parseInt(b._id.split('-')[0], 10);
          return rangeA - rangeB;
        });
        setStentInsertionsByAgeRange(data);
      
      } catch (error) {
        console.error('Error fetching stent insertions by age range:', error);
      }
    };

    fetchStentInsertionsByAgeRange();
  }, []);

  //stentData.male.expired stentData.female.expired
  const stentChartData = [
    { gender: 'Male', expired: stentData.male.expired  },
    { gender: 'Female', expired:stentData.female.expired  },
  ];

  

  const stentAgeChartData = Object.keys(stentDataByAge).map((ageRange) => {
    return { ageRange, expired: stentDataByAge[ageRange] };
  });

  const stentEthnicityChartData = Object.keys(stentDataByEthnicity).map(ethnicity => {
    return { ethnicity, expired: stentDataByEthnicity[ethnicity] };
  });

  const stentHospitalChartData = Object.keys(stentDataByHospital).map(hospital => {
    return { hospital, expired: stentDataByHospital[hospital] };
  });

  const stentInsertionsChartData = stentInsertionsByGender.map(item => {
    return { gender: item._id, count: item.count };
  });

  const stentInsertionsEthnicityChartData = stentInsertionsByEthnicity.map(item => {
    return { ethnicity: item._id, count: item.count };
  });

  const stentInsertionsHospitalChartData = stentInsertionsByHospital.map(item => {
    return { hospital: item._id, count: item.count };
  });

  const stentInsertionsAgeChartData = stentInsertionsByAgeRange.map(item => {
    return { ageRange: item._id, count: item.count };
  });

  const handleGenerateReport = () => {
    let reportContent = "Stent Insertion Data Report\n\n";

    reportContent += "Stent Insertions by Gender:\n";
    stentInsertionsByGender.forEach(item => {
      reportContent += `${item._id}: ${item.count}\n`;
    });

    reportContent += "Stent Insertions by Ethnicity:\n";
    stentInsertionsByEthnicity.forEach(item => {
      reportContent += `${item._id}: ${item.count}\n`;
    });

    reportContent += "Stent Insertions by Hospital:\n";
    stentInsertionsByHospital.forEach(item => {
      reportContent += `${item._id}: ${item.count}\n`;
    });

    reportContent += "Stent Insertions by Hospital:\n";
    stentInsertionsByAgeRange.forEach(item => {
      reportContent += `${item._id}: ${item.count}\n`;
    });

    reportContent += "\nExpired Stent Data by Gender:\n";
  stentChartData.forEach(item => {
    reportContent += `${item.gender}: ${item.expired}\n`;
  });

  // Adding stentAgeChartData
  reportContent += "\nExpired Stent Data by Age Range:\n";
  stentAgeChartData.forEach(item => {
    reportContent += `${item.ageRange}: ${item.expired}\n`;
  });

  // Adding stentEthnicityChartData
  reportContent += "\nExpired Stent Data by Ethnicity:\n";
if (stentEthnicityChartData.length > 0) {
  stentEthnicityChartData.forEach(item => {
    reportContent += `${item.ethnicity}: ${item.expired}\n`;
  });
} else {
  reportContent += "Data is null\n";
}

// Adding stentHospitalChartData
reportContent += "\nExpired Stent Data by Hospital:\n";
if (stentHospitalChartData.length > 0) {
  stentHospitalChartData.forEach(item => {
    reportContent += `${item.hospital}: ${item.expired}\n`;
  });
} else {
  reportContent += "Data is null\n";
}

    // Add other sections similarly...
    // For example, stent insertions by ethnicity, age range, etc.

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "StentDataReport.txt";
    link.click();
  };


  // const handleGenerateExcel = () => {
  //   // Prepare data for Excel
  //   let dataForExcel = [];
  
  //   // Stent Insertions by Gender
  //   dataForExcel.push(["Stent Insertions by Gender"]);
  //   stentInsertionsByGender.forEach(item => {
  //     dataForExcel.push([item._id, item.count]);
  //   });
  
  //   // ... add other sections similarly ...
  
  //   // Stent Insertions by Hospital
  //   dataForExcel.push(["Stent Insertions by Hospital"]);
  //   stentInsertionsByHospital.forEach(item => {
  //     dataForExcel.push([item._id, item.count]);
  //   });
  
  //   // Expired Stent Data by Gender
  //   dataForExcel.push(["Expired Stent Data by Gender"]);
  //   stentChartData.forEach(item => {
  //     dataForExcel.push([item.gender, item.expired]);
  //   });
  
  //   // ... continue for other data sets ...
  
  //   // Create a new workbook and a worksheet
  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.aoa_to_sheet(dataForExcel);
  
  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "Report");
  
  //   // Generate Excel file and download
  //   XLSX.writeFile(wb, "StentDataReport.xlsx");
  // };

  // const handleGenerateExcel = () => {
  //   let dataForExcel = [];
  
  //   // Stent Insertions by Gender
  //   let genderData = [["Gender", "Count"]];
  //   stentInsertionsByGender.forEach(item => {
  //     genderData.push([item._id, item.count]);
  //   });
  //   dataForExcel.push(...genderData, [""]); // Add a blank row for separation
  
  //   // ... add other sections similarly ...
  
  //   // Stent Insertions by Hospital
  //   let hospitalData = [["Hospital", "Count"]];
  //   stentInsertionsByHospital.forEach(item => {
  //     hospitalData.push([item._id, item.count]);
  //   });
  //   dataForExcel.push(...hospitalData, [""]); // Add a blank row for separation
  
  //   // Expired Stent Data by Gender
  //   let expiredGenderData = [["Gender", "Expired Count"]];
  //   stentChartData.forEach(item => {
  //     expiredGenderData.push([item.gender, item.expired]);
  //   });
  //   dataForExcel.push(...expiredGenderData, [""]); // Add a blank row for separation
  
  //   // ... continue for other data sets ...
  
  //   // Create a new workbook and a worksheet
  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.aoa_to_sheet(dataForExcel);
  
  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "Report");
  
  //   // Generate Excel file and download
  //   XLSX.writeFile(wb, "StentDataReport.xlsx");
  // };
  
  const handleGenerateExcel = () => {
    
    const wb = XLSX.utils.book_new();
  
   
    let genderData = [["Gender", "Count"]];
    stentInsertionsByGender.forEach(item => {
      genderData.push([item._id, item.count]);
    });
    let wsGender = XLSX.utils.aoa_to_sheet(genderData);
    XLSX.utils.book_append_sheet(wb, wsGender, "Stent Insertions by Gender");
  
   
    let hospitalData = [["Hospital", "Count"]];
    stentInsertionsByHospital.forEach(item => {
      hospitalData.push([item._id, item.count]);
    });
    let wsHospital = XLSX.utils.aoa_to_sheet(hospitalData);
    XLSX.utils.book_append_sheet(wb, wsHospital, "Stent Insertions by Hospital");

    // let ageData = [["Age", "Count"]];
    // stentInsertionsByAgeRange.forEach(item => {
    //   hospitalData.push([item._id, item.count]);
    // });
    // let wsAge = XLSX.utils.aoa_to_sheet(ageData);
    // XLSX.utils.book_append_sheet(wb, wsAge, "Stent Insertions by Age");

    // let ethnicityData = [["Ethnicity", "Count"]];
    // stentInsertionsByEthnicity.forEach(item => {
    //   hospitalData.push([item._id, item.count]);
    // });
    // let wsEthnicity = XLSX.utils.aoa_to_sheet(ethnicityData);
    // XLSX.utils.book_append_sheet(wb, wsEthnicity, "Stent Insertions by Ethnicity");
  
    const insertionsEthnicityDataSheet = XLSX.utils.json_to_sheet(stentInsertionsEthnicityChartData);
    XLSX.utils.book_append_sheet(wb, insertionsEthnicityDataSheet, "Insertions by Ethnicity");
  
    const insertionsAgeDataSheet = XLSX.utils.json_to_sheet(stentInsertionsAgeChartData);
    XLSX.utils.book_append_sheet(wb, insertionsAgeDataSheet, "Insertions by Age Range");


    // Expired Stent Data by Gender
    let expiredGenderData = [["Gender", "Expired Count"]];
    stentChartData.forEach(item => {
      expiredGenderData.push([item.gender, item.expired]);
    });
    let wsExpiredGender = XLSX.utils.aoa_to_sheet(expiredGenderData);
    XLSX.utils.book_append_sheet(wb, wsExpiredGender, "Expired Stent Data by Gender");

    const ageDataSheet = XLSX.utils.json_to_sheet(stentAgeChartData);
    XLSX.utils.book_append_sheet(wb, ageDataSheet, "Expired Stent Data by Age");
  
    const ethnicityDataSheet = XLSX.utils.json_to_sheet(stentEthnicityChartData);
    XLSX.utils.book_append_sheet(wb, ethnicityDataSheet, "Expired Stent Data by Ethnicity");
  
    const hospitalDataSheet = XLSX.utils.json_to_sheet(stentHospitalChartData);
    XLSX.utils.book_append_sheet(wb, hospitalDataSheet, "Expired Stent Data by Hospital");
  
    // ... continue for other data sets, creating a new worksheet for each ...
  
    // Generate Excel file and download
    XLSX.writeFile(wb, "StentDataReport.xlsx");
  };
  
  

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
<h1>Stent Insertion and Expiration Analysis</h1>
<div className="d-flex justify-content-end ml-auto">
        <Button onClick={handleGenerateExcel} style={{ margin: '20px', padding: '10px' }}>
          Generate Excel Report
        </Button>
        </div>

<div style={{ display: 'flex', justifyContent: 'space-around' }}>
  
<div style={{ maxWidth: '800px', maxHeight: '500px', background: "white", borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}>
          <VictoryLabel 
            text="Stent Insertions by Gender" 
            x={200} 
            y={30} 
            textAnchor="middle"
            style={{ fontSize: 20 }}
          />
          <VictoryPie
           animate={{
            duration: 2000, // Duration of the animation in milliseconds
            easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
          }}
            padAngle={({ datum }) => 6}
            data={stentInsertionsChartData}
            innerRadius={50}
            x="gender"
            y="count"
            colorScale={["cyan", "tomato"]}
            labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.gender}: ${datum.count}`}
            style={{
                data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
                labels: { fontSize: 14, fill: "black" },
                parent: { maxWidth: '100%' }
            }}
          />
        </div>

        <div style={{ maxWidth: '800px', maxHeight: '500px', background: "white", borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}>
          <VictoryLabel 
            text="Stent Insertions by Ethnicity" 
            x={200} 
            y={30} 
            textAnchor="middle"
            style={{ fontSize: 20 }}
          />
          <VictoryPie
           animate={{
            duration: 2000, // Duration of the animation in milliseconds
            easing: "quad" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
          }}
            padAngle={({ datum }) => 6}
            data={stentInsertionsEthnicityChartData}
            innerRadius={50}
            x="ethnicity"
            y="count"
            colorScale={"cool"}
            labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.ethnicity}: ${datum.count}`}
            style={{
                data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
                labels: { fontSize: 14, fill: "black" },
                parent: { maxWidth: '100%' }
            }}
          />
        </div>


  

  </div>
  <br></br>
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      
        <div style={{ maxWidth: '800px', maxHeight: '500px', background: "white", borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}>
          <VictoryLabel 
            text="Stent Insertions by Hospital" 
            x={200} 
            y={30} 
            textAnchor="middle"
            style={{ fontSize: 20 }}
          />
          <VictoryPie
           animate={{
            duration: 2000, // Duration of the animation in milliseconds
            easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
          }}
            padAngle={({ datum }) => 6}
            data={stentInsertionsHospitalChartData}
            innerRadius={50}
            x="hospital"
            y="count"
            colorScale={"warm"}
            labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.hospital}: ${datum.count}`}
            style={{
                data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
                labels: { fontSize: 14, fill: "black" },
                parent: { maxWidth: '100%' }
            }}
          />
        </div>

        <div style={{ maxWidth: '800px', maxHeight: '500px', background: "white", borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}>
        <VictoryLabel 
          text="Stent Insertions by Age Range" 
          x={400} // Adjusted for center alignment
          y={30} 
          textAnchor="middle"
          style={{ fontSize: 20 }}
        />
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme.material}
          style={{ parent: { maxWidth: '100%' } }}
        >
          <VictoryAxis
            // You can use tickValues and tickFormat if you want specific labels on the x-axis
            label="Age Range"
            style={{
              axisLabel: { padding: 30 },
              tickLabels: { fontSize: 12, padding: 5, angle: -45 } // Angle the labels for better readability
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Count"
            style={{
              axisLabel: { padding: 40 },
              tickLabels: { fontSize: 12, padding: 5 }
            }}
          />
          <VictoryBar
            data={stentInsertionsAgeChartData}
            x="ageRange"
            y="count"
            labelComponent={<VictoryTooltip flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.ageRange}: ${datum.count}`}
            style={{
              data: { fill: "blue" }
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
          />
        </VictoryChart>
      </div>
    
      </div>

      




      <h1>Expired Stent Data Analysis</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
  

      
      <div style={{ maxWidth: '800px',maxHeight: '500px',background: "white" , borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}> 
      <VictoryLabel 
        text="No. of Forgotten Stent Removement Patient by Gender" 
        x={200} 
        y={30} 
        textAnchor="middle"
        style={{ fontSize: 20 }}
      />
<VictoryPie
 animate={{
  duration: 2000, // Duration of the animation in milliseconds
  easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
}}
 padAngle={({ datum }) => 6}
        data={stentChartData}
        innerRadius={50}
        x="gender"
        y="expired"
        
        
        colorScale={["cyan", "tomato"]}
       
        labelComponent={<VictoryTooltip 
            style={{ fontSize: 30 }} // Set the font size for the tooltip text here
            flyoutStyle={{ stroke: "none", fill: "white" }} />}

        labels={({ datum }) => `${datum.gender}: ${datum.expired}`}
        style={{
            data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
            labels: { fontSize: 14, fill: "black" },
            parent: { maxWidth: '100%' }
          }}
      />
      </div>

      <div style={{ maxWidth: '800px' ,maxHeight: '500px', background: "white", borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}>
      <VictoryLabel 
          text="No. of Forgotten Stent Removement Patient by Age" 
          x={200} 
          y={30} 
          textAnchor="middle"
          style={{ fontSize: 25 }}
        />

      <VictoryChart
      
        domainPadding={20}
        theme={VictoryTheme.material}
        style={{ parent: { maxWidth: '100%' } }}
      >
       

        <VictoryAxis
          tickValues={stentAgeChartData.map(data => data.ageRange)}
          tickFormat={stentAgeChartData.map(data => data.ageRange)}
          label="Age Range"
          style={{
            axisLabel: { padding: 30 },
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />

        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (`${x}`)}
          label="No. of Forgotten Stent Removement Patients"
          style={{
            axisLabel: { padding: 40 },
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />

        <VictoryBar
          data={stentAgeChartData}
          x="ageRange"
          y="expired"
          labelComponent={<VictoryTooltip flyoutStyle={{ stroke: "none", fill: "white" }}/>}
          labels={({ datum }) => `${datum.ageRange}: ${datum.expired}`}
          style={{ data: { fill: "tomato" } }}
        />
      </VictoryChart>
      </div>
    
      </div>
<br></br>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ maxWidth: '800px', maxHeight: '500px', background: "white", borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}>
  <VictoryLabel 
    text="No. of Forgotten Stent Removement Patient by Ethnicity" 
    x={200} 
    y={30} 
    textAnchor="middle"
    style={{ fontSize: 20 }}
  />
  <VictoryPie
   animate={{
    duration: 2000, // Duration of the animation in milliseconds
    easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
  }}
    padAngle={({ datum }) => 6}
    data={stentEthnicityChartData}
    innerRadius={50}
    x="ethnicity"
    y="expired"
    colorScale={"cool"}
    labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
    labels={({ datum }) => `${datum.ethnicity}: ${datum.expired}`}
    style={{
        data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
        labels: { fontSize: 14, fill: "black" },
        parent: { maxWidth: '100%' }
    }}
  />
</div>
      <div style={{ maxWidth: '800px', maxHeight: '500px', background: "white", borderRadius: "20px", boxShadow:" 0px 4px 8px rgba(0, 0, 0, .1)" }}>
  <VictoryLabel 
    text="No. of Forgotten Stent Removement Patient by Hospital" 
    x={200} 
    y={30} 
    textAnchor="middle"
    style={{ fontSize: 20 }}
  />
  <VictoryPie
   animate={{
    duration: 2000, // Duration of the animation in milliseconds
    easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
  }}
    padAngle={({ datum }) => 6}
    data={stentHospitalChartData}
    innerRadius={50}
    x="hospital"
    y="expired"
    colorScale={"warm"}
    labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
    labels={({ datum }) => `${datum.hospital}: ${datum.expired}`}
    style={{
        data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
        labels: { fontSize: 14, fill: "black" },
        parent: { maxWidth: '100%' }
    }}
  />
</div>
    
</div>
</Container> 
<br></br>
    </div>
    <br></br>
    <br></br>
    </div>
    </div>
  );
};

export default Example;
