// set up basic settings
//
var base      = 'sys.smeg.com.au',
    host      = 'http://' + base,
    hostport  = 6051,
    localport = 8889;

// define server proxy
//
var express         = require('express'),
    app             = express(),
    valenceDevToken = '*TEST',
    valenceDev      = true,// true - running outside the portal, auto set sid with dev token
    https           = require('https'),
    http            = require('http'),
    queryString     = require('querystring'),
    url             = require('url'),
    httpProxy       = require('express-http-proxy'),
    valenceProxy    = httpProxy(host + ':' + hostport, {
        proxyReqPathResolver : function (req) {
            return url.parse(req.url).path;
        }
    });

app.all('/valence/*', valenceProxy);
app.all('/portal/*', valenceProxy);
app.all('/php/*', valenceProxy);
app.all('/extjs/*', valenceProxy);
app.all('/desktop/ShoppingCart/*', valenceProxy);
app.all('/desktop/autocodeApps/*', valenceProxy);
app.all('/resources/*', valenceProxy);
app.all('/packages/local/*', valenceProxy);
app.all('/build/testing/Shopping/*', express.static(__dirname));
app.all('/build/testing/ShoppingCart/*', express.static(__dirname));
app.all('/build/testing/Wrapper/*', express.static(__dirname));
app.all('/build/production/Wrapper/*', express.static(__dirname));
app.all('/build/*', valenceProxy);
app.all('/Product/*', valenceProxy);

// serve static folders from this local machine
//
app.use('/smeg-applications/', express.static(__dirname));
app.use('/', express.static(__dirname));

// begin listening on local port
//
app.listen(localport);