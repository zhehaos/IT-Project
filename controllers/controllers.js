//import modules
var express = require('express');
var formidable = require("formidable");
var fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
mongoose.set('useFindAndModify', false);
//these are from items.js
const Items = mongoose.model('item_tables');
const Users = mongoose.model('account_tables');
const Profiles = mongoose.model('profile_tables');
const Message = mongoose.model('message_tables');
const FamilyPhotos = mongoose.model('familyPhoto_tables');
const Family = mongoose.model('family_tables');
var current_user_id;

/** Storage Engine */
const storageEngine = multer.diskStorage({
    destination: './public/files',
    filename: function(req, file, fn){
        fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
    }
});

const search = function(req, res) {
    console.log("called search function");
    Items.find({ $and: [{ name: { '$regex': req.body.searchText, $options: 'is' }}, {familyId: req.session.user.currentFamily}]}, function(err, items) {
        if (err) throw err;
        res.render(path.join(__dirname, '../views/artifacts_test.jade'), {item : items});
});
};

const upload =  multer({
    storage: storageEngine,
    limits: { fileSize:200000 },
    fileFilter: function(req, file, callback){
        validateFile(file, callback);
    }
}).single('photo');

const validateFile = function(file, cb ){
    allowedFileTypes = /jpeg|jpg|png|gif/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType  = allowedFileTypes.test(file.mimetype);
    if(extension && mimeType){
        return cb(null, true);
    }else{
        cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
}

//edit an item
const updateItem = function(req, res) {
    console.log("editItem function called");
    console.log("name: " + req.body.name);
    console.log("id: " + req.body.id);
    if(req.body.name) {
        console.log("update item's name");
        Items.updateOne({_id: req.body.id}, {name: req.body.name}, function(err, suc){
            if(err){
                console.log("edit name fail");
            }else{
                console.log("edit name successful");
            }
        });
    }
    if(req.body.date){
        Items.updateOne({_id: req.body.id}, {date: req.body.date}, function(err, suc){
            if(err){
                console.log("edit date fail");
            }else{
                console.log("edit date successful");
            }
        });
    }
    if(req.body.keeper){
        Items.updateOne({_id: req.body.id}, {keeper: req.body.keeper}, function(err, suc){
            if(err){
                console.log("edit keeper fail");
            }else{
                console.log("edit keeper successful");
            }
        });
    }
    if(req.body.location){
        Items.updateOne({_id: req.body.id}, {location: req.body.location}, function(err, suc){
            if(err){
                console.log("edit location fail");
            }else{
                console.log("edit location successful");
            }
        });
    }
    if(req.body.description){
        Items.updateOne({_id: req.body.id}, {description: req.body.description}, function(err, suc){
            if(err){
                console.log("edit description fail");
            }else{
                console.log("edit description successful");
            }
        });
    }
    if(req.body.owner){
        Items.updateOne({_id: req.body.id}, {owner: req.body.owner}, function(err, suc){
            if(err){
                console.log("edit owner fail");
            }else{
                console.log("edit owner successful");
            }
        });
    }
    if(req.body.category){
        Items.updateOne({_id: req.body.id}, {category: req.body.category}, function(err, suc){
            if(err){
                console.log("edit category fail");
            }else{
                console.log("edit category successful");
            }
        });
    }
    console.log('edit finished');
    showArtifacts(req, res);
};

//delete an item
const deleteItem = function(req, res) {
    console.log("deleteItem function called");
    var itemID = req.params.id;
    Items.remove(
        {_id:itemID}, function(err, items) {
            console.log(itemID);
            //if deletion has failed, print error message
            if (err) {
                console.log("called deleteItem but error");
                console.log(err);
            }
            //if deletion has succeeded, refresh item page
            else {
                console.log("called deleteItem, deletion succeed and trying to direct to artifacts page");
            }
        });
};

//edit an profile
const updateProfile = function(req, res) {
    console.log("editProfile function called");
    if(req.body.name) {
        console.log("update profile's name");
        Profiles.updateOne({_id: req.body.id}, {name: req.body.name}, function(err, suc){
            if(err){
                console.log("edit name fail");
            }else{
                console.log("edit name successful");
            }
        });
    }
    if(req.body.life_story){
        Profiles.updateOne({_id: req.body.id}, {life_story: req.body.life_story}, function(err, suc){
            if(err){
                console.log("edit life_story fail");
            }else{
                console.log("edit life_story successful");
            }
        });
    }
    if(req.body.description){
        Profiles.updateOne({_id: req.body.id}, {description: req.body.description}, function(err, suc){
            if(err){
                console.log("edit description fail");
            }else{
                console.log("edit description successful");
            }
        });
    }
    console.log('edit finished');
    showProfiles(req, res);
};

//delete a profile
const deleteProfile = function(req, res) {
    console.log("deleteProfile function called");
    var profileID = req.params.id;
    Profiles.remove(
        {_id:profileID}, function(err, profiles) {
            console.log(profileID);
            //if deletion has failed, print error message
            if (err) {
                console.log("called deleteProfile but error");
                console.log(err);
            }
            //if deletion has succeeded, refresh item page
            else {
                console.log("called deleteProfile, deletion succeed and trying to direct to family page");
            }
        });
};

/*show artifacts page*/
const showArtifacts = function (req, res) {
    console.log("trying to go artifacts page");
    if (req.session && req.session.user) Users.findOne({id: req.session.user.id}, function (err, user) {
        console.log("in validateUser: user ="+user);
        if (!user) {
            // if the user isn't found in the DB, reset the session info and
            // redirect the user to the login page
            req.session.reset();
            res.redirect('/');
        } else {
            console.log(user);
            res.locals.user = user;
            console.log("in validating function, validation successed");
            Items.find({familyId: user.currentFamily}, function (err, items) {
                if (!err) {
                    console.log("currently  on artifacts page");
                    console.log(items);
                    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
                    //if user has no family
                    if(user.currentFamily == 'noFamily'){
                        console.log("no artifact to be shown");
                        res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                                "yet, so you may now join or create a family.", returnPage:"account"});
                    }
                    else{
                        res.render(path.join(__dirname, '../views/artifacts_test.jade'), {item : items});
                    }
                } else {
                    res.sendStatus(400);
                }
            });
        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }

};

/*show profiles page*/
const showProfiles = function (req, res) {
    console.log("trying to go family page");
    if (req.session && req.session.user) Users.findOne({email: req.session.user.email}, function (err, user) {
        console.log("in validateUser: user ="+user);
        if (!user) {

            // if the user isn't found in the DB, reset the session info and
            // redirect the user to the login page
            req.session.reset();
            res.redirect('/');
        } else {
            console.log(user);
            res.locals.user = user;
            console.log("in validating function, validation successed");
            Profiles.find({familyId: user.currentFamily}, function (err, profiles){
                if (!err) {
                    console.log("currently on family page");
                    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
                    //if user has no family
                    if(user.currentFamily == 'noFamily'){
                        console.log("no profile to be shown");
                        res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                                "yet, so you may now join or create a family.", returnPage:"account"});
                    }
                    //if user has family
                    else{
                        console.log("profiles need to be shown");
                        res.render(path.join(__dirname, '../views/family_test.jade'), {profile : profiles});
                    }
                } else {
                    res.sendStatus(400);
                }
            }).sort( { year: 1, month: 1 ,date:1});

        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }

};

/*show upload artifacts page*/
const uploadArtifacts = function (req, res) {
    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
    Users.findOne({id: req.session.user.id}, function (err, user) {
        //if user has no family
        if(user.currentFamily == 'noFamily'){
            console.log("no profile to be shown");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                    "yet, so you may now join or create a family.", returnPage:"account"});
        }
        else{
            res.sendFile(path.join(__dirname, '../views/upload_artifacts.html'));
        }
    });
};

/*show upload profiles page*/
const uploadProfiles = function (req, res) {
    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
    Users.findOne({id: req.session.user.id}, function (err, user) {
        //if user has no family
        if(user.currentFamily == 'noFamily'){
            console.log("no profile to be shown");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                    "yet, so you may now join or create a family.", returnPage:"account"});
        }
        else{
            res.sendFile(path.join(__dirname, '../views/upload_profile.html'));
        }
    });
};

/*submit upload artifacts*/
const submitUploadArtifacts = function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        var name = fields.name;
        fs.writeFileSync("views/user_images/artifactsPhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg", fs.readFileSync(files.image.path));
        fs.writeFileSync("views/user_videos/artifactsVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4"
            , fs.readFileSync(files.video.path));
        let OSS = require('ali-oss');
        let client = new OSS({
            region: 'oss-ap-southeast-2',
            accessKeyId: 'LTAI4Fgy2os9YCfosNtJUtKS',
            accessKeySecret: 'UyxpOuIcixuZ3oJ6LHLX5VWSIqagaZ\n',
            bucket: 'itprojectmystery'
        });
        async function put () {
            try {
                let video = await client.put("artifactsVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
                    "views/user_videos/artifactsVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4");
                let image = await client.put("artifactsPhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
                    "views/user_images/artifactsPhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg");
            } catch(e) {
                console.log("fail to upload to ali oss");
                console.error('error: %j', err);
            }
        }
        put();
        var item = new Items({
            "name": fields.name,
            "date": fields.year,
            "owner": fields.owner,
            "keeper": fields.keeper,
            "location": fields.location,
            "description": fields.description,
            "category": fields.category,
            "familyId":req.session.user.currentFamily,
            "image": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/artifactsPhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
            "video": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/artifactsVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
        });
        console.log("image path="+item.image);
        item.save(function (err) {
            console.log(err);
            if (!err) {
                //adding successful
                //res.render(path.join(__dirname, '../views/alert_message.jade'));
                Items.find({familyId: req.session.user.currentFamily}, function (err, items) {
                    //res.render(path.join(__dirname, '../views/artifacts_test.jade'), {item : items});
                    res.redirect('/artifacts');
                });
            }
            else {
                //adding failed
                //res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Artifacts",returnPage :"artifacts"});
                Items.find({familyId: req.session.user.currentFamily}, function (err, items) {
                    //res.render(path.join(__dirname, '../views/artifacts_test.jade'), {item : items});
                    res.redirect('/artifacts');
                });
                /**should also jump to error message page
                 * */
            }
        });
    });
};

/*submit upload profiles*/
const submitUploadProfiles = function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        var name = fields.name;
        fs.writeFileSync("views/user_images/profilePhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg", fs.readFileSync(files.image.path));
        fs.writeFileSync("views/user_videos/profileVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4"
            , fs.readFileSync(files.video.path));
        let OSS = require('ali-oss');
        let client = new OSS({
            region: 'oss-ap-southeast-2',
            accessKeyId: 'LTAI4Fgy2os9YCfosNtJUtKS',
            accessKeySecret: 'UyxpOuIcixuZ3oJ6LHLX5VWSIqagaZ\n',
            bucket: 'itprojectmystery'
        });
        async function put () {
            try {
                let video = await client.put("profileVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
                    "views/user_videos/profileVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4");
                let image = await client.put("profilePhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
                    "views/user_images/profilePhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg");
            } catch(e) {
                console.log("fail to upload to ali oss");
                console.error('error: %j', err);
            }
        }
        put();
        var profile = new Profiles({
            "name": fields.name,
            "year": fields.year,
            "month": fields.month,
            "day": fields.day,
            "description": fields.description,
            "life_story": fields.life_story,
            "year_passed": fields.year_passed,
            "familyId": req.session.user.currentFamily,
            "image": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/profilePhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
            "video": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/profileVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
        });
        console.log("image path="+profile.image);
        profile.save(function (err) {
            console.log(err);
            if (!err) {
                /** the file is to be made and changed
                 * */
                //res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"successfully To Add a New Profile",returnPage :"family"});
                res.redirect('/family');
            }
            else {
                //res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Profile",returnPage :"family"});
                res.redirect('family');
                /**should also jump to error message page
                 * */
            }
        });
    });
};

/*Update user information*/
const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};


/*User Guide*/
const guide = function(req, res) {
    console.log("called guide");
    res.sendFile(path.join(__dirname, '../views/guide.html'));
};


/*/developer tool:  delete tester-delete artifactes*/
const developer_delete_user = function(req, res) {
    console.log("called developer_delete_user");
    Users.remove(
        function(err, user) {
            console.log(user);
        });
};

/*--------------------Function Exports---------------------------*/

module.exports.deleteItem = deleteItem;
module.exports.deleteProfile = deleteProfile;
module.exports.showArtifacts = showArtifacts;
module.exports.uploadArtifacts = uploadArtifacts;
module.exports.submitUploadArtifacts = submitUploadArtifacts;
module.exports.showProfiles = showProfiles;
module.exports.uploadProfiles = uploadProfiles;
module.exports.submitUploadProfiles = submitUploadProfiles;
module.exports.search = search;
module.exports.guide = guide;
module.exports.developer_delete_user = developer_delete_user;
module.exports.updateItem = updateItem;
module.exports.updateProfile = updateProfile;