const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: function(req, file, cb){
       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
}).single('image'); 

module.exports = upload;
