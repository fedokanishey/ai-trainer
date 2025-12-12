import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config( { path: '.env.local' } );

const genAI = new GoogleGenerativeAI( process.env.GEMINI_API_KEY );

async function testAPI ()
{
    try
    {
        console.log( "Testing API Key..." );
        console.log( "API Key:", process.env.GEMINI_API_KEY ? "Found" : "Not Found" );

        // Try the simplest model name
        const model = genAI.getGenerativeModel( { model: "gemini-pro" } );
        const result = await model.generateContent( "Say hello in one word" );
        const response = await result.response;
        const text = response.text();

        console.log( "✅ Success! Model works:" );
        console.log( text );
    } catch ( error )
    {
        console.error( "❌ Error:", error.message );
        console.error( "Status:", error.status );
    }
}

testAPI();
