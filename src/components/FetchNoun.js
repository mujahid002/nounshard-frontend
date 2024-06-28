"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import {
  NOUN_ADDRESS,
  NOUN_ABI,
  TOKENIZED_NOUN_ADDRESS,
  nounContract,
  tNounContract,
} from "@/constants/index";
import { useGlobalContext } from "../context/Store";

export const FetchNoun = ({ noun }) => {
  const { userAddress, nativeBalance } = useGlobalContext();
  // Ensure `noun` is defined before destructuring
  if (!noun) return null;

  // Destructure `nounId` and `image` from `noun`
  const { nounId, fNounPrice, endTimestamp, divisor, approved, tokenized } =
    noun;
  // const approved=useState(false)
  const expireTime = () => {
    const now = Date.now();

    // Calculate timestamp for one year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const oneYearFromNowTimestamp = oneYearFromNow.getTime();
    return oneYearFromNowTimestamp;
  };

  const fillDetails = (nounId) => {
    const price = document.getElementById("price").value;
    const divisor = document.getElementById("divisor").value;
    if (!price || !divisor) {
      alert("Please fill in all fields");
      return;
    }

    const data = {
      nounId: nounId,
      eachFNounPrice: price,
      divisor: divisor,
      endTimestamp: expireTime(),
    };
  };

  const approveFirst = async (nounId) => {
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // await window.ethereum.request({ method: "eth_requestAccounts" });

    // const signer = await provider.getSigner();
    // console.log("Provider:", signer);
    // const nounContractWithSigner = signer
    //   ? new ethers.Contract(NOUN_ADDRESS, NOUN_ABI, signer)
    //   : null;
    // const nounContract = nounContractWithSigner?.connect(signer);
    console.log("nounContract", nounContract);

    alert(
      `User needs to approve the tNoun Contract at ${TOKENIZED_NOUN_ADDRESS} before tokenizing it.`
    );

    try {
      // Ensure that nounContractWithSigner is correctly initialized
      if (!nounContract) {
        throw new Error("The contract or signer is not initialized.");
      }

      const parsedNounId = ethers.parseEther(nounId.toString());

      const trx = await nounContract.approve(
        TOKENIZED_NOUN_ADDRESS,
        nounId.toString(),
        {
          gasPrice: 3000000,
        }
      );
      const receipt = await trx.wait();
      console.log(receipt);

      if (receipt.status === 1) {
        alert(`Noun with ID ${nounId} has been approved for tokenization.`);
        console.log(
          `Noun with ID ${nounId} has been approved for tokenization.`
        );
        // Update the approval status in your application state
        // For example, you might have a state or an object representing the noun
        // noun.approved = true;
      } else {
        console.error(
          `Approval transaction failed for noun with ID ${nounId}.`
        );
      }
    } catch (error) {
      console.error("Error approving noun:", error);
      // Handle error as needed, e.g., display a message to the user
    }
  };

  // Use the destructured values to construct the image URL and other content
  return (
    <article className="flex flex-col gap-3 bg-white p-8 rounded-xl shadow-md text-center mb-6">
      <div className="relative w-full h-40">
        {/* <Image
          src={`https://noun.pics/${nounId}`} // Use the image property from the object
          alt={`Noun ${nounId}`}
          width={300}
          height={200}
          // unoptimized
          layout="responsive"
          className="rounded-xl"
        /> */}
        <img
          src={`https://noun.pics/${nounId}`}
          className="size-32"
          alt="demo"
        />
      </div>
      <div className="text-lg">{nounId}</div>

      {noun.approved && (
        <div className="">
          <input
            type="number"
            id={`price`}
            placeholder="fNoun Price "
            className="rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500 mb-2"
            style={{ minHeight: "10px", maxWidth: "150px" }}
            required
          />
          <input
            type="number"
            id={`divisor`}
            placeholder="Divisor upto 250!..."
            className="rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500 mb-2"
            style={{ minHeight: "10px", maxWidth: "150px" }}
            required
          />
        </div>
      )}

      {noun.tokenized ? (
        <button
          onClick={() => fillDetails(noun.nounId)}
          className="bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors duration-500 text-emerald-500 rounded-md px-5 py-2"
        >
          Set Details
        </button>
      ) : (
        <button
          onClick={() => approveFirst(noun.nounId)}
          className="bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors duration-500 text-emerald-500 rounded-md px-5 py-2"
        >
          Tokenize Noun
        </button>
      )}
    </article>
  );
};
