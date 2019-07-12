let mongoose = require("mongoose")

let managerSchema = new mongoose.Schema(
	{
		userId: String,
		avatar: "",
		userName: String,
		password: String,
		nickName: String
	},
	{
		versionKey: false
	}
)

module.exports = mongoose.model("Manager", managerSchema)
