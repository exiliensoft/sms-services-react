let multer = require('multer')
let path = require('path');
var maxSize = 10000 * 10000;

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

let upload = multer({
    storage: storage, limits: {
        fileSize: 50 * 1024 * 1024,
        fieldSize: 50 * 1024 * 1024
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})

module.exports = upload;