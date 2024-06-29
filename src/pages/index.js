"use client";
import React, { useState } from "react";
import { Nouns as initialNouns } from "@/data/Nouns";
import { FetchNoun } from "@/components/FetchNoun";

const Home = () => {
  const [nouns, setNouns] = useState(initialNouns);

  const updateNoun = (updatedNoun) => {
    setNouns((prevNouns) =>
      prevNouns.map((noun) =>
        noun.nounId === updatedNoun.nounId ? updatedNoun : noun
      )
    );
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 justify-center mx-auto gap-4 place-center flex-wrap w-100 md:max-w-[900px]">
      {nouns.map((noun) => (
        <FetchNoun key={noun.nounId} noun={noun} updateNoun={updateNoun} />
      ))}
    </div>
  );
};

export default Home;
