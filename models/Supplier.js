const mongoose =require('mongoose');

const SupplierSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    supplierCountryCode : { type: String, required: true },
    supplierId : { type: String, required: true },
    supplierFirstName : { type: String, required: true },
    supplierLastName : { type: String, required: true },
    supplierEmailId : { type: String, required: true },
    supplierPhone : { type: Number, required: true },
    supplierAddressInformation : {
        streetNo : { type: String, required: true },
        streetName : { type: String, required: true },
        city : { type: String, required: true },
        provinceStateCode : { type: String, required: true },
        postalZipCode : { type: String, required: true },
        countryCode : { type: String, required: true },
    },
    supplierCompanyName : { type: String, required: true },
    supplierCompanyTaxID : { type: String, required: true },
    supplierCompanyPhone : { type: Number, required: true },
    supplierCompanyWebsite : { type: String, required: true },
    supplierCompanyContactName : { type: String, required: true },
    supplierCompanyAddressInformation : {
        streetNo : { type: String, required: true },
        streetName : { type: String, required: true },
        city : { type: String, required: true },
        provinceStateCode : { type: String, required: true },
        postalZipCode : { type: String, required: true },
        countryCode : { type: String, required: true },
    },

},{timestamps:true});

const Supplier = mongoose.model("Supplier", SupplierSchema);

module.exports = Supplier;
