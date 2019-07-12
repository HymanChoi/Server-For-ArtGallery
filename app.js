let createError = require("http-errors")
let express = require("express")
let path = require("path")
let cookieParser = require("cookie-parser")
let logger = require("morgan")

let usersRouter = require("./routes/users")
let userHomeRouter = require("./routes/userHome")
let managersRouter = require("./routes/managers")
let managerHomeRouter = require("./routes/managerHome")
let homeRouter = require("./routes/home")
let artistsRouter = require("./routes/artists")
let artistHomeRouter = require("./routes/artistHome")
let artworksRouter = require("./routes/artworks")
let artworkHomeRouter = require("./routes/artworkHome")
let uploadRouter = require("./routes/upload")
let searchRouter = require("./routes/search")

let app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))

// 模板引擎为jade
app.set("view engine", "jade")

// 模板引擎为html
// let ejs = require('ejs');
// app.engine('.html', ejs.__express);
// app.set('view engine', 'html');

let mongoose = require("mongoose")
// 连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/ArtGallery", {
	useNewUrlParser: true
})
// 数据库连接成功
mongoose.connection.on("connected", function() {
	console.log("数据库连接成功")
})
// 数据库连接失败
mongoose.connection.on("error", function() {
	console.log("数据库连接失败")
})
// 数据库未连接
mongoose.connection.on("disconnected", function() {
	console.log("数据库未连接")
})

app.use(logger("dev"))
app.use(express.json({ limit: "50mb" }))
app.use(
	express.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 50000
	})
)

app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// 捕获登录状态
app.use(function(req, res, next) {
	// 进入路由之前优先进入function
	if (req.cookies.userId) {
		// 有cookies,说明已经登录
		next()
	} else {
		console.log("url:" + req.originalUrl)
		// 未登录时可以点击登录, 登出, 注册, 忘记密码, 首页, 艺术家列表, 艺术家个页, 艺术品列表, 艺术品个页, 排名列表,
		if (
			req.originalUrl == "/users/login" ||
			req.originalUrl == "/users/logout" ||
			req.originalUrl == "/users/register" ||
			req.originalUrl == "/users/forgetPassword" ||
			req.originalUrl == "/managers/login" ||
			req.originalUrl == "/managers/register" ||
			req.originalUrl == "/managers/forgetPassword" ||
			req.originalUrl == "/search/searchArtists" ||
			req.originalUrl == "/search/searchArtworks" ||
			req.originalUrl.indexOf("/home") > -1 ||
			req.originalUrl.indexOf("/artists") > -1 ||
			req.originalUrl.indexOf("/artistHome/detail") > -1 ||
			req.originalUrl.indexOf("/artistHome/getArtworksList") > -1 ||
			req.originalUrl.indexOf("/artworks") > -1 ||
			req.originalUrl.indexOf("/artworkHome/detail") > -1 ||
			req.originalUrl.indexOf("/artworkHome/getComment") > -1
		) {
			next()
		} else {
			res.json({
				status: "1001",
				msg: "当前未登录",
				result: ""
			})
		}
	}
})

app.use("/users", usersRouter)
app.use("/userHome", userHomeRouter)
app.use("/managers", managersRouter)
app.use("/managerHome", managerHomeRouter)
app.use("/home", homeRouter)
app.use("/artists", artistsRouter)
app.use("/artistHome", artistHomeRouter)
app.use("/artworks", artworksRouter)
app.use("/artworkHome", artworkHomeRouter)
app.use("/upload", uploadRouter)
app.use("/search", searchRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render("error")
})

module.exports = app
