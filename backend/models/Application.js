const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, "Company is required"], trim: true, maxlength: 100 },
    role: { type: String, required: [true, "Role is required"], trim: true, maxlength: 120 },
    package: { type: String, trim: true, maxlength: 50 },
    status: {
      type: String,
      enum: ["Interested", "Applied", "Assessment", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    source: { type: String, trim: true, maxlength: 80 },
    jobUrl: { type: String, trim: true, maxlength: 500 },
    location: { type: String, trim: true, maxlength: 100 },
    applicationDate: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    nextActionDate: { type: Date },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
