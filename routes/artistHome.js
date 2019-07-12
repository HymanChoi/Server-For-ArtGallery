let express = require("express")
let router = express.Router()
let Artists = require("../models/artists")
let Artworks = require("../models/artworks")
let Users = require("../models/users")

router.get("/detail", function(req, res) {
	Artists.find(
		{
			artistId: req.query.artistId
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

router.post("/getArtworksList", function(req, res) {
	Artworks.find(
		{
			artworkName: {
				$in: req.body.artworksList
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
					result: {
						count: doc.length,
						list: doc
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
		artistId: req.body.artistId
	}
	Artists.updateOne(
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
					artistId: req.body.artistId
				})
			}
		}
	)
	Artists.find(param).then(res => {
		let params = res[0]
		if (num == 1) {
			Users.updateOne(
				{ userId: req.body.userId },
				{ $push: { favoritesArtists: params } }
			).then(res => {
				console.log(res)
			})
		} else {
			Users.updateOne(
				{ userId: req.body.userId },
				{ $pull: { favoritesArtists: param } }
			).then(res => {
				console.log(res)
			})
		}
	})
})

router.post("/likeStatus", (req, res) => {
	Users.find({
		userId: req.body.userId,
		favoritesArtists: {
			$elemMatch: {
				artistId: req.body.artistId
			}
		}
	}).then(data => {
		res.json({
			status: "0",
			msg: data[0]
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
		.catch(error => {
			res.json({
				status: "1",
				msg: error
			})
		})
})

module.exports = router
