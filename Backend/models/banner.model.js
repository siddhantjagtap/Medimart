const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  Title: String,
  Image: String,
  Link: String, 
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;