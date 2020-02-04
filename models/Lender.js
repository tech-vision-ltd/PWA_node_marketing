const mongoose =require('mongoose');

const LenderSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    lenderCountryCode : { type: String, required: true },
    lenderId : { type: String, required: true },
    lenderEmailId : { type: String, required: true },
    lenderFirstName : { type: String, required: true },
    lenderLastName : { type: String, required: true },
},{timestamps:true});

const Lender = mongoose.model("Lender", LenderSchema);

module.exports = Lender;
