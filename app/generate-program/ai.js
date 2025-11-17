import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function with retry logic
async function generateWithRetry ( model, prompt, maxRetries = 3, initialDelay = 1000 )
{
    for ( let attempt = 1; attempt <= maxRetries; attempt++ )
    {
        try
        {
            const result = await model.generateContent( prompt );
            return result.response.text();
        } catch ( error )
        {
            if ( error.status === 429 && attempt < maxRetries )
            {
                // Rate limited - wait before retrying
                const delay = initialDelay * Math.pow( 2, attempt - 1 ); // Exponential backoff
                console.log( `Rate limited. Retrying in ${ delay }ms... (Attempt ${ attempt }/${ maxRetries })` );
                await new Promise( resolve => setTimeout( resolve, delay ) );
            } else
            {
                throw error;
            }
        }
    }
}

export async function generateFitnessPlan ( {
    age,
    height,
    weight,
    injuries,
    workout_days,
    fitness_goal,
    fitness_level,
    gender,
    sports,
    additional_instructions,
    measurement_unit,
} )
{
    try
    {
        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI( process.env.GEMINI_API_KEY );
        const model = genAI.getGenerativeModel( {
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.4,
                topP: 0.9,
                responseMimeType: "application/json"
            }
        } );

        // Prompt for personalized plan
        const prompt = `You are an experienced fitness coach creating a personalized workout plan based on:
        Age: ${ age }
        Height: ${ height }
        Weight: ${ weight }
        Gender: ${ gender }
        Injuries or limitations: ${ injuries }
        Available days for workout: ${ workout_days }
        Fitness goal: ${ fitness_goal }
        Fitness level: ${ fitness_level }
        Favorite or practiced sports: ${ sports }
        Additional instructions from the user: ${ additional_instructions }
        
        As a professional coach:
        - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
        - Design exercises that match the fitness level and account for any injuries
        - Structure the workouts to specifically target the user's fitness goal
        - When referencing any weights or quantities, prefer the measurement unit: ${ measurement_unit } (if applicable)
        
        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
        - For example: "sets": 3, "reps": 10
        - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
        - Instead use specific numbers like "reps": 12 or "reps": 15
        - For cardio, use "sets": 1, "reps": 1 or another appropriate number
        - NEVER include strings for numerical fields
        - NEVER add extra fields not shown in the example below
        
        Return a JSON object with this EXACT structure:
        {
            "schedule": ["Monday", "Wednesday", "Friday"],
            "exercises": [
            {
                "day": "Monday",
                "routines": [
                {
                    "name": "Exercise Name",
                    "sets": 3,
                    "reps": 10
                }
                ]
            }
            ]
        }
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;


        // Generate AI response with retry logic
        const responseText = await generateWithRetry( model, prompt );
        const plan = JSON.parse( responseText );

        // Validate and structure workout plan
        const validatedPlan = {
            schedule: plan.schedule,
            exercises: plan.exercises.map( exercise => ( {
                day: exercise.day,
                routines: exercise.routines.map( routine => ( {
                    name: routine.name,
                    sets: typeof routine.sets === "number" ? routine.sets : parseInt( routine.sets ) || 1,
                    reps: typeof routine.reps === "number" ? routine.reps : parseInt( routine.reps ) || 10,
                } ) ),
            } ) ),
        };

        return validatedPlan;
    } catch ( error )
    {
        console.error( "Error generating fitness plan:", error );
        return "Sorry, I couldn’t generate your plan at the moment.";
    }
}
export async function generateMealsPlan ( {
    age,
    height,
    weight,
    dietary_restrictions,
    fitness_goal,
    gender,
    sports,
    additional_instructions,
    measurement_unit,
} )
{
    try
    {
        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI( process.env.GEMINI_API_KEY );
        const model = genAI.getGenerativeModel( {
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.4,
                topP: 0.9,
                responseMimeType: "application/json"
            }
        } );

        // Prompt for personalized plan

        const prompt = `You are an experienced nutrition coach creating a personalized diet plan based on:
        Age: ${ age }
        Height: ${ height }
        Weight: ${ weight }
        Gender: ${ gender }
        Fitness goal: ${ fitness_goal }
        Dietary restrictions: ${ dietary_restrictions }
        Favorite or practiced sports: ${ sports }
        Additional instructions from the user: ${ additional_instructions }
        
        As a professional nutrition coach:
        - Calculate appropriate daily calorie intake based on the person's stats and goals
        - Create a balanced meal plan with proper macronutrient distribution
        - Include a variety of nutrient-dense foods while respecting dietary restrictions
        - Consider meal timing around workouts for optimal performance and recovery
        - Include specific portion quantities using the measurement unit: ${ measurement_unit } (for example: "150 ${ measurement_unit } grilled chicken")
        
        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "dailyCalories" MUST be a NUMBER, not a string
        - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
        - ONLY include the EXACT fields shown in the example below
        - Each meal should include ONLY a "name" and "foods" array
        - If you include quantities for foods, embed them as part of the food string using ${ measurement_unit }

        Return a JSON object with this EXACT structure and no other fields:
        {
            "dailyCalories": 2000,
            "meals": [
            {
                "name": "Breakfast",
                "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
            },
            {
                "name": "Lunch",
                "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
            }
            ]
        }
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;


        // Generate AI response with retry logic
        const responseText = await generateWithRetry( model, prompt );
        const response = JSON.parse( responseText );

        // Validate and structure diet plan
        const validatedPlan = {
            dailyCalories: response.dailyCalories,
            meals: response.meals.map( meal => ( {
                name: meal.name,
                foods: meal.foods,
            } ) ),
        };

        return validatedPlan;
    } catch ( error )
    {
        console.error( "Error generating meals plan:", error );
        return "Sorry, I couldn’t generate your plan at the moment.";
    }
}