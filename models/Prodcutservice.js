const mongoose =require('mongoose');

const ProductserviceSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    productServiceId : { type: String, required: true },
    productServiceName : { type: String, required: true },
    productServiceDescription : { type: String, required: true },
    productServiceProducerId : { type: String, required: true },
    productServiceProducerName : { type: String, required: true },
    productServiceCurrency : { type: String, required: true },
    productServiceUnitCost : { type: Number, required: true },
},{timestamps:true});

const Productservice = mongoose.model("Productservice", ProductserviceSchema);

module.exports = Productservice;
