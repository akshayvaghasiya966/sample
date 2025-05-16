// server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const UserIP = require("./models/UserIP");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


// Connect to database and start server
connectDB();


app.get("/", async (req, res) => {
   
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        // Extract IP addresses
    const ipList = (req.headers["x-forwarded-for"] || req.connection.remoteAddress || "").split(",");

    // Clean up the IPs and remove empty or internal addresses
    const ips = ipList.map(ip => ip.trim()).filter(ip => ip && ip !== "::1" && ip !== "127.0.0.1");


    try {
        // Check if the IP already exists
        const existingIP = await UserIP.findOne({ ipAddress });

        if (!existingIP) {
            // Save the new IP
            const newIP = new UserIP({ ipAddress });
            await newIP.save();
            console.log(`New IP logged: ${ipAddress}`);
        }

            res.status(200).json({
        message: "IPs found",
        ipv4: ips.find(ip => ip.includes(".")) || null,
        ipv6: ips.find(ip => ip.includes(":")) || null,
        allIPs: ips
    });
    } catch (error) {
        console.error("Error logging IP:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
