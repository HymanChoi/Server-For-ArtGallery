let mongoose = require("mongoose")

let artworksUploadSchema = new mongoose.Schema(
	{
		userId: String,
		artworkId: String,
		artworkImage: String,
		artworkName: String,
		artworkNameE: String,
		artworkYear: String,
		author: String,
		artworkType: String,
		detail: String,
		place: String
	},
	{
		versionKey: false,
		collection: "artworksUpload"
	}
)

module.exports = mongoose.model("ArtworksUpload", artworksUploadSchema)
