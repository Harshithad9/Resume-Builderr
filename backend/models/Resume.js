const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fullName: String,

    email: String,

    phone: String,

    linkedin: String,

    github: String,

    education: String,

    skills: String,

    projects: String,

    experience: String,

    certifications: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);