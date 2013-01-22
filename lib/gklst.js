/**
 * Really simple Geeklist client
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@ow2.org>
 * MIT Licensed
 */

var program = require('commander')
  , colors = require('colors')
  , geeklist = require('geeklist')

// keys are set in ./config.js. Will be nice to put them in a configuration file...
var config = require('./config');
var gklst = geeklist.create({
    consumer_key: config.consumer_key
  , consumer_secret: config.consumer_secret
})
gklst.auth({
    token: config.token
  , secret: config.secret
})

// Does nothing but calls geeklist API...
var cli = function() {
  
  program
    .command('link <url>')
    .description('Post a new link')
    .option("-t, --title <title>", "The link title")
    .action(function(url, options){
      if (!options.title)  {
        console.log('[ERROR] Title is required'.red)
        return;
      }
      gklst.links().create({url: url, title: options.title}, response);
    }).on('--help', function() {
      console.log('  Examples:');
      console.log();
      console.log("    $ link http://chamerling.org -t 'My Blog'");
      console.log();
    });
    
    program
      .command('micro <micro>')
      .description('Post a new micro')
      .action(function(status, options){
        gklst.micros().create({status: status}, response)
      }).on('--help', function() {
        console.log('  Examples:');
        console.log();
        console.log("    $ micro 'Just published my new nodejs module'");
        console.log();
      });
    
    program.parse(process.argv)
    return;
}
exports.cli = cli;

var response = function(err, data) {
  if (err) {
    console.log(('[ERROR] ' + err.data.error).red)
  }
  if (data) {
    console.log(('[OK] Check ' + data.short_code.gklst_url).green)
  }
}