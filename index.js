const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const util = require('util');

app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));

app.get("/request/:site", function(req, res) {
    var query = Object.keys(req.query).reduce((m, o) =>{
            return m += (o == 'url') ? "" : (o + '=' + req.query[o] + '&')
        },"?")
    var url = req.params.site == 'n' ?
    "https://navigator.temafon.ru/" + req.query.url + "login=showcase&password=123456" :
//        "https://cityguide.primeconcept.co.uk/" + req.params.url;
    "http://localhost:3002/" + req.query.url + query;
    console.log(url)
    require("request").get(url, (e,r, b) => {
        let json = {}
        try{
            json = JSON.parse(b)
            res.json(json)
        }catch(e){
            console.log(e)
            res.json({error : util.inspect(e)})
        }
    })
})
app.get(/.*/, function root(req, res) {
    var url = util.format('https://navigator.temafon.ru/services/2.0/CityGuide?where=%j&sort=%j&login=showcase&password=123456',{"active":true,"files":{"$exists":true}},{"sort":1});
    require("request").get(url, (e,r, b) => {
        let json = {}
        try{
            json = JSON.parse(b)
    }catch(e){
        console.log(e)
    }
    res.render("index",{json : JSON.stringify({cities :json})})
//        res.sendFile(__dirname + '/index.html');
})
});

const server = http.createServer(app);
server.listen(process.env.PORT || 3006, function onListen() {
    const address = server.address();
    console.log('Listening on: %j', address);
    console.log(' -> that probably means: http://localhost:%d', address.port);
});
