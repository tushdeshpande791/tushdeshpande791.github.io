const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const portfolioschema= new Schema({
    ticker:{
        type: String,
        required: true
    },
    company_name:{
        type: String,
        required: true
    },
    num_of_stocks:{
        type: Number,
        required: true
    },
    totalcost:{
        type: Number,
        required: true
    }

}, {timestamps: true})

const Port=mongoose.model('portfolio',portfolioschema);
module.exports=Port;