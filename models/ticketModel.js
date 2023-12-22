const mongoose=require('mongoose');

const ticketSchema = new mongoose.Schema ({
    match: { type :mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    seat: [{type :Number ,required :true,trim: true}],
    price: {type :Number ,required :true,trim: true},
    user: { type :mongoose.Schema.Types.ObjectId, ref: 'User'},
},{timestamps: true});

const Ticket= mongoose.model('Ticket',ticketSchema);
module.exports = Ticket;