import { useState } from "react";
import axios from "axios";
import { useCalculatedValues, useSeenIndices } from "./hooks";

export const Fibonacci = () => {
  const [currentIndex, setCurrentIndex] = useState("");
  const { data: seenIndices, reFetch: reFetchSeenIndices } = useSeenIndices();
  const { data: calculatedValues, reFetch: reFetchCalculatedValues } =
    useCalculatedValues();

  const handleInput = (event) => setCurrentIndex(event.target.value);
  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("/api/values", { index: currentIndex });
    reFetchSeenIndices();
    reFetchCalculatedValues();
    setCurrentIndex("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <label>Enter your index:</label>
        <input value={currentIndex} onChange={handleInput} />
        <button>Submit</button>
      </form>

      <h3>Indices I have seen:</h3>
      {seenIndices.map(({ number }) => number).join(", ")}

      <h3>Calculated values:</h3>
      {Object.entries(calculatedValues).map(([key, value]) => (
        <div key={key}>
          For index {key} I calculated {value}
        </div>
      ))}
    </div>
  );
};
