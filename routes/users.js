let express = require("express")
let router = express.Router()
let Users = require("./../models/users.js")

// 加密
let bcrypt = require("bcryptjs")
// 设置加密强度
let salt = bcrypt.genSaltSync(10)

// 登录
router.post("/login", function(req, res) {
	let param = {
		userName: req.body.userName
	}
	// 根据用户名密码查找数据库
	Users.findOne(param, function(err, doc) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message
			})
		} else {
			if (bcrypt.compareSync(req.body.password, doc.password)) {
				res.cookie("userId", doc.userId, {
					path: "/",
					maxAge: 1000 * 60 * 60
				})
				res.cookie("userName", doc.userName, {
					path: "/",
					maxAge: 1000 * 60 * 60
				})
				res.cookie("nickName", doc.nickName, {
					path: "/",
					maxAge: 1000 * 60 * 60
				})
				res.json({
					status: "0",
					msg: "",
					result: {
						userId: doc.userId,
						userName: doc.userName,
						nickName: doc.nickName
					}
				})
			} else {
				res.json({
					msg: "用户名或密码错误"
				})
			}
		}
	})
})

// 登出
router.post("/logout", function(req, res) {
	res.cookie("userId", "", {
		path: "/",
		maxAge: -1 // 生命周期
	})
	res.json({
		status: "0",
		msg: "",
		result: ""
	})
})

// 校验是否登录
router.get("/checkLogin", function(req, res) {
	if (req.cookies.userName) {
		res.json({
			status: "0",
			msg: "",
			result: [req.cookies.nickName, req.cookies.userName, req.cookies.userId]
		})
	} else {
		res.json({
			status: "1",
			msg: "未登录",
			result: ""
		})
	}
})

// 注册
router.post("/register", function(req, res) {
	let param = {
		userName: req.body.userName
	}
	/*生成HASH值*/
	let hash = bcrypt.hashSync(req.body.password, salt)
	let params = {
		userName: req.body.userName,
		password: hash
	}
	Users.findOne(param, function(err, doc) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message
			})
		} else {
			if (doc == null) {
				Users.countDocuments().then(data => {
					let paramPlus = { userId: "00000000" + (data + 1) }
					params = Object.assign(params, paramPlus)
					Users.create(params, (err, doc) => {
						if (err) {
							res.json({
								status: "1",
								msg: err.message
							})
						} else {
							Users.findOne(param, function(err, doc) {
								if (err) {
									res.json({
										status: "1",
										msg: err.message
									})
								} else {
									res.cookie("userId", doc.userId, {
										path: "/",
										maxAge: 1000 * 60 * 60
									})
									res.cookie("userName", doc.userName, {
										path: "/",
										maxAge: 1000 * 60 * 60
									})
									res.cookie("nickName", doc.nickName, {
										path: "/",
										maxAge: 1000 * 60 * 60
									})
									res.json({
										status: "0",
										msg: "注册成功",
										result: {
											userName: doc.userName,
											nickName: doc.nickName
										}
									})
								}
							})
						}
					})
				})
			} else {
				res.json({
					status: "1",
					msg: "用户已注册"
				})
			}
		}
	})
})

// 忘记密码
router.post("/forgetPassword", function(req, res) {
	let param = {
		userName: req.body.userName
	}
	Users.findOne(param)
		.then(data => {
			if (data == null) {
				res.json({
					status: "1",
					msg: "用户未注册"
				})
			} else {
				Users.findOneAndUpdate(param, {
					$set: {
						password: req.body.password
					}
				}).then(data => {
					res.cookie("userId", data.userId, {
						path: "/",
						maxAge: 1000 * 60 * 60
					})
					res.cookie("userName", data.userName, {
						path: "/",
						maxAge: 1000 * 60 * 60
					})
					res.cookie("nickName", data.nickName, {
						path: "/",
						maxAge: 1000 * 60 * 60
					})
					res.json({
						status: "0",
						msg: "重置成功",
						result: {
							userName: data.userName,
							nickName: data.nickName
						}
					})
				})
			}
		})
		.catch(error => {
			res.json({
				status: "1",
				msg: error.message
			})
		})
})

module.exports = router
