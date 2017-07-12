/** 同步执行多条command **/

var child_process = window.require("child_process");
var process = window.require("process");
var spawn = child_process.spawn;
import thunkify from "thunkify";
var path = window.require("path");
const ipc = window.require('electron').ipcRenderer

var execCommand = thunkify(function(arg1, arg2, ondata_callback, callback) {
    try {
        console.log(arg1);
        console.log(arg2);
        var commandId = spawn(arg1, arg2);
        commandId.stdout.on('data', (data) => {
            console.log("data", `${data}`)
            ondata_callback(`${data}`);
        });

        commandId.stderr.on('data', (data) => {
            console.log("error", `${data}`)
            callback(null, {
                "state": "error",
                "data": `${data}`
            });
        });

        commandId.on('close', (code) => {
            if (code != 0) {
                callback(null, {
                    "state": "error",
                    "data": "failed"
                });
            } else {
                callback(null, {
                    "state": "success",
                    "data": "success finish"
                });
            }

        });
    } catch (e) {
        console.log(e.message);
    }

});



var commitCommand = function*(config, ondata_callback) {

    config.execPath = ipc.sendSync('getBuildServicePath');
    config.mavenPath = ipc.sendSync("getMavenPath");
    console.log("mavenPath:", config.mavenPath);

    var commandList = [{
        "command": config.execPath,
        "params": [
            // "../node_modules/@ctrip/ares-builder/bin/ares-builder", 
            "pom",
            "--cwd",
            config.homePath, //"/Users/feifeipan/Code/test/testares/testares4",
            "--build",
            config.buildPath, //"/Users/feifeipan/.ares/build",
            "--dev",
            "--spec",
            config.buildSpec, //"default"
            "--tranc",
            "ares.json"
        ]
    }, {
        "command": config.mavenPath,
        "params": [
            "clean",
            "package",
            "--settings",
            config.mavenSettingPath, //"/Users/feifeipan/.ares/config/maven-settings.xml"
        ]
    }, {
        "command": config.mavenPath,
        "params": [
            "deploy",
            "-P",
            "test",
            "--settings",
            config.mavenSettingPath, //"/Users/feifeipan/.ares/config/maven-settings.xml"
        ]
    }, ];


    console.log("commandList", commandList);

    var ret;
    var item = commandList[0];
    process.chdir(config.homePath);
    ret = yield execCommand(commandList[0]["command"], commandList[0]["params"], ondata_callback);
    if (ret.state == "error") {
        return ret;
    }
    process.chdir(config.homePath);
    ret = yield execCommand(commandList[1]["command"], commandList[1]["params"], ondata_callback);
    if (ret.state == "error") {
        return ret;
    }
    process.chdir(config.homePath);
    ret = yield execCommand(commandList[2]["command"], commandList[2]["params"], ondata_callback);
    return ret;
}

/*** exec command function**/
co(myBuildService.commitCommand(config, (data) => {
    // var arr = data.match(/(\[\d\d\:\d\d\:\d\d\])([^\[]*)/g)
    this.setState({
        "buildLog": this.state.buildLog.concat(data)
    });
})).then((data) => {
    console.log("co data:", data);
}, (err) => {
    console.log("co error");
    console.log(err.message);
});
