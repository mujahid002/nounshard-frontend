"use client";
import React, { useState } from "react";
import { Nouns as initialNouns } from "@/constants/index";
import { FetchNoun } from "@/components/FetchNoun";

const ParentComponent = () => {
  const [nouns, setNouns] = useState(initialNouns);

  const updateNoun = (updatedNoun) => {
    setNouns((prevNouns) =>
      prevNouns.map((noun) =>
        noun.nounId === updatedNoun.nounId ? updatedNoun : noun
      )
    );
  };

  return (
    <div>
      {nouns.map((noun) => (
        <FetchNoun key={noun.nounId} noun={noun} updateNoun={updateNoun} />
      ))}
    </div>
  );
};

export default ParentComponent;
