/** is empty object ***/
var _isEmptyObject = (obj) => {
    for (var key in obj) {
        return false;
    }
    return true;
}

/**FILE***/
/** is directory **/
var _isDir = (path) => {
    var state = fs.statSync(path);
    return state.isDirectory();
}

/** make dir recursive **/
var _mkdir = function(dir) {
    try {
        fs.mkdirSync(dir);
    } catch (e) {
        if (e.code === "ENOENT") {
            _mkdir(path.dirname(dir));
            _mkdir(dir);

        }
    }
}

/** is same object **/
var _isSameObject = (a, b)=>{
	// Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

/** delete directory recursive **/
var _deleteFolderRecursive = function(fpath) {
    if (fs.existsSync(fpath)) {
        fs.readdirSync(fpath).forEach(function(file, index) {
            var curPath = path.resolve(fpath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                _deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(fpath);
    }
};

/** is empty directory **/
/**
opt{
	ignore:[".DS_Store"]
}
**/
var _isEmptyDir = function(path, opt) {
    try {
        var files = fs.readdirSync(path);
        if (typeof opt["ignore"] != "undefined") {
            opt["ignore"].forEach((item, index) => {
                var dsIndex = files.indexOf(item);
                if (dsIndex != -1) {
                    files.splice(dsIndex)
                }
            });
        }
        return !files.length
    } catch (e) {

    }
}


/** copy dir **/
var copyDir = function(src, dest) {
	mkdir(dest);
	var files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if(current.isSymbolicLink()) {
			var symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copy(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
};

var copy = function(src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
}

