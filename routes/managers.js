let express = require("express")
let router = express.Router()
let Managers = require("./../models/managers.js")

// 加密
let bcrypt = require("bcryptjs")
// 设置加密强度
let salt = bcrypt.genSaltSync(10)

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
	Managers.findOne(param, function(err, doc) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message
			})
		} else {
			if (doc == null) {
				Managers.countDocuments().then(data => {
					let paramPlus = { userId: "M00" + (data + 1) }
					params = Object.assign(params, paramPlus)
					Managers.create(params, (err, doc) => {
						if (err) {
							res.json({
								status: "1",
								msg: err.message
							})
						} else {
							Managers.findOne(param, function(err, doc) {
								if (err) {
									res.json({
										status: "2",
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

// 登录
router.post("/login", function(req, res) {
	let param = {
		userName: req.body.userName
	}
	// 根据用户名密码查找数据库
	Managers.findOne(param, function(err, doc) {
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

// 忘记密码
router.post("/forgetPassword", function(req, res) {
	let param = {
		userName: req.body.userName
	}
	Managers.findOne(param)
		.then(data => {
			if (data == null) {
				res.json({
					status: "1",
					msg: "用户未注册"
				})
			} else {
				Managers.findOneAndUpdate(param, {
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
