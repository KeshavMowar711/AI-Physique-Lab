import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    userId: {
       type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true
    },
    goal: {
      type: String,
      enum: ["cut", "bulk", "recomp"],
      required: true
    },
    weightKg: {
      type: Number,
      required: true
    },
    calories: {
      type: Number,
      default: null
    },
    workoutNotes: {
      type: String,
      default: ""
    },
    photos: {
      front: {
        type: String,
        required: true
      },
      side: {
        type: String,
        required: true
      },
      back: {
        type: String,
        required: true
      }
    },
    aiReport: {
      summary: {
        type: String,
        default: ""
      },
      changesObserved: {
        type: [String],
        default: []
      },
      laggingMuscles: {
        type: [String],
        default: []
      },
      workoutSuggestions: {
        type: [String],
        default: []
      },
      dietSuggestions: {
        type: [String],
        default: []
      },
      confidenceNote: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

export const CheckIn = mongoose.model("CheckIn", checkInSchema);