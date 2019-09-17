

const mongoose = require("mongoose");
require('mongoose-type-url');

/* treasure item */
const itemSchema = mongoose.Schema(
    {
        "name":{
            type: String,
            required: true
        },
        "date": String,
        "owner": String,
        "keeper": String,
        "location": String,
        "description": String,
        "owner": String,
        "location": String,
        "description": String,
        "photo": String,
        "category":String,

    }
);

const messageSchema = mongoose.Schema(
    {
        "familyId" : String,
        "message" : String,

    }
);


/*user*/
const userSchema = mongoose.Schema(
    {
        "id": {
            type: String,
            required: true,
        },
        "username":{
            type: String,
            required: true
        },
        "email": {
            type: String,
            required: true,
        },
        "passwordHash": {
            type: String,
            required: true
        },
        "familyId1" : String,
        "familyId2" : String,
        "familyId3" : String,
        "currentFamily" : String,
    }
);


/*profiles*/
const profileSchema = mongoose.Schema(
    {
        "name": String,
        "birthday": String,
        "description": String,
        "life_story": String,
    }
);

module.exports = mongoose.model('item_tables', itemSchema);
module.exports = mongoose.model('message_tables', messageSchema);
module.exports = mongoose.model('account_tables', userSchema);
module.exports = mongoose.model('profile_tables', profileSchema);