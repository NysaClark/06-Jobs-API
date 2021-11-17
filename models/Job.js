const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "company must be provided"],
      maxlength: [50, "company must be less than 50 characters"],
    },
    position: {
      type: String,
      required: [true, "position must be provided"],
      maxlength: [100, "position must be less than 100 characters"],
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["interview", "declined", "pending"],
        message: `{VALUE} is not supported`,
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "createdBy required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
