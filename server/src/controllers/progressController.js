import { CheckIn } from "../models/CheckIn.js";
import { generateAiReport } from "../services/openaiService.js";

export const getDashboard = async (req, res) => {
  const userId = req.user.id;
 
  const checkIns = await CheckIn.find({ userId }).sort({ date: -1 }).lean();

  const latest = checkIns[0] ?? null;
  const previous = checkIns[1] ?? null;

  res.json({
    overview: {
      totalCheckIns: checkIns.length,
      latestWeightKg: latest?.weightKg ?? null,
      currentGoal: latest?.goal ?? null,
      lastUpdated: latest?.date ?? null
    },
    latestReport: latest?.aiReport ?? null,
    history: checkIns,
    comparison: latest && previous
      ? {
          weightDeltaKg: Number((latest.weightKg - previous.weightKg).toFixed(1)),
          daysBetween:
            Math.round(
              Math.abs(new Date(latest.date).getTime() - new Date(previous.date).getTime()) /
                (1000 * 60 * 60 * 24)
            ) || 0
        }
      : null
  });
};

export const createCheckIn = async (req, res) => {
  const payload = req.body;
   const userId = req.user.id;

   if (!payload?.photos?.front || !payload?.photos?.side || !payload?.photos?.back) {
    return res.status(400).json({
      message: "Front, side, and back photos are required"
    });
  }


     const previousCheckIn = await CheckIn.findOne({ userId })

    .sort({ date: -1 })
    .lean();
 
 
  const aiReport = await generateAiReport({
    currentCheckIn: payload,
    previousCheckIn
  });

  const checkIn = await CheckIn.create({
    ...payload,
    userId,
    aiReport
  });

  res.status(201).json(checkIn);
};