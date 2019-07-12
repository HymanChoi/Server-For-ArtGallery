let express = require("express")
let router = express.Router()
let Artworks = require("../models/artworks")
let Users = require("../models/users")
let Comments = require("../models/comments.js")

router.get("/detail", function(req, res) {
	Artworks.find(
		{
			artworkId: req.query.artworkId
		},
		function(err, doc) {
			if (err) {
				res.json({
					status: "1",
					msg: err.message
				})
			} else {
				res.json({
					status: "0",
					msg: "success",
					result: {
						count: doc.length,
						array: doc[0]
					}
				})
			}
		}
	)
})

router.post("/likeJudgment", function(req, res) {
	let num = 0
	if (!req.body.like) {
		num = 1
	} else {
		num = -1
	}
	let param = {
		artworkId: req.body.artworkId
	}
	Artworks.updateOne(
		param,
		{
			$inc: {
				likes: num
			}
		},
		function(err, doc) {
			if (err) {
				res.json({
					status: "1",
					msg: err.message
				})
			} else {
				res.json({
					status: "0",
					msg: "success",
					num: num,
					artworkId: req.body.artworkId
				})
			}
		}
	)
	Artworks.find(param).then(res => {
		let params = res[0]
		if (num == 1) {
			Users.updateOne(
				{ userId: req.body.userId },
				{ $push: { favoritesArtworks: params } }
			).then(res => {
				console.log(res)
			})
		} else {
			Users.updateOne(
				{ userId: req.body.userId },
				{ $pull: { favoritesArtworks: param } }
			).then(res => {
				console.log(res)
			})
		}
	})
})

router.post("/likeStatus", (req, res) => {
	Users.find({
		userId: req.body.userId,
		favoritesArtworks: {
			$elemMatch: {
				artworkId: req.body.artworkId
			}
		}
	})
		.then(data => {
			res.json({
				status: "0",
				msg: data[0]
			})
		})
		.catch(err => {
			res.json({
				status: "1",
				msg: err
			})
		})
})

router.post("/isVip", (req, res) => {
	Users.find({
		userId: req.body.userId
	})
		.then(data => {
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

router.post("/getComment", (req, res) => {
	let params = req.body
	Comments.find(params).then(data => {
		if (data.length == 0) {
			params.comment = []
			Comments.create(params).then(data => {
				res.json({
					status: "2",
					msg: data
				})
			})
		} else {
			res.json({
				status: "0",
				msg: data
			})
		}
	})
})

router.post("/submitComment", (req, res) => {
	Comments.find({ artworkId: req.body.artworkId }).then(data => {
		let commentId = (parseInt("10000001") + data[0].comment.length).toString()
		let params = {
			commentId: commentId,
			userId: req.body.comment.userId,
			userName: req.body.comment.userName,
			time: req.body.comment.time,
			content: req.body.comment.content
		}
		Comments.updateOne(
			{ artworkId: req.body.artworkId },
			{ $push: { comment: params } }
		).then(data => {
			console.log(data)
			res.json({
				status: "0",
				msg: data
			})
		})
	})
})

module.exports = router
