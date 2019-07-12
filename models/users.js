let mongoose = require("mongoose")

let userSchema = new mongoose.Schema(
	{
		userId: String,
		avatar: "",
		userName: String,
		password: String,
		nickName: String,
		age: String,
		sex: String,
		favoritesArtists: [
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
			}
		],
		favoritesArtworks: [
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
			}
		]
	},
	{ versionKey: false }
)

module.exports = mongoose.model("User", userSchema)
