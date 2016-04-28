'use strict'
const http = require('http');
const Bot = require('messenger-bot');
const util = require('util');
const cool = require('cool-ascii-faces');
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

    text = `${profile.first_name} please wait until we find the meaning for you.${cool()}`;
	reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    });
	
	
	
	var options = {
	  host: 'api.urbandictionary.com',
	  path: '/v0/define?term='+encodeURIComponent(query),
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
			
			text = "";
			if(json.list.length > 0){
				text = `${query} meaning:`;
				
				reply({ text }, (err) => {
				  if (err) throw err
				});
				
				text = "";
				for(let i = 0; i< json.list.length; i++){
					//text += `${i}: ${json.list[i].definition} \n`;
					reply({ text }, (err) => {
					  if (err) throw err
					});
					
				}
				
				
					
			} else {
				
				throw "No results found!";
			
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

http.createServer(bot.middleware()).listen(process.env.PORT || 3000)