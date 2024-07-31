import React, { useState, useEffect } from "react";
import Bar from "./Bar";
import BinarySearch from "./algorithms/Search/BinarySearch";
import Command from "./algorithms/Utils/Command";

const Display: React.FC = () => {
  // State to hold generator value
  const [currentCmd, setCurrentCmd] = useState<Command | null>(null);
  const arr: number[] = [2, 4, 5, 6, 7, 8, 10];

  useEffect(() => {
    const generator = new BinarySearch(arr, 6).generator();

    // Function to fetch next item from generator
    const fetchNextItem = () => {
      const { value, done } = generator.next();
      if (!done) {
        setCurrentCmd(value);
      } else {
        setCurrentCmd(null); // Reset state when generator is done
      }
    };

    // Clean-up function
    return () => {
      // Close generator if needed
      // (generators don't necessarily need to be closed manually in this simple example)
    };
  }, []); // Empty dependency array means it runs once on component mount

  return (
    <div>
      <h2>Generator Component</h2>
      <div>
        Current Item:{" "}
        {arr.map((num, key) => (
          <Bar key={key} num={num} />
        ))}
      </div>
    </div>
  );
};

export default Display;
