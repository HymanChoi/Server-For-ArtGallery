let express = require("express")
let router = express.Router()
let Users = require("./../models/users.js")

router.post("/getUserData", (req, res) => {
	let param = { userId: req.cookies.userId }
	Users.findOne(param)
		.then(data => {
			// 置空密码
			data.password = ""
			res.json({
				status: "0",
				msg: data
			})
		})
		.catch(err => {
			res.json({
				status: "1",
				msg: err
			})
		})
})

router.post("/modifyUserData", (req, res) => {
	let param = { userId: req.cookies.userId }
	let params = req.body
	Users.updateMany(param, {
		$set: params
	}).then(data => {
		console.log(data)
		Users.findOne(param).then(data => {
			res.cookie("nickName", data.nickName, {
				path: "/",
				maxAge: 1000 * 60 * 60
			})
			res.json({
				status: "0",
				msg: data
			})
		})
	})
})

module.exports = router
