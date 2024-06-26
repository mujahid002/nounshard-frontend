import React from "react";
import Image from "next/image";

export default function Noun({ noun }) {
  const { nounId, image, price } = noun;

  return (
    <article className="flex flex-col gap-3 bg-white p-8 rounded-xl shadow-md text-center mb-6">
      {/* Render image using Next.js Image component */}
      <div className="relative w-full h-40">
        <Image
          src={image}
          alt={`Noun ${nounId}`}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-xl"
        />
      </div>

      <div className="text-lg">{nounId}</div>
      <div className="text-xl font-semibold mt-auto">$ {price}</div>
      <button className="bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors duration-500 text-emerald-500 rounded-md px-5 py-2">
        Tokenize This!
      </button>
    </article>
  );
}
