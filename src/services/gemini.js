import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateItinerary = async (tripData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Build a personalized travel itinerary for a trip to ${tripData.destination}.
      Details:
      - Dates: ${tripData.startDate} to ${tripData.endDate}
      - Traveler Type: ${tripData.travelerType}
      - Age Group: ${tripData.ageGroup}
      - Interests: ${tripData.interests.join(", ")}
      - Budget: ₹${tripData.budget}

      Format the response as a JSON object with:
      - title: A catchy title for the trip
      - dailyPlan: An array of objects, one for each day, with:
        - day: Day number
        - theme: Daily theme
        - activities: Array of 3-4 specific activities including food stops
        - hiddenGem: One offbeat/local spot to visit that day
      - packingList: Array of 5-7 essential items
      - seasonalAdvice: A short warning or advice based on the destination and timing

      Ensure the activities are suitable for the ${tripData.ageGroup} age group and ${tripData.travelerType} traveler type.
      Return ONLY the JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Attempt to parse JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Could not parse AI response");
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return null;
    }
};
