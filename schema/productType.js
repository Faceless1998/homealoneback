const mongoose = require("mongoose");

const prodtype = new mongoose.Schema({
  prodType: {
    type: Array,
    required: true,
  },
});
module.exports = mongoose.model("prodtype", prodtype);
