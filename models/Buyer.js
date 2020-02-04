const mongoose =require('mongoose');

const BuyerSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    buyerCountryCode : { type: String, required: true },
    buyerId : { type: String, required: true },
    buyerFirstName : { type: String, required: true },
    buyerLastName : { type: String, required: true },
    buyerEmailId : { type: String, required: true },
    buyerPhone : { type: Number, required: true },
    buyerAddressInformation : {
        streetNo : { type: String, required: true },
        streetName : { type: String, required: true },
        city : { type: String, required: true },
        provinceStateCode : { type: String, required: true },
        postalZipCode : { type: String, required: true },
        countryCode : { type: String, required: true },
    },
    buyerCompanyName : { type: String, required: true },
    buyerCompanyTaxID : { type: String, required: true },
    buyerCompanyPhone : { type: Number, required: true },
    buyerCompanyWebsite : { type: String, required: true },
    buyerCompanyContactName : { type: String, required: true },
    buyerCompanyAddressInformation : {
        streetNo : { type: String, required: true },
        streetName : { type: String, required: true },
        city : { type: String, required: true },
        provinceStateCode : { type: String, required: true },
        postalZipCode : { type: String, required: true },
        countryCode : { type: String, required: true },
    },
    
},{timestamps:true});

const Buyer = mongoose.model("Buyer", BuyerSchema,'buyers');

module.exports = Buyer;
