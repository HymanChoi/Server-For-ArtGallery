let mongoose = require("mongoose")

let artworkSchema = new mongoose.Schema(
	{
		artworkId: String,
		artworkImage: String,
		artworkName: String,
		artworkNameE: String,
		artworkYear: String,
		author: String,
		artworkType: String,
		detail: String,
		place: String,
		likes: Number
	},
	{ versionKey: false }
)

module.exports = mongoose.model("Artwork", artworkSchema)
