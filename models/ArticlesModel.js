const mongoose = require("mongoose")

const schema = mongoose.Schema({
    articleName: String,
    description: String,
    price: Number,
    quantity: Number,
    link: String,
    cat: String,
    section: [String],
    carton: Boolean,
    imgLink: String,
})

module.exports = mongoose.model("articles", schema)
