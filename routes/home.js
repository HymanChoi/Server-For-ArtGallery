let express = require("express")
let router = express.Router()
let Artists = require("../models/artists")
let Artworks = require("../models/artworks")

router.get("/", function(req, res) {
	let params = {}

	let page = 1
	let pageSize = 3
	let skip = (page - 1) * pageSize

	let sortType = parseInt(req.query.sortType)
	let sort = req.query.sort

	let listType = req.query.listType

	//查询艺术家列表
	if (listType == 0) {
		let artistsModel = Artists.find(params)
			.skip(skip)
			.limit(pageSize)

		//排序方式
		if (sortType == "0") {
			//按ID排序
			artistsModel.sort({
				artistId: sort
			})
		} else if (sortType == "1") {
			//按国籍排序
			artistsModel.sort({
				artistCountry: sort
			})
		} else if (sortType == "2") {
			//按年份排序
			artistsModel.sort({
				artistYear: sort
			})
		}

		//执行
		artistsModel.exec(function(err, doc) {
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
		})
	}

	//查询艺术品列表
	if (listType == 1) {
		let artworksModel = Artworks.find(params)
			.skip(skip)
			.limit(pageSize)

		//排序方式
		if (sortType == "0") {
			//按ID排序
			artworksModel.sort({
				artworkId: sort
			})
		} else if (sortType == "1") {
			//按国籍排序
			artworksModel.sort({
				artworkType: sort
			})
		} else if (sortType == "2") {
			//按年份排序
			artworksModel.sort({
				artworkYear: sort
			})
		}

		//执行
		artworksModel.exec(function(err, doc) {
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
		})
	}
})

module.exports = router
