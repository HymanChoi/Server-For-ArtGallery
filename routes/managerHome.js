let express = require("express")
let router = express.Router()
let Artists = require("./../models/artists.js")
let ArtistsUpload = require("./../models/artistsUpload.js")
let Artworks = require("./../models/artworks.js")
let ArtworksUpload = require("./../models/artworksUpload.js")
let Users = require("./../models/users.js")

router.post("/getArtistsUpload", (req, res) => {
	let page = parseInt(req.body.page)
	let pageSize = parseInt(req.body.pageSize)
	let skip = (page - 1) * pageSize

	ArtistsUpload.find()
		.skip(skip)
		.limit(pageSize)
		.then(data => {
			res.json({
				status: "0",
				msg: "success",
				result: {
					count: data.length,
					list: data
				}
			})
		})
		.catch(err => {
			res.json({
				status: "1",
				msg: err
			})
		})
})

router.post("/getArtworksUpload", (req, res) => {
	let page = parseInt(req.body.page)
	let pageSize = parseInt(req.body.pageSize)
	let skip = (page - 1) * pageSize

	ArtworksUpload.find()
		.skip(skip)
		.limit(pageSize)
		.then(data => {
			res.json({
				status: "0",
				msg: "success",
				result: {
					count: data.length,
					list: data
				}
			})
		})
		.catch(err => {
			res.json({
				status: "1",
				msg: err
			})
		})
})

router.post("/pass", (req, res) => {
	let params = req.body
	//升级为VIP用户
	Users.updateOne({ userId: req.body.userId }, { $set: { isVip: true } }).then(
		data => {
			console.log(data)
		}
	)
	//通过审核
	if (req.body.artistId != undefined) {
		ArtistsUpload.deleteOne(params).then(data => {
			Artists.find()
				.sort({ artistId: -1 })
				.limit(1)
				.then(data => {
					params.artistId = (parseInt(data[0].artistId) + 1).toString()
					Artists.create(params).then(data => {
						res.json({
							status: "0",
							msg: data
						})
					})
				})
		})
	} else {
		ArtworksUpload.deleteOne(params).then(data => {
			Artworks.find()
				.sort({ artworkId: -1 })
				.limit(1)
				.then(data => {
					params.artworkId = (parseInt(data[0].artworkId) + 1).toString()
					Artworks.create(params).then(data => {
						res.json({
							status: "0",
							msg: data
						})
					})
				})
		})
	}
})

router.post("/remove", (req, res) => {
	let params = req.body
	if (req.body.artistId != undefined) {
		ArtistsUpload.deleteOne(params).then(data => {
			res.json({
				status: "0",
				msg: data
			})
		})
	} else {
		ArtworksUpload.deleteOne(params).then(data => {
			res.json({
				status: "0",
				msg: data
			})
		})
	}
})

module.exports = router
