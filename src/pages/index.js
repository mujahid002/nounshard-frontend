import React from "react";
import Noun from "../components/Noun";
import { Nouns } from "../data/Nouns";

export default function Home() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 justify-center mx-auto gap-4 place-center flex-wrap w-100 md:max-w-[900px]">
      {Nouns.map((noun) => (
        <Noun noun={noun} key={noun.nounId} />
      ))}
    </div>
  );
}
