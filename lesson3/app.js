var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');

var app = express();

app.get('/', function (req, res, next) {
    superagent.get('https://cnodejs.org').end(function (err, sres) {
        //常规的错误处理
        if (err) {
            return next(err);
        }
        var $ = cheerio.load(sres.text);
        var items = [];
        $('#topic_list .cell').each(function (idx, element) {
            var $element = $(element);
            var $title = $element.find('.topic_title');
            var $author = $element.find('img');
            items.push({
                title: $title.attr('title'),
                href: $title.attr('href'),
                author: $author.attr('src')
            });
        });

        res.send(items);

    });
});

app.listen(3000, function () {
    console.log('app is running at port 3000');
})