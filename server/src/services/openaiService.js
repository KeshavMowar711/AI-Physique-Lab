// No external AI SDK dependencies or module packages required! Completely self-contained native REST.

export const generateAiReport = async ({ currentCheckIn, previousCheckIn }) => {
  try {
    // Dynamic matching configuration checks against both variable names on your dashboard
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY configuration token is missing from your active shell profile memory.");
    }

    console.log("🤖 Processing physique analysis via direct Gemini REST API link...");

    const contentsPayload = [];

    // Native buffer translator converts binary files directly to base64 inline block assets
    const fetchImagePart = async (url) => {
      if (!url || !url.startsWith('http')) return null;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return {
          inlineData: {
            data: Buffer.from(arrayBuffer).toString("base64"),
            mimeType: "image/jpeg"
          }
        };
      } catch (err) {
        console.error("⚠️ Failed to parse image asset array buffer from bucket storage link:", err.message);
        return null;
      }
    };

    // Parse visual reference buffers directly side-by-side inside flat array structures
    if (currentCheckIn.photos?.front) {
      const frontData = await fetchImagePart(currentCheckIn.photos.front);
      if (frontData) contentsPayload.push(frontData);
    }
    if (currentCheckIn.photos?.side) {
      const sideData = await fetchImagePart(currentCheckIn.photos.side);
      if (sideData) contentsPayload.push(sideData);
    }
    if (currentCheckIn.photos?.back) {
      const backData = await fetchImagePart(currentCheckIn.photos.back);
      if (backData) contentsPayload.push(backData);
    }

    // Compose coaching instructions matrix
    const textPrompt = {
      text: `
        You are an elite physique coach and expert bodybuilder analyzing a client check-in entry.
        Client Metrics:
        - Scale Weight: ${currentCheckIn.weightKg} kg
        - Targeted Caloric Budget: ${currentCheckIn.calories} kcal
        - Micro-Cycle Primary Goal: ${currentCheckIn.goal}
        - Personal Logs/Notes: ${currentCheckIn.workoutNotes}

        Examine any provided images. Assess current conditioning, muscle shape, structural definition, and estimate their body fat percentage.

        CRITICAL: Return your response EXACTLY as a single stringified JSON object matching this schema blueprint layout. Do not write markdown wraps or backticks (\`\`\`json).
        
        Expected structure layout layout:
        {
          "summary": "Deep contextual evaluation of their current physique progress.",
          "changesObserved": ["Observation 1", "Observation 2"],
          "laggingMuscles": ["Target muscle 1", "Target muscle 2"],
          "workoutSuggestions": ["Training optimization 1"],
          "dietSuggestions": ["Caloric or macro pacing change"]
        }
      `
    };

    // Push prompt block into the same flat parts data matrix context array block
    contentsPayload.push(textPrompt);

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: contentsPayload }],
        generationConfig: {
          responseMimeType: "application/json" // Forces Gemini to always respond with pure clean JSON structures
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Google REST Engine returned status ${geminiResponse.status}: ${errorText}`);
    }

    const jsonResult = await geminiResponse.json();
    const rawAiText = jsonResult?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("📥 Gemini Response Received successfully.");

    // Regular Expression clear out parameters to ensure flawless parsing loops
    const cleanJsonString = rawAiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJsonString);

  } catch (error) {
    console.error("❌ Gemini Processing Fallback Triggered:", error.message);
    // Dynamic schema object structure fallback shield keeps your dashboard active even if tracking variables fault
    return {
      summary: `Metrics logged inside system registry container. AI processing engine offline status details: ${error.message}`,
      changesObserved: ["Telemetry dataset variables indexed successfully"],
      laggingMuscles: ["Visual evaluation parameters offline"],
      workoutSuggestions: ["Maintain current target workout microcycle sets distribution rules"],
      dietSuggestions: ["Maintain target calorie and energy distribution matrices configuration"]
    };
  }
};