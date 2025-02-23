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
        "keeper": String,
        "location": String,
        "description": String,
        "owner": String,
        "category":String,
        "familyId": String,
        "image": String,
        "video": String
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
        "year": Number,
        "month": Number,
        "day": Number,
        "description": String,
        "life_story": String,
        "year_passed": String,
        "familyId": String,
        "image": String,
        "video": String
    }
);

/*profiles*/
const familyPhotoSchema = mongoose.Schema(
    {
        "path": String,
        "family_id": String
    }
);

const profilePhotoSchema = mongoose.Schema(
    {
        "path": String,
        "user_id": String
    }
);

/*family*/
const familySchema = mongoose.Schema(
    {
        "name": String,
        "id": String,
        "pwd": String,
    }
);


module.exports = mongoose.model('item_tables', itemSchema);
module.exports = mongoose.model('message_tables', messageSchema);
module.exports = mongoose.model('account_tables', userSchema);
module.exports = mongoose.model('profile_tables', profileSchema);
module.exports = mongoose.model('familyPhoto_tables', familyPhotoSchema);
module.exports = mongoose.model('profilePhoto_tables', profilePhotoSchema);
module.exports = mongoose.model('family_tables', familySchema);