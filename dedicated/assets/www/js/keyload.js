/**
 * Created with JetBrains PhpStorm.
 * User: gbostoen
 * Date: 7/13/12
 * Time: 1:47 PM
 * loads key and triggers event on deviceready
 */
var localkey;
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

/*
 * Cordova(=Phonegap) ready to accept requests
 */
function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    initiate();
    installPlugin();
    
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("conf.json", null, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
}

function gotFile(file){
    readAsText(file);
}

function readAsText(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as text");
        localkey = evt.target.result;
        console.log(evt.target.result);
    };
    reader.readAsText(file);
}

function fail(evt) {
    console.log(evt.target.error.code);
}
onLoad();