var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var prompt = require('prompt');


function crawlPage(url) {

  console.log("Visiting page " + pageToVisit);
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

  console.log("Found " + allRelativeLinks.length + " relative links");
  console.log("Found " + allAbsoluteLinks.length + " absolute links");

  allAbsoluteLinks.forEach(url => crawlPage(url));

}

prompt.start();

prompt.get(['url'], function(err, result) {

  console.log('Command line input received');
  console.log('  url: ' + result.url);
  crawlPage(result.url);
  
});