let express = require("express")
let router = express.Router()
let fs = require("fs")
let path = require("path")
let multer = require("multer")
let ArtistsUpload = require("./../models/artistsUpload.js")
let ArtworksUpload = require("./../models/artworksUpload.js")

let artistImage = ""
let artworkImage = ""
let fileUrl = ""

//创建文件夹
let createFolder = function(folder) {
	try {
		fs.accessSync(folder)
	} catch (e) {
		fs.mkdirSync(folder)
	}
}

//这个路径为文件上传的文件夹的路径
let uploadFolder1 = "./upload/artists"
let uploadFolder2 = "./upload/artworks"

createFolder(uploadFolder1)
createFolder(uploadFolder2)

// 通过 filename 属性定制
let storage1 = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, uploadFolder1)
	},
	filename: function(req, file, cb) {
		let extname = path.extname(file.originalname)
		cb(null, file.fieldname + Date.now() + extname)
	}
})
let storage2 = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, uploadFolder2)
	},
	filename: function(req, file, cb) {
		let extname = path.extname(file.originalname)
		cb(null, file.fieldname + Date.now() + extname)
	}
})

// 通过 storage 选项来对 上传行为 进行定制化
let artistUpload = multer({ storage: storage1 }).single("artist")
let artworkUpload = multer({
	storage: storage2,
	limits: { fileSize: 3 * 1024 * 1024 }
}).single("artwork")

router.post("/artist", artistUpload, function(req, res) {
	fileUrl = req.file.destination + "/" + req.file.filename
	let imageData = fs.readFileSync(fileUrl)
	let imageBase64 = imageData.toString("base64")
	let imagePrefix = "data:image/jpg;base64,"
	artistImage = imagePrefix + imageBase64
	res.json({
		status: "0",
		msg: "图片上传成功"
	})
})

router.post("/artistForm", function(req, res) {
	if (artistImage == "" && artworkImage == "") {
		res.json({
			status: "1",
			msg: "请先上传图片"
		})
	} else {
		res.json({
			status: "0",
			msg: "提交成功"
		})
		ArtistsUpload.find()
			.sort({ artistId: -1 })
			.limit(1)
			.then(data => {
				let params = {
					artistId: (parseInt(data[0].artistId) + 1).toString(),
					artistImage: artistImage
				}
				params = Object.assign(params, req.body)
				ArtistsUpload.create(params).then(() => {
					fs.unlink(fileUrl, err => {
						if (err) {
							throw err
						}
						console.log("文件已删除")
					})
				})
			})
	}
})

router.post("/artwork", artworkUpload, function(req, res) {
	fileUrl = req.file.destination + "/" + req.file.filename
	let imageData = fs.readFileSync(fileUrl)
	let imageBase64 = imageData.toString("base64")
	let imagePrefix = "data:image/jpg;base64,"
	artworkImage = imagePrefix + imageBase64
	res.json({
		status: "0",
		msg: "图片上传成功"
	})
})

router.post("/artworkForm", function(req, res) {
	if (artistImage == "" && artworkImage == "") {
		res.json({
			status: "1",
			msg: "请先上传图片"
		})
	} else {
		res.json({
			status: "0",
			msg: "提交成功"
		})
		ArtworksUpload.find()
			.sort({ artworkId: -1 })
			.limit(1)
			.then(data => {
				let params = {
					artworkId: (parseInt(data[0].artworkId) + 1).toString(),
					artworkImage: artworkImage
				}
				params = Object.assign(params, req.body)
				ArtworksUpload.create(params).then(() => {
					fs.unlink(fileUrl, err => {
						if (err) {
							throw err
						}
						console.log("文件已删除")
					})
				})
			})
	}
})

module.exports = router
