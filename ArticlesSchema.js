
//In this class we are creating schema for database and fields

var mongoose = require("mongoose");

var ArticlesSchema = new mongoose.Schema({
    Name: String,
    Authors: String,
    'Authors Full Names': String,
    'Article Title': String,
    'Source Title': String,
    Abstract: String,
    Addresses: String,
    Volume: String,
    'Reprint Addresses': String,
    'Cited Reference Count': String,
    'Times Cited, WoS Core': String,
    'Times Cited, All Databases': String,
    'Since 2013 Usage Count': String,
    'Publication Year': String,
    Volume: String,
    Issue: String,
    DOILink: String

});

var Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;