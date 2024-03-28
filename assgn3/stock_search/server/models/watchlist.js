const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const watchlistschema= new Schema({
    ticker:{
        type: String,
        required: true
    },
    company_name:{
        type: String,
        required: true
    }
}, {timestamps: true})

const Watch=mongoose.model('watchlist',watchlistschema);
module.exports=Watch;   