let express = require("express")
let router = express.Router()
let Artists = require("../models/artists")

//获取列表
router.get("/", function(req, res) {
	let params = {}
	let params1 = {}
	let params2 = {}

	let page = parseInt(req.query.page)
	let pageSize = parseInt(req.query.pageSize)
	let skip = (page - 1) * pageSize

	let sortType = parseInt(req.query.sortType)
	let sort = req.query.sort

	//筛选方式
	let continentLevel = req.query.continentLevel
	let theContinent = ""
	if (continentLevel == "0" || continentLevel == "all") {
		continentLevel = "all"
	} else {
		switch (continentLevel) {
		case "1":
			theContinent = "亚洲"
			break
		case "2":
			theContinent = "欧洲"
			break
		case "3":
			theContinent = "美洲"
			break
		case "4":
			theContinent = "非洲"
			break
		case "5":
			theContinent = "其他"
			break
		}
		params1 = {
			artistContinent: theContinent
		}
	}

	let yearsLevel = req.query.yearsLevel
	let startYears = ""
	let endYears = ""
	if (yearsLevel == "0" || yearsLevel == "all") {
		yearsLevel = "all"
	} else {
		switch (yearsLevel) {
		case "1":
			startYears = ""
			endYears = "0000.00.00"
			break
		case "2":
			startYears = "0000.00.00"
			endYears = "1000.12.31"
			break
		case "3":
			startYears = "1000.01.01"
			endYears = "1499.12.31"
			break
		case "4":
			startYears = "1500.01.01"
			endYears = "1899.12.31"
			break
		case "5":
			startYears = "1900.01.01"
			endYears = "至今"
			break
		}
		params2 = {
			artistYear: {
				$gte: startYears,
				$lte: endYears
			}
		}
	}

	let artistsModel = Artists.find(params)
		.skip(skip)
		.limit(pageSize)
	if (params1) {
		params = Object.assign(params, params1)
		artistsModel = Artists.find(params)
			.skip(skip)
			.limit(pageSize)
	}
	if (params2) {
		params = Object.assign(params, params2)
		artistsModel = Artists.find(params)
			.skip(skip)
			.limit(pageSize)
	}

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
})

module.exports = router
