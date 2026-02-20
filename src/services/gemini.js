import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateItinerary = async (tripData) => {
    // Check for API key presence
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.length < 10) {
        return getMockItinerary(tripData);
    }

    try {
        console.log("Generating itinerary with gemini-1.5-flash (v1beta)...");
        // Forcing v1beta which often works better for some keys with 1.5-flash
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: 'v1beta' }
        );

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
            - seasonalAdvice: A short warning or advice based on the destination and timing (e.g. monsoon, heatwave)

            Ensure the activities are suitable for the ${tripData.ageGroup} age group and ${tripData.travelerType} traveler type.
            Return ONLY the JSON. No markdown backticks.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Could not parse AI response.");
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        // Fallback to mock data for demonstration purposes if API fails
        console.log("Falling back to mock itinerary for demonstration...");
        return getMockItinerary(tripData);
    }
};

const getMockItinerary = (tripData) => {
    return {
        title: `Majestic ${tripData.destination} Getaway`,
        dailyPlan: [
            {
                day: 1,
                theme: "Cultural Immersion",
                activities: [
                    "Breakfast at a historic local cafe",
                    "Visit to the city's main heritage fort",
                    "Lunch featuring regional specialties",
                    "Exploring the vibrant local handicrafts market"
                ],
                hiddenGem: "A serene hidden garden away from the main tourist trail"
            },
            {
                day: 2,
                theme: "Nature & Exploration",
                activities: [
                    "Morning walk in the local nature park",
                    "Visit to a nearby scenic lake or viewpoint",
                    "Picnic lunch in a quiet spot",
                    "Evening cultural dance performance"
                ],
                hiddenGem: "A small hilltop temple with panoramic views of the entire region"
            }
        ],
        packingList: [
            "Comfortable cotton clothing",
            "Sunscreen and wide-brimmed hat",
            "Reusable water bottle",
            "Universal power adapter",
            "Local pharmacy first-aid kit"
        ],
        seasonalAdvice: `The weather in ${tripData.destination} is generally favorable during your dates. Carry light layers for early mornings.`
    };
};
