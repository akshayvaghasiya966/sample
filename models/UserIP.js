// models/UserIP.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userIPSchema = new Schema(
    {
        ipAddress: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("UserIP", userIPSchema);
