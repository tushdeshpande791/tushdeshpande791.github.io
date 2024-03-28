const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const walletschema= new Schema({
    amount:{
        type: Number,
        required: true
    }

}, {timestamps: true})

const Wall=mongoose.model('wallet',walletschema);
module.exports=Wall;