var express = require("express"), http = require("http"), path = require("path");
var app = express();

//设置静态资源目录(如：url通过"./common.js" 访问 "dist/prd/v1.0.0/common.js")
app.use(express.static(path.join(__dirname, "dist/prd/v1.0.0")));
app.use("/asset", express.static(path.join(__dirname, "asset")));

//设置主页
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
})
//设置端口
app.set("port", process.env.PORT || 3003);

http.createServer(app).listen(app.get("port"), function(){
	console.log("Express server listening on port " + app.get("port"));
});

module.exports = app;
