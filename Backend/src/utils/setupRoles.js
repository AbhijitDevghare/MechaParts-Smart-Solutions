const mongoose = require("mongoose");
require("dotenv").config();
const Role = require("../models/roleSchema");

async function ensureDefaultRole() {
    try {
        let defaultRole = await Role.findOne({ name: "User" });
        if (!defaultRole) {
            defaultRole = new Role({ name: "User", permissions: ["read-only"] });
            await defaultRole.save();
            console.log("✅ Default role 'User' created.");
        } else {
            console.log("ℹ️ Default role 'User' already exists.");
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error ensuring default role:", error);
    }
}

ensureDefaultRole();
