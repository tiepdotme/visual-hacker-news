"use strict";
var firebase = require('firebase/app');
var url      = require('url');
var kue      = require('kue');
var queue  = kue.createQueue({
	jobEvents: false,
	redis: process.env.REDIS_URL
});
require('firebase/database');
var fetchApp = firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com'
},'fetchApp');
const api = firebase.database(fetchApp).ref('/v0');

function getNewsUrl(newsItem) {
	// var deffer = new Deferred();
  var queryRef = api.child('item').child(newsItem);
  // return it as a synchronized object
  return new Promise(function(resolve, reject) {
  	queryRef.on("value", function(snapshot) {
  		var result = snapshot.val();
  	  // console.log(result);
			if ( result && result.title && result.title.includes('[pdf]')) {
				reject('Looks like a pdf');
			}
  		if (result && result.url) {
	  		resolve({
					title:result.title,
					url:result.url
				});
  		} else {
  			reject('No url detected');
  		}
  	}, function (errorObject) {
  	  console.log("The read failed: " + errorObject.code);
  	  reject(errorObject);
  	});
  });
}

function queScreenshot(snapshot) {
	var inewsId = snapshot.val();
	// console.log(inewsId);
	// console.log(arguments);
	getNewsUrl(inewsId).then(function({ title, url }){
		if (!url || url==='' || /\.pdf/.test(url)) return;
		const job = queue.create('cacheImage', {
			title,
			query: {
				url,
				quality: "33",
				width: "1280",
				height: "1280",
				resize: '450x450',
			}
		});
		job.removeOnComplete( true )
		.ttl(3*60*1000)
		// .delay(100)
		.priority('low')
		.attempts(3)
				.backoff( {type:'exponential'} )
		.save( function(err){
				if( !err ) console.log( `QUE_JOB=true JOB_ID=${job.id} URL=${url}` );
		});

	}).catch((error)=>{
		console.error(`ERROR=getNewsUrl ${error.message}`);
	});
}

function run(){
	console.log("running fetchImages");
	['top', 'new', 'show'].forEach(type => {
			api.child(`${type}stories`).on('child_changed', queScreenshot)
		})
}
module.exports = {
	run        : run,
	getNewsUrl :getNewsUrl
};
run();