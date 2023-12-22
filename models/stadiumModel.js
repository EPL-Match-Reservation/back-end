const mongoose=require('mongoose');


const stadiumSchema = new mongoose.Schema ({
    image : {type: String},
    name: {type :String ,required :true,trim: true,unique: true},
    location: {type :String ,required :true,trim: true},
    capacity: {type: Number,required :true},
    rows: {type: Number},
    columns: {type: Number},
    
},{timestamps: true});


const Stadium= mongoose.model('Stadiums',stadiumSchema);
module.exports = Stadium;