// No external AI SDK imports needed! Completely self-contained.

export const generateAiReport = async ({ currentCheckIn, previousCheckIn }) => {
  try {
    // FIXED: Aligned directly to match your GOOGLE_API_KEY written on your Render dashboard
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY configuration variable is completely missing from your cloud cluster registry.");
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

    // FIXED: Items are fetched and pushed directly into a uniform, single flat-level parts array
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

        CRITICAL: Return your response EXACTLY as a single stringified JSON object matching this schema. Do not write any explanations outside the JSON block.
        
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

    // Add prompt instructions flat into the evaluation loop alongside the base64 vectors
    contentsPayload.push(textPrompt);

    // 3. Make direct REST API call to stable gemini endpoints
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // FIXED: Added strict responseMimeType instruction to guarantee a valid parse loop
      body: JSON.stringify({ 
        contents: [{ parts: contentsPayload }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Google API returned status ${geminiResponse.status}: ${errorText}`);
    }

    const jsonResult = await geminiResponse.json();
    const rawAiText = jsonResult?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("📥 Gemini Response Received successfully.");

    // Clean up potential markdown formatting code blocks safely
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