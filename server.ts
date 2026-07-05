import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI lazily as recommended
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using graceful fallback mock mode.");
      throw new Error("GEMINI_API_KEY is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API: Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Analyze Report using Gemini 3.5 Flash
app.post("/api/analyze-report", async (req, res) => {
  const { description, userLocation } = req.body;

  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  // Generate random Bengaluru-based coords if no location provided
  const baseLat = 12.9716;
  const baseLng = 77.5946;
  const randomOffsetLat = (Math.random() - 0.5) * 0.08;
  const randomOffsetLng = (Math.random() - 0.5) * 0.08;
  
  const finalLat = userLocation?.latitude || (baseLat + randomOffsetLat);
  const finalLng = userLocation?.longitude || (baseLng + randomOffsetLng);
  
  // Set up a structured fallback mock response in case the API is keyless or fails
  const mockFallbackResponse = {
    title: "Reported Civic Infraction",
    category: "Roads & Infrastructure",
    urgency: "Medium",
    departmentId: "bbmp",
    needsHumanReview: false,
    confidence: 0.85,
    formalLetter: `To the Public Works Department Office,\nBruhat Bengaluru Mahanagara Palike (BBMP),\nBengaluru.\n\nSubject: Formal Notification of Infrastructure Complaint at ${userLocation?.display_name || 'Unknown location'}\n\nThis letter is an automated submission from the NagarikAI platform...`
  };

  try {
    const ai = getAiClient();
    
    const prompt = `You are a legal-expert civic advocacy agent. Your job is to read a citizen's complaint regarding a public issue and analyze it to determine categories, urgency, assign it to a department and draft a formal legal letter. Output strictly JSON following the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            urgency: { type: Type.STRING },
            departmentId: { type: Type.STRING },
            needsHumanReview: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            formalLetter: { type: Type.STRING }
          },
          required: ["title", "category", "urgency", "departmentId", "needsHumanReview", "confidence", "formalLetter"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini API");

    const analyzed = JSON.parse(text.trim());

    const resultReport = {
      ...analyzed,
      latitude: finalLat,
      longitude: finalLng,
      display_name: userLocation?.display_name || `Bengaluru Sector Zone ${Math.floor(Math.random() * 15 + 1)}-A`,
      zone: userLocation?.zone || `Zone 0${Math.floor(Math.random() * 9 + 1)}-A`
    };

    return res.json(resultReport);

  } catch (error: any) {
    console.error("Gemini analysis error:", error.message || error);
    const resultReport = {
      ...mockFallbackResponse,
      latitude: finalLat,
      longitude: finalLng,
      display_name: userLocation?.display_name || `Bengaluru Sector Zone ${Math.floor(Math.random() * 15 + 1)}-A`,
      zone: userLocation?.zone || `Zone 0${Math.floor(Math.random() * 9 + 1)}-A`
    };

    if (!process.env.GEMINI_API_KEY) {
      resultReport.formalLetter = `[MOCK MODE / NO API KEY DETECTED]\n\n${resultReport.formalLetter}`;
    } else {
      resultReport.formalLetter = `[API FALLBACK MODE]\n\n${resultReport.formalLetter}`;
    }

    return res.json(resultReport);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
