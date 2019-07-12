let mongoose = require("mongoose")

let artistSchema = new mongoose.Schema(
	{
		artistId: String,
		artistImage: String,
		artistName: String,
		artistNameE: String,
		artistYear: String,
		artistCountry: String,
		artistContinent: String,
		detail: String,
		artworks: Array,
		likes: Number
	},
	{
		versionKey: false
	}
)

module.exports = mongoose.model("Artist", artistSchema)
