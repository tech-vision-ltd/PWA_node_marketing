const mongoose =require('mongoose');

const BorrowerSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    borrowerCountryCode : { type: String, required: true },
    borrowerId : { type: String, required: true },
    borrowerEmailId : { type: String, required: true },
    borrowerFirstName : { type: String, required: true },
    borrowerLastName : { type: String, required: true },
    borrowerPhone : { type: String, required: true },
    borrowerTaxID : { type: String, required: true },
    borrowerStory : { type: String, required: true },
    borrowerAddressInformation : {
        streetNo : { type: String, required: true },
        streetName : { type: String, required: true },
        city : { type: String, required: true },
        provinceStateCode : { type: String, required: true },
        postalZipCode : { type: String, required: true },
        countryCode : { type: String, required: true },
    },
    borrowerCompanyName : { type: String, required: true },
    borrowerCompanyTaxID : { type: String, required: true },
    borrowerCompanyPhone : { type: String, required: true },
    borrowerCompanyWebsite : { type: String, required: true },
    borrowerCompanyContactName : { type: String, required: true },
    borrowerCompanyAddressInformation : {
        streetNo : { type: String, required: true },
        streetName : { type: String, required: true },
        city : { type: String, required: true },
        provinceStateCode : { type: String, required: true },
        postalZipCode : { type: String, required: true },
        countryCode : { type: String, required: true },
    },

},{timestamps:true});

const Borrower = mongoose.model("Borrower", BorrowerSchema);

module.exports = Borrower;
