import dotenv from 'dotenv';
dotenv.config( { path: '.env.local' } );

const apiKey = process.env.GEMINI_API_KEY;

async function listModels ()
{
    try
    {
        // Try v1beta
        console.log( "Fetching models from v1beta..." );
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${ apiKey }`
        );

        if ( !response.ok )
        {
            console.log( "v1beta failed, trying v1..." );
            const v1Response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models?key=${ apiKey }`
            );
            const v1Data = await v1Response.json();
            console.log( "Available models (v1):" );
            v1Data.models?.forEach( model =>
            {
                console.log( `- ${ model.name }` );
            } );
            return;
        }

        const data = await response.json();
        console.log( "Available models (v1beta):" );
        data.models?.forEach( model =>
        {
            console.log( `- ${ model.name } (supports: ${ model.supportedGenerationMethods?.join( ', ' ) })` );
        } );
    } catch ( error )
    {
        console.error( "Error:", error.message );
    }
}

listModels();
