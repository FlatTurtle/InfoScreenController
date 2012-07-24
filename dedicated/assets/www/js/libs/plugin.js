// get local ref to global PhoneGap/Cordova/cordova object for exec function
var cordovaRef = window.PhoneGap || window.Cordova || window.cordova;
// old to new fallbacks

Plugin = function() {
    console.log("initializing Test Plugin");
};

Plugin.prototype.get = function(action,passValue,successCallback, callbackError) {
    cordovaRef.exec(successCallback, callbackError, "ChangePass", action, [passValue]);
};

/**
 * Install function
 */
Plugin.install = function() {
    if (!window.plugins) {
        window.plugins = {};
    }
    if (!window.plugins.Plugin) {
        window.plugins.Plugin = new Plugin();
    }
};

/**
 * Add to Cordova constructor
 */
function installPlugin() {
    if (cordovaRef && cordovaRef.addConstructor) {
        cordovaRef.addConstructor(Plugin.install());
        console.log('Installed like a boss!')
    } else {
        console.log("TestPlugin Cordova Plugin could not be installed.");
        return null;
    }
}

