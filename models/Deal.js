const mongoose =require('mongoose');

const DealSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    dealCountryCode : { type: String, required: true },
    dealId : { type: String, required: true },
    dealTitle : { type: String, required: true },
    dealBorrowerId : { type: String, required: true },
    dealCurrency : { type: String, required: true },
    dealAmountRequired : { type: Number, required: true },
    dealAmountFunded : { type: String, required: true },
    dealExpectedMargin : { type: String, required: true },
    dealType : { type: String, required: true },
    dealDateExpected : { type: String, required: true },
    dealCostPerUnit : { type: String, required: true },
    dealSalePricePerUnit : { type: String, required: true },
    dealNumberUnits : { type: Number, required: true },
    dealDateDeadline : { type: Date, required: true },
    dealLenders : [{
        lenderId : { type: String, required: true },
        amountToFund : { type: String, required: true },
    }],
    dealSuppliers : [String],
    dealBuyers : [String],
    dealPurchaseOrders : [String],

},{timestamps:true});

const Deal = mongoose.model("Deal", DealSchema);

module.exports = Deal;
