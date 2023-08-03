import React, { useState } from "react";
import "./App.css";

const arraySize = 18;

const BloomFilter: React.FC = () => {
  const [bits, setBits] = useState<Array<number>>(Array(arraySize).fill(0));
  const [input, setInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const hashFunctions = [
    (item: string) => ((hashCode(item) % arraySize) + arraySize) % arraySize,
    (item: string) =>
      (((hashCode(item) * 2 + 1) % arraySize) + arraySize) % arraySize,
    (item: string) =>
      (((hashCode(item) * 3 + 2) % arraySize) + arraySize) % arraySize,
  ];

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const character = str.charCodeAt(i);
      hash = (hash << 5) - hash + character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const addToBloomFilter = (item: string): void => {
    const newBits = [...bits];
    hashFunctions.forEach((hash) => {
      const index = hash(item);
      newBits[index] = 1;
    });
    setBits(newBits);
  };

  const lookup = (item: string): boolean => {
    for (const hash of hashFunctions) {
      const index = hash(item);
      if (bits[index] !== 1) return false;
    }
    return true;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
    setSearch("");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
    setInput("");
  };

  const handleAdd = (): void => {
    addToBloomFilter(input);
    setInput("");
  };

  const handleSearchClick = (): void => {
    const result = lookup(search);
    setSearchResult(result ? "Maybe present" : "Definitely not present");
  };

  return (
    <div className="container">
      <div className="bloomfilter">
        <p>
          Bloom Filter Bits: <br /> [ {bits.join(", ")} ]
        </p>

        <div className="backInputs">
          <div className="">
            <input value={input} onChange={handleInput} />
            <button onClick={handleAdd}>Add to Bloom Filter</button>
          </div>

          <div className="">
            <input value={search} onChange={handleSearch} />
            <button onClick={handleSearchClick}>
              Search into a bloomfilter
            </button>
          </div>
        </div>

        {searchResult && <p>Result: {searchResult}</p>}
        <br />
        <button
          className="reset"
          onClick={() => {
            setBits(Array(arraySize).fill(0));
            setSearchResult("");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default BloomFilter;
