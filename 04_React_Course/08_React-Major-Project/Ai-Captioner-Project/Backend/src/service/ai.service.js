require("dotenv").config();

const TONE_CONFIG = {
  casual: "Write 4-5 short, fun social media captions. Use a friendly tone and emojis.",
  funny: "Write 4-5 hilarious, witty captions with puns and humor.",
  professional: "Write 4-5 polished, professional captions for LinkedIn. No slang.",
  poetic: "Write 4-5 beautiful, lyrical captions using metaphors.",
  hashtags: "Write 1 punchy caption and 20 relevant hashtags."
};

async function generateCaptions(base64ImageFile, tone = "casual") {
  console.log("   [AI] Starting generateCaptions function using OpenRouter...");
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing in .env file");

    const instruction = TONE_CONFIG[tone] || TONE_CONFIG.casual;
    const fullPrompt = `${instruction}\n\nFormat your response as a list with bullet points.`;

    console.log("   [AI] Requesting OpenRouter API...");
    
    // Fixing base64 URL format for OpenRouter
    let imageUrl = base64ImageFile;
    if (!imageUrl.startsWith("data:")) {
      imageUrl = `data:image/jpeg;base64,${base64ImageFile}`;
    }

    // Array of free vision-capable models on OpenRouter
    const freeModelsToTry = [
      "nvidia/nemotron-nano-12b-v2-vl:free",
      "google/gemma-3-4b-it:free",
      "google/gemma-3-12b-it:free",
      "google/gemma-3-27b-it:free"
    ];

    let text = null;
    let lastError = null;

    for (const modelName of freeModelsToTry) {
      console.log(`   [AI] Trying model: ${modelName}...`);
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: fullPrompt
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: imageUrl
                    }
                  }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`   [AI] ${modelName} failed with status ${response.status}:`, errorText);
          lastError = new Error(`OpenRouter API error: ${errorText}`);
          continue; // Try the next model
        }

        const json = await response.json();
        text = json.choices[0].message.content;
        
        console.log(`   [AI] Response received successfully from ${modelName}!`);
        break; // Stop trying if we got a successful response
      } catch (err) {
        console.error(`   [AI] ${modelName} fetch error:`, err.message);
        lastError = err;
      }
    }

    if (!text) {
      throw lastError || new Error("All free OpenRouter models failed or are rate limited.");
    }

    return text;
  } catch (error) {
    console.error("   [AI] Error:", error.message);
    throw error;
  }
}

module.exports = generateCaptions;