var fs = require('fs');

function AddonManager (){
  this.addons = [];

  var _privilegedMethod = function (){};
}
AddonManager.prototype.RegisterAddons = function(app, passport) {
  var self = this;
  fs.readdirSync(__dirname).forEach(function (file) {
    if (file.indexOf('.js')<0) {
       console.log("-RegisterAddon: '"+file+"'");
       var Addon = require(__dirname + '/' + file);
       var addon = new Addon(app, passport);
       addon.register();
       self.addons.push( addon  );
    }
  });  
};
AddonManager.prototype.AvailableModules = function() {
  return this.addons;
};

UnregisterModule = function(i, cb){
  if( this.addons.length < i ) return false;
  this.addons[i].unregister(cb);
  this.addons.splice(i, 1);
}

AddonManager.prototype.UnregisterModule = function(i) {
  UnregisterModule(i);
};

exports = module.exports = new AddonManager();
exports.AddonManager = AddonManager;