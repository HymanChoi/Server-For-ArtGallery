let mongoose = require("mongoose")

let commentsSchema = new mongoose.Schema(
	{
		artworkId: String,
		comment: Array
	},
	{
		versionKey: false
	}
)

module.exports = mongoose.model("Comments", commentsSchema)
