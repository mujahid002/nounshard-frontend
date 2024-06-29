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
import { attestNoun } from "@/eas/Attest";

export const FetchNoun = ({ noun, updateNoun }) => {
  const { userAddress, nativeBalance } = useGlobalContext();

  if (!noun) return null;

  const { nounId, fNounPrice, endTimestamp, divisor, approved, tokenized } =
    noun;

  const expireTime = () => {
    // Get the current UTC time
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDate = now.getUTCDate();

    // Create a new date for one year from now in UTC
    const oneYearFromNow = new Date(Date.UTC(utcYear + 1, utcMonth, utcDate));

    // Return the epoch time in milliseconds
    return oneYearFromNow.getTime();
  };

  const fillDetails = async (nounId) => {
    const price = document.getElementById("price").value;
    const divisor = document.getElementById("divisor").value;
    if (!price || !divisor) {
      alert("Please fill in all fields");
      return;
    }
    if (price <= 0 || divisor < 2) {
      alert(`Please check Price/Divisor before attesting!`);
      return;
    }

    const endTimestamp = expireTime();

    const data = {
      userAddress: userAddress,
      nounId: nounId,
      eachFNounPrice: price,
      divisor: divisor,
      endTimestamp: endTimestamp,
    };

    const checkStatus = await attestNoun(data);
    if (checkStatus) {
      updateNoun({
        ...noun,
        fNounPrice: price,
        divisor: divisor,
        endTimestamp: data.endTimestamp,
        tokenized: true,
      });
    }
  };

  const approveFirst = async (nounId) => {
    alert(
      `User needs to approve the tNoun Contract at ${TOKENIZED_NOUN_ADDRESS} before tokenizing it.`
    );

    try {
      if (!nounContract) {
        throw new Error("The contract or signer is not initialized.");
      }

      const trx = await nounContract.approve(
        TOKENIZED_NOUN_ADDRESS,
        nounId.toString(),
        {
          gasPrice: 3000000,
        }
      );
      const receipt = await trx.wait();

      if (receipt.status === 1) {
        alert(`Noun with ID ${nounId} has been approved for tokenization.`);
        updateNoun({ ...noun, approved: true });
      } else {
        console.error(
          `Approval transaction failed for noun with ID ${nounId}.`
        );
      }
    } catch (error) {
      console.error("Error approving noun:", error);
    }
  };

  return (
    <article className="flex flex-col gap-3 bg-white p-8 rounded-xl shadow-md text-center mb-6">
      <div className="relative w-full h-40">
        <img
          src={`https://noun.pics/${nounId}`}
          className="size-32"
          alt="demo"
        />
      </div>
      {/* <div className="text-lg">NOUN</div> */}
      <div className="text-lg">{nounId}</div>

      {approved && !tokenized && (
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

      {approved && !tokenized ? (
        <button
          onClick={() => fillDetails(noun.nounId)}
          className="bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors duration-500 text-emerald-500 rounded-md px-5 py-2"
        >
          Attest Details
        </button>
      ) : approved && tokenized ? (
        <button
          className="bg-gray-500 text-gray-300 cursor-not-allowed rounded-md px-5 py-2"
          disabled
        >
          Tokenized & Approved
        </button>
      ) : (
        <button
          onClick={() => approveFirst(noun.nounId)}
          className="bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors duration-500 text-emerald-500 rounded-md px-5 py-2"
        >
          Approve & Tokenize
        </button>
      )}
    </article>
  );
};
