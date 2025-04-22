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

  }
  