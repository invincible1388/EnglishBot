'use strict'
const http = require('http');
const Bot = require('messenger-bot');
const parseString = require('xml2js').parseString;
const util = require('util');
let bot = new Bot({
  token: 'CAAHBs7szwOgBAImZBokFTZChJKcySjjcF2a0CicEFGnOU7U7d7w1DzJZC1Tt70ioZASmEyIB3U1ZAgJNTygNVP5gBoaTwzVuX90wr2ZCQKDUXOn5Ppi7kaPr6ygQUTn789Xig3twhaxfd7RAhIQm0PgO58nDfHjbDtdxg73j4w5zLTymZCCELTGs6CDSZAHG0ZBgZD',
  verify: 'VILLIE_BOT'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text
  let query = text;
  
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    text = `${profile.first_name} please wait until we find the meaning for you.`;
	reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    });
	
	let url = 'http://www.dictionaryapi.com/api/v1/references/sd4/xml/'+query+'?key=02674a10-1a41-40aa-8b7e-0b730906c467';
	console.log(url);
	
	
	var options = {
	  host: 'api.urbandictionary.com',
	  path: '/v0/define?term='+query
	};

	var callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
		str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	  var json = JSON.parse(str);
			try{
			
			
			console.log(util.inspect(json, false, null));
			
			text = "";
			if(json.list.length > 0){
				text = query+" meaning:";
				reply({ text }, (err) => {
				  if (err) throw err
				});
			}
			
			for(let i = 0; i< json.list.length; i++){
				text = `${i}: ${json.list[i].definition}`;
				reply({ text }, (err) => {
				  //if (err) throw err
				});
			}
			
		  } catch (e){
			text = `Sorry, we were not able to find the meaning of ${query}.`;
			reply({ text }, (err) => {
			  if (err) throw err

			  console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${def}`)
			});
		  }
	  });
	}

	http.request(options, callback).end();
	
	
	
	
  });
});

http.createServer(bot.middleware()).listen(3000)