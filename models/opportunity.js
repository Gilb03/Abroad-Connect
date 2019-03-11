var mongoose = require('mongoose');

var opportunitySchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    link: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
});
module.exports = mongoose.model('Opportunity', opportunitySchema);