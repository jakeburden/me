var http = require('http')
var ecstatic = require('ecstatic')(__dirname + '/templates')
var trumpet = require('trumpet')
var fs = require('fs')
var path = require('path')
var router = require('routes')()

router.addRoute('/', function (req, res) {
    layout(res).end( write('content.html', 'content') )
})

router.addRoute('/posts/:title?', function (reqs, res, params) {
    layout(res).end( write(params.title, 'posts') )
})

server = http.createServer(function (req, res) {
    var m = router.match(req.url)
    if (m) m.fn(req, res, m.params)
    else ecstatic(req, res)
})

server.listen(8080, function() {
    console.log('listening on http://localhost:8080')
})

function layout (res) {
    res.setHeader('content-type', 'text-html')
    var tr = trumpet()
    read('layout.html').pipe(tr).pipe(res)
    return tr.createWriteStream('#container')
}

function read (file) {
    return fs.createReadStream(path.join(__dirname, 'templates', file))
}

function write (file, dir) {
    return fs.readFileSync(path.join(__dirname, dir, file))
}
