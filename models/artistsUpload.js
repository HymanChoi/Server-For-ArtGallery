let mongoose = require("mongoose")

let artistsUploadSchema = new mongoose.Schema(
	{
		userId: String,
		artistId: String,
		artistImage: String,
		artistName: String,
		artistNameE: String,
		artistYear: String,
		artistCountry: String,
		artistContinent: String,
		detail: String
	},
	{
		versionKey: false,
		collection: "artistsUpload"
	}
)

module.exports = mongoose.model("ArtistsUpload", artistsUploadSchema)
