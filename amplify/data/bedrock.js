  export function request(ctx) {
    const { ingredients = [] } = ctx.args;
    
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;
    
    return {
      resourcePath: `/model/anthropic.claude-3-7-sonnet-20250219-v1:0/invoke`,  // Update with correct model ID
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                }
              ]
            }
          ]
        }),
      },
    };
  }

    export function response(ctx) {
      try {
        const parsedBody = JSON.parse(ctx.result.body);
        
        // Add null checks and proper error handling
        if (!parsedBody || !parsedBody.content || !Array.isArray(parsedBody.content) || !parsedBody.content[0]) {
          return {
            body: "Unable to generate recipe. Please try again with different ingredients.",
          };
        }
    
        return {
          body: parsedBody.content[0].text,
        };
      } catch (error) {
        return {
          body: "Error processing the response. Please try again.",
        };
      }
    }




    export function request(ctx) {
      const { ingredients = [] } = ctx.args;
      
      const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}`;
      
      return {
        resourcePath: `/model/amazon.titan-text-express-v1/invoke`,  // Use appropriate Bedrock model
        method: "POST",
        params: {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputText: prompt,
            textGenerationConfig: {
              maxTokenCount: 1000,
              temperature: 0.7,
              topP: 0.9,
            }
          }),
        },
      };
  }
  
  export function response(ctx) {
      try {
          const parsedBody = JSON.parse(ctx.result.body);
          
          if (!parsedBody) {
              throw new Error('Empty response received');
          }
  
          // Adjust based on the actual Bedrock model response structure
          const generatedText = parsedBody.results?.[0]?.outputText;
          
          if (!generatedText) {
              throw new Error('No recipe generated in the response');
          }
  
          return {
              body: generatedText,
          };
      } catch (error) {
          console.error('Error processing response:', error);
          return {
              body: `Error: ${error.message || 'Unknown error occurred'}`,
              statusCode: 500
          };
      }
  }
  
  