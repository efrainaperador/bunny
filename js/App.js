App = {

	initialize: function(){
		twttr.widgets.load();
		this.initTweet();
		this.getTweets();
	},

	getTweets: function(){
		var config = {
			"id": '568929742708310016',
			"domId": 'tweets',
			"maxTweets": 50,
			"enableLinks": true,
			"showUser": true,
			"showTime": true,
			"showRetweet": false,
			"showImages": true,
			"customCallback": this.handleTweets
		};

		twitterFetcher.fetch(config);
	},

	handleTweets: function(tweets){
		// Do what you want with your tweets here! For example:
		      var x = tweets.length;
		      var n = 0;
		      var element = $('#tweets');
		      var html = $('<ul>');
		      while(n < x) {
		      	var tweet = $(tweets[n]);
		      	var user = $(tweet[0]);
		      	var userImg = $('img', user);
		      	var userName = $($('span', user)[1]);
		      	userName.attr('id', 'userName');
		      	var userTag = $($('span', user)[2]);
		      	userTag.attr('id', 'userTag');

		      	var tweetHtml = $(tweet[1]);
		      	var tweetContent = $(tweet[1])[0].innerText;
		      	
		      	var video = "";
		      	if(tweetContent.indexOf('http://') >= 0){
		      		video = tweetContent.substring(tweetContent.indexOf('http://'), tweetContent.length);
		      	}else if(tweetContent.indexOf('https://') >= 0){
					video = tweetContent.substring(tweetContent.indexOf('https://'), tweetContent.length);
		      	}

		      	for(var i = 0; i < video.length; i++){
		      		if(video[i] == ' ' || video[i] == '\n'){
						video = video.substring(0, i);
						break;
		      		}
		      	}
		      	video = App.urlify(video);
		      	if(video.indexOf('youtu.be') >= 0){
		      		video = (video.split('http://youtu.be/')[1]);
		      		var li = $('<li>');
			        var videoHtml = $('<iframe width="370" height="250" src="http://www.youtube.com/embed/' + video.substring(0, video.length-1) + '" frameborder="0" allowfullscreen></iframe>')
			        li.append(videoHtml);
			        li.append($('<div class="tweetContainer">').append(tweet));

			        html.append(li);
			        $('.user',li).html('');
			        $('.user',li).append(userImg);
			        $('.user',li).append($('<div class="userInfo">').append(userName).append(userTag));

			        $('.twitter_reply_icon', li).prepend($('<img src="./img/reply.png" />'));
			        $('.twitter_retweet_icon', li).prepend($('<img src="./img/retweet.png" />'));
			        $('.twitter_fav_icon', li).prepend($('<img src="./img/favorite.png" />'));
			    }

			    n++;
		      }
		      
		      element.append(html);

	},

	urlify: function(text) {
	    var urlRegex = /(https?:\/\/[^\s]+)/g;
	    return text.replace(urlRegex, function(url) {
	        return url;
	    })
	},

	initTweet: function(Text){
		$('#share').show();
		$('#share').click(function(event) {
			event.preventDefault();

			var video = $('#videoUrl').val();
			var comment = $('#comment').val();

			video.replace(':', '%3A');
			video.replace('/', '%2F');
			
			comment.replace('#', '%23');
			comment.replace(' ', '%20');
			comment.replace('@', '%40');
			comment.replace(':', '%3A');
			comment.replace('/', '%2F');

		    var width  = 575,
		        height = 400,
		        left   = ($(window).width()  - width)  / 2,
		        top    = ($(window).height() - height) / 2,
		        url    = this.href + 'text='+comment+'&hashtags=nowplaying'+'&url='+video,
		        opts   = 'status=1' +
		                 ',width='  + width  +
		                 ',height=' + height +
		                 ',top='    + top    +
		                 ',left='   + left;
		    
		    window.open(url, 'twitter', opts);
		 
		    return false;
		  });
	}
}

$(document).ready(function(){
	window.loadTwitter = function(){
		$('#share').hide();
		if(twttr.widgets){
			App.initialize();
		}else{
			try{
				window.clearTimeout(twittTimeout);
			}catch(error){
				//twittTimeout no existe
			}
			window.twittTimeout = setTimeout( function(){loadTwitter()}, 1000);
		}
	}

	loadTwitter();
});