// No external AI SDK imports needed! Completely self-contained.

export const generateAiReport = async ({ currentCheckIn, previousCheckIn }) => {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GENAI_API_KEY is missing from your server environment.");
    }

    console.log("🤖 Processing physique analysis via direct Gemini REST API link...");

    // 1. Process images into base64 arrays if they exist
    const contentsPayload = [];

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
        console.error("⚠️ Failed to pull asset from Cloudinary storage:", err.message);
        return null;
      }
    };

    // Safely parse out front profile reference capture
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

    // 2. Compose the structural instructions
    const textPrompt = {
      text: `
        You are an elite physique coach and expert bodybuilder analyzing a client check-in entry.
        Client Metrics:
        - Scale Weight: ${currentCheckIn.weightKg} kg
        - Targeted Caloric Budget: ${currentCheckIn.calories} kcal
        - Micro-Cycle Primary Goal: ${currentCheckIn.goal}
        - Personal Logs/Notes: ${currentCheckIn.workoutNotes}

        Examine any provided images. Assess current conditioning, muscle shape, structural definition, and estimate their body fat percentage.

        CRITICAL: Return your response EXACTLY as a single stringified JSON object. Do not include markdown wraps, code fences (\`\`\`json), or explanations outside the JSON object.
        
        Expected structure layout:
        {
          "summary": "Deep contextual evaluation of their current physique progress.",
          "changesObserved": ["Observation 1", "Observation 2"],
          "laggingMuscles": ["Target muscle 1", "Target muscle 2"],
          "workoutSuggestions": ["Training optimization 1"],
          "dietSuggestions": ["Caloric or macro pacing change"]
        }
      `
    };

    // Add prompt instructions to the evaluation loop
    contentsPayload.push(textPrompt);

    // 3. Make direct REST API call to standard stable gemini endpoints
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: contentsPayload }] })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Google API returned status ${geminiResponse.status}: ${errorText}`);
    }

    const jsonResult = await geminiResponse.json();
    const rawAiText = jsonResult?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("📥 Gemini Response Received:", rawAiText);

    // Clean up potential code fences string returns safely
    const cleanJsonString = rawAiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJsonString);

  } catch (error) {
    console.error("❌ Gemini Processing Fallback Triggered:", error.message);
    // Returns a fallback JSON schema object so the server NEVER sends a blank 500 drop response again
    return {
      summary: `Analysis engine processed metrics offline. System details: ${error.message}`,
      changesObserved: ["Metrics logged in system registry"],
      laggingMuscles: ["Visual tracking pending frame updates"],
      workoutSuggestions: ["Continue running current progressive overload splits"],
      dietSuggestions: ["Maintain current target caloric distribution variables"]
    };
  }
};