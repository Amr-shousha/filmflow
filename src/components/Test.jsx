import React, { useEffect, useState } from "react";
export default function Test() {
  const [currancyA, setCurrancyA] = useState("EUR");
  const [currancyB, setCurrancyB] = useState("USD");
  const [inputValue, setInputValue] = useState(0);
  const [outputValue, setOutputValue] = useState(0);

  useEffect(() => {
    async function Calc() {
      const url = ` https://api.frankfurter.app/latest?amount=${inputValue}&from=${currancyA}&to=${currancyB}  `;
      if (inputValue == 0) return;
      try {
        // Frankfurter API Example
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data);
        setOutputValue(data.rates[currancyB]);
      } catch (err) {}
    }
    Calc();
  }, [inputValue]);

  return (
    <div>
      <input
        type="number"
        onChange={(e) => {
          setInputValue(Number(e.target.value));
        }}
      />
      <select name="" id="A" onChange={(e) => setCurrancyA(e.target.value)}>
        <option value="EUR"> EUR</option>
        <option value="USD">USD </option>
        <option value="INR"> INR</option>
        <option value="CAD">CAD </option>
      </select>
      <select name="" id="B" onChange={(e) => setCurrancyB(e.target.value)}>
        <option value="USD">USD </option>
        <option value="EUR"> EUR</option>
        <option value="INR"> INR</option>
        <option value="CAD">CAD </option>
      </select>
      <h3> {outputValue !== 0 && outputValue}</h3>
      <h3> {inputValue !== 0 && inputValue}</h3>
      <h3> {currancyB && currancyB}</h3>
      <h3> {currancyA && currancyA}</h3>
    </div>
  );
}
