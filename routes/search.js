let express = require("express")
let router = express.Router()
let Artists = require("../models/artists")
let Artworks = require("../models/artworks")

router.post("/searchArtists", (req, res) => {
	let param = req.body.artistName
	let reg = new RegExp(param, "i")
	Artists.find({ $or: [{ artistName: { $regex: reg } }] })
		.then(data => {
			res.json({
				status: "0",
				msg: data[0].artistId
			})
		})
		.catch(err => {
			res.json({
				status: "1",
				msg: err
			})
		})
})

router.post("/searchArtworks", (req, res) => {
	let param = req.body.artworkName
	let reg = new RegExp(param, "i")
	Artworks.find({ $or: [{ artworkName: { $regex: reg } }] })
		.then(data => {
			res.json({
				status: "0",
				msg: data[0].artworkId
			})
		})
		.catch(err => {
			res.json({
				status: "1",
				msg: err
			})
		})
})

module.exports = router
