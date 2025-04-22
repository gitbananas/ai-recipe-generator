import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";


import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(''); // Clear previous results
  
    try {
      const formData = new FormData(event.currentTarget);
      const ingredientsString = formData.get("ingredients")?.toString() || "";
      
      // Input validation
      if (!ingredientsString.trim()) {
        throw new Error("Please enter at least one ingredient");
      }
  
      // Split ingredients properly
      const ingredients = ingredientsString
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);
  
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients,
      });
  
      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }
  
      setResult(data?.body || "No recipe could be generated. Please try different ingredients.");
  
    } catch (e) {
      setResult(`Error: ${e instanceof Error ? e.message : 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          Meet Your Personal
          <br />
          <span className="highlight">Recipe AI</span>
        </h1>
        <p className="description">
          Simply type a few ingredients using the format ingredient1,
          ingredient2, etc., and Recipe AI will generate an all-new recipe on
          demand...
        </p>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          <div className="recipe-result">
            {result && <pre>{result}</pre>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;