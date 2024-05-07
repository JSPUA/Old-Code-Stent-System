import mongoose from "mongoose";

// models/patient.js

const patientSchema = new mongoose.Schema({
    firstName: String,
    surname: String,
    dob: Date,
    mrnNo: String,
    icNo: String,
    gender: String,
    mobileNo: String,
    email: String,
    ethnicity: String,
    hospitalName: String,
    doctorName:String,
    password: String,
    profilePic: String,
    otp: String,
    verified: Boolean,
    nextOfKin: {
      firstName: String,
      surname: String,
      mobileNo: String,
    },
    stentData: [
      {
        caseId : String,
        laterality: String,
        hospitalName: String,
        insertedDate: Date,
        doctor: String,
        dueDate: String,
        size: String,
        length: String,
        stentType: String,
        stentBrand: String,
       
        remarks: String,
        notificationSent: {
          fourteenDayWarning: { type: Boolean, default: false },
          expired: { type: Boolean, default: false }
        },
        
        smsnotificationSent: {
          fourteenDayWarning: { type: Boolean, default: false },
          expired: { type: Boolean, default: false }
        },
      },
    ],
  });
  
  const Patient = mongoose.model('Patient', patientSchema);
  
  export default Patient;
  