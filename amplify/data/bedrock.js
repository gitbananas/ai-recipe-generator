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
    const parsedBody = JSON.parse(ctx.result.body);
    return {
      body: parsedBody.content[0].text,
    };
  }
  