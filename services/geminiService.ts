import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const analyzeResearchQuestion = async (question: string): Promise<string | null> => {
  try {
    if (!ai) {
      console.warn('Gemini API key not configured');
      return null;
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following research question and classify its primary nature. Your answer MUST be one of four categories: "Descriptive", "Relational", "Causal", or "Mixed-Methods".

      - "Descriptive" questions aim to describe what is happening or what exists.
      - "Relational" questions look at the relationships between two or more variables.
      - "Causal" questions are about determining whether one or more variables causes or affects one or more outcome variables.
      - "Mixed-Methods" questions explicitly combine quantitative (e.g., 'what is the impact') and qualitative (e.g., 'how do they perceive') goals.
      
      Research Question: "${question}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            researchNature: {
              type: Type.STRING,
              description: 'The primary nature of the research question. Must be "Descriptive", "Relational", "Causal", or "Mixed-Methods".'
            }
          }
        },
        temperature: 0,
      }
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);

    if (result && result.researchNature && ['Descriptive', 'Relational', 'Causal', 'Mixed-Methods'].includes(result.researchNature)) {
      return result.researchNature;
    }

    return null;
  } catch (error) {
    console.error("Error analyzing research question:", error);
    return null;
  }
};