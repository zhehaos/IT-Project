
const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require("../node_modules/body-parser");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


const controller = require('../controllers/controllers.js');

/*Main navigation routes, function details/comments in controller entry*/

router.get('/', controller.welcome);

//table testers
router.get('/users', controller.findAllUsers);
router.get('/profiles', controller.findAllProfiles);

router.get('/logout', controller.logOut);

router.post('/register', controller.createUser);

router.get('/home', controller.getHome);
router.post('/saveMessage', controller.saveMessage);
router.post('/savePhoto', controller.savePhoto);

router.post('/saveMessage', controller.saveMessage);

router.get('/account', controller.getAccount);

router.post('/updateUsername', controller.updateUsername);

router.get('/artifacts', controller.showArtifacts);

router.get('/uploadArtifacts', controller.uploadArtifacts);

router.post('/upload/artifacts/submit', controller.submitUploadArtifacts);

router.get('/family', controller.showProfiles);

router.post('/upload/profiles/submit', controller.submitUploadProfiles);

router.get('/uploadProfiles', controller.uploadProfiles);


router.delete('/deleteItem/:id',controller.deleteItem);
router.delete('/deleteProfile/:id',controller.deleteProfile);

router.post('/createFamily', controller.createFamily);



//handle login logic
router.post('/login', controller.handleLogin);
router.get('/login', controller.welcome);

router.post('/', controller.createUser);

/*----------------------file paths for local views----------------------------*/

router.get('/css/bootstrap.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/bootstrap.css'));
});
router.get('/css/font-awesome.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/font-awesome.css'));
});
router.get('/css/head_style.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/head_style.css'));
});
router.get('/css/lightbox.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/lightbox.css'));
});
router.get('/css/home.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/home.css'));
});
router.get('/register.html', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

module.exports = router;
