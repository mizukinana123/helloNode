var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';
superagent.get(cnodeUrl)
    .end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);
        $('#topic_list .topic_title').each(function (index, element) {

            var $element = $(element);
            var href = url.resolve(cnodeUrl, $element.attr('href'));
            topicUrls.push(href);
        });

        var ep = new eventproxy();

        ep.after('topic_html', topicUrls.length, function (topics) {
            topics = topics.map(function (topicPair) {
                var topicUrl = topicPair[0];
                var topicHtml = topicPair[1];
                var $ = cheerio.load(topicHtml);
                var author1Url = '';
                if ($('.author_content').eq(0).find('.user_avatar').attr('href')) {
                    author1Url = url.resolve(cnodeUrl, $('.author_content').eq(0).find('.user_avatar').attr('href'));
                }
                console.log(author1Url);
                var score1 = 0;
                return ({
                    title: $('.topic_full_title').text().trim(),
                    href: topicUrl,
                    comment1: $('.reply_content').eq(0).text().trim(),
                    author1: $('.author_content').eq(0).find('.reply_author').text().trim(),
                    score1: score1
                });
            });
            console.log('final:');
            console.log(topics);

        });

        topicUrls.forEach(function (topicUrl) {
            console.log(topicUrl);
            superagent.get(topicUrl)
                .end(function (err, res) {

                    ep.emit('topic_html', [topicUrl, res.text]);
                });
        });
    });