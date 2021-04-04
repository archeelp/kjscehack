var mongoose =require("mongoose");
var appointmentSchema = new mongoose.Schema({
    doctorname : String,
    patientname : String,
    doctorcn : String,
    patientcn : String,
    time : String,
    description : String,
    prescription : String,
    billamount : String,
    fileuploads : [
        {
            type: String
        }
    ],
    status: {type: String, default: "NC"},
    bookingdate: {type: Date, default: Date.now},
    appointmentdate :{type: Date},
    doctorid:
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "user"
        },
    patientid:
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "user"
        },
    paid:{
        type:Boolean,
        default:false
    }
});
module.exports=mongoose.model("appointment", appointmentSchema);