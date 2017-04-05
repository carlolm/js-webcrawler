var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var prompt = require('prompt');
var fs = require('fs');

var count = 0;
var limit = 1000;
var found = 0;
var target = '';
var results = [];
var resultCount = 0;

function crawlPage(url, target) {

  console.log('***** Visiting page [' +count + '] :' + url);
  request(url, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    // Check status code (200 is HTTP OK)

    if (response) {
      console.log("Status code: " + response.statusCode);
      if(response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        console.log("Page title:  " + $('title').text());

        // search for word in page
        // log to results

        var bodyText = $('html > body').text();

        console.log(bodyText);

        if (bodyText.toLowerCase().indexOf(target) >= 0) {
          resultCount++;
          results.push(url);
        }

        collectInternalLinks($);
      }
    }

  });

}

function collectInternalLinks($) {

  var allRelativeLinks = [];
  var allAbsoluteLinks = [];

  var relativeLinks = $("a[href^='/']");
  
  relativeLinks.each(function() {
    allRelativeLinks.push($(this).attr('href'));
  });

  var absoluteLinks = $("a[href^='http']");

  absoluteLinks.each(function() {
    allAbsoluteLinks.push($(this).attr('href'));
  });

  console.log("  Found " + allRelativeLinks.length + " relative links");
  console.log("  Found " + allAbsoluteLinks.length + " absolute links");

  allAbsoluteLinks.forEach(url => {
    console.log(' => URL: [' + count + '] ' + url);
    if (count < limit) crawlPage(url, target);
    count++;
  });

}

prompt.start();

prompt.get(['url', 'word'], function(err, result) {

  target = result.word;
  console.log('Command line input received');
  console.log('  url: ' + result.url);
  console.log('  word: ' + result.word.toLowerCase());
  crawlPage('http://' + result.url, target);

  console.log('********************************');
  console.log('Result count: ' + resultCount);
  console.log(results);

});

setTimeout(function() {

  fs.writeFile("results.txt", results, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("**********   The file was saved!   ***************");
    console.log("**********   The file was saved!   ***************");
    console.log("**********   The file was saved!   ***************");
    console.log("**********   The file was saved!   ***************");
    console.log("**********   The file was saved!   ***************");
    console.log("**********   The file was saved!   ***************");
    console.log("**********   Results count   ***************: " + resultCount);
    console.log(results);
  }); 

}, 60000);