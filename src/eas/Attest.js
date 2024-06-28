import {
  EAS as EAS150,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import axios from "axios";
import { useGlobalContext } from "../context/Store";

import {
  EAS_ADDRESS,
  SCHEMA_UID,
  NOUN_ADDRESS,
  TOKENIZED_NOUN_ADDRESS,
  FRACTIONAL_NOUN_ADDRESS,
} from "@/constants/index";

export const attestNoun = async (data) => {
  const { userAddress, nativeBalance, setUserAddress, setNativeBalance } =
    useGlobalContext();
  try {
    if (!data) {
      throw new Error("Invalid input parameters");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log("Provider:", provider);

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const signer = await provider.getSigner(userAddress);
    console.log("Signer:", signer);

    // Initialize EAS instance
    const eas = new EAS150(EAS_ADDRESS);

    // Connect signer to EAS instance
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "address AounAddress, uint256 NounId, address TokenizedNounAddress, address FractionalNounAddress"
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "NounAddress", value: NOUN_ADDRESS, type: "address" },
      {
        name: "TokenizedNounAddress",
        value: TOKENIZED_NOUN_ADDRESS,
        type: "address",
      },
      {
        name: "FractionalNounAddress",
        value: FRACTIONAL_NOUN_ADDRESS,
        type: "address",
      },
      { name: "NounId", value: data.nounId, type: "uint256" },
      {
        name: "FractionalNounPrice",
        value: data.eachFNounPrice,
        type: "uint256",
      },
      { name: "EndTimestamp", value: data.endTimestamp, type: "uint48" },
      { name: "Divisor", value: data.divisor, type: "uint8" },
    ]);

    // Attest the data
    const tx = await eas.attest({
      schema: SCHEMA_UID,
      data: {
        recipient: userAddress,
        expirationTime: data.endTimestamp,
        revocable: false,
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log("New attestation UID:", newAttestationUID);
    return newAttestationUID;
  } catch (error) {
    console.error("Unable to run OnChain Attest: ", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
