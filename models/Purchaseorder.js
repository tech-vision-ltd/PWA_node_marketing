const mongoose =require('mongoose');

const PurchaseorderSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    purchaseOrderCountryCode : { type: String, required: true },
    purchaseOrderId : { type: String, required: true },
    purchaseOrderBuyerId : { type: String, required: true },
    purchaseOrderEffectiveDate : { type: String, required: true },
    productServiceUnitCost : [ String ],
},{timestamps:true});

const Purchaseorder = mongoose.model("Purchaseorder", PurchaseorderSchema);

module.exports = Purchaseorder;
