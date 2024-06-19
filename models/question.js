const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    userId: 
    { 
        type: Schema.Types.ObjectId, ref: 'User', required: true 
    },
    question: 
    { 
        type: String, required: true 
    },
    answer: 
    { 
        type: String, required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
