const W_PATH_SLASH = '\\';
const L_PATH_SLASH = '/';

/* WARNING : CHANGE THE DIRECTORY SEPARATOR SLASH DEPENDING ON YOUR OPERATING
SYSTEM. WINDOWS USES W_PATH_SLASH, UNIX AND ITS DERIVATIVES WITH L_PATH_SLASH.
YOU WILL NEED TO DO THIS ON THE FRONT AND BACK END.*/
const PATH_SLASH = W_PATH_SLASH;

/* WARNING : ENSURE THAT THERE ARE NO SERVICES RUNNING ON THE PORT DEFINED
BELOW.*/
const PORT = 3000;
const ROOT = __dirname + PATH_SLASH + "..";
const INSTRUCTIONS = `You are in directory view - click a file to read the
content, or click ESCALATE to return to the directory menu. If you're in the
directory menu, clicking ESCALATE will access the parent directory contents.
Click REFRESH to view any new files added to the content file tree, as well
as changes made to the file content.`;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(express.static(ROOT));
app.use(cors());

// We allow cross origin requests: "Access-Control-Allow-*" to avoid errors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
* Supplied with a path from a request, if a file is specified, serve its
* content, if it is not a file, set the content to the instructions
*/
function getFileContentOrInstructions(isFile, path) {
    return (isFile ? fs.readFileSync(path).toString() : INSTRUCTIONS);
}

/**
* Fills the dirs and files arrays with file and directory names underneath the
* supplied directory path
*/
function getChildDirsAndFiles(files, dirs, path) {
    var all = fs.readdirSync(path);
    for (let i = 0; i < all.length; i++) {
        var fsName = fs.lstatSync(path + PATH_SLASH + all[i]);
        if (fsName.isDirectory()) {
            dirs.push(all[i]);
        } else {
            files.push(all[i]);
        }
    }
}

function setStatus(path, res) {
    if (!(fs.existsSync(path))) {
        res.status(404).end();
    } else {
        res.status(200);
    }
}

/**
* General request handler
*/
app.get('/', (req, res) => {
    var files = [];
    var dirs = [];
    var path = ROOT + req.get('Path');
    setStatus(path, res);
    var isFile = fs.lstatSync(path).isFile();
    var content = getFileContentOrInstructions(isFile, path);
    if (!(isFile)) {
        getChildDirsAndFiles(files, dirs, path);
    }
    res.send({
        content : content,
        dirs : dirs,
        files : files
    });
});

app.listen(PORT, () => {
    console.log("Listening at http://localhost:" + PORT);
});
