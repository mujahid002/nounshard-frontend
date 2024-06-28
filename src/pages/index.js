import React from "react";
import FetchNoun from "../components/FetchNoun";
import { Nouns } from "@/data/Nouns";

export default function Home() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 justify-center mx-auto gap-4 place-center flex-wrap w-full md:max-w-[900px]">
      {Nouns.map((noun) => (
        <FetchNoun key={noun.nounId} noun={noun} />
      ))}
    </div>
  );
}
