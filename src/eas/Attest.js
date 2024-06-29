import {
  EAS as EAS150,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import axios from "axios";

import {
  EAS_ADDRESS,
  SCHEMA_UID,
  NOUN_ADDRESS,
  TOKENIZED_NOUN_ADDRESS,
  FRACTIONAL_NOUN_ADDRESS,
  tNounContract,
  signer,
} from "@/constants/index";

export const attestNoun = async (data) => {
  try {
    if (!data) {
      throw new Error("Invalid input parameters");
    }

    // const provider = new ethers.BrowserProvider(window.ethereum);
    // console.log("Provider:", provider);

    // await window.ethereum.request({ method: "eth_requestAccounts" });

    // const signer = await provider.getSigner(userAddress);
    // console.log("Signer:", signer);

    // Initialize EAS instance
    const eas = new EAS150(EAS_ADDRESS);

    // Connect signer to EAS instance
    eas.connect(signer);

    const fractionalNounPriceInWei = ethers.parseUnits(
      data.eachFNounPrice.toString(),
      18
    );

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "address NounAddress, address TokenizedNounAddress, address FractionalNounAddress, uint256 NounId, uint256 FractionalNounPrice, uint48 EndTimestamp, uint8 Divisor"
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
        value: fractionalNounPriceInWei,
        type: "uint256",
      },
      { name: "EndTimestamp", value: data.endTimestamp, type: "uint48" },
      { name: "Divisor", value: data.divisor, type: "uint8" },
    ]);

    // Attest the data
    // try {
    const trx = await eas.attest({
      schema: SCHEMA_UID,
      data: {
        recipient: TOKENIZED_NOUN_ADDRESS,
        expirationTime: data.endTimestamp / 1000,
        revocable: false,
        data: encodedData,
      },
    });
    const newAttestationUID = await trx.wait();

    console.log("New attestation UID:", newAttestationUID);

    alert(`Set Fractional Noun Details to the Contract`);
    const tx = await tNounContract.setTNounIdDetails(
      data.nounId.toString(),
      fractionalNounPriceInWei.toString(),
      data.divisor.toString(),
      {
        gasPrice: 5000000,
      }
    );
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      return true;
    }
    //   const attestation = await eas.getAttestation(newAttestationUID);

    //   if (attestation.attester == data.userAddress) {
    //     alert(`Set Fractional Noun Details to the Contract`);
    //     const trx = await tNounContract.setTNounIdDetails(
    //       data.nounId.toString(),
    //       data.eachFNounPrice.toString(),
    //       data.divisor.toString(),
    //       {
    //         gasPrice: 5000000,
    //       }
    //     );
    //     const receipt = await trx.wait();
    //     if (receipt.status === 1) {
    //       return true;
    //     }
    //   }
    // } catch (error) {
    //   if (error.reason) {
    //     console.error("Custom Error:", error.reason);
    //   } else {
    //     console.error("Unknown Error:", error);
    //   }
    //   throw error; // Re-throw for handling in calling function
    // }

    return false;
  } catch (error) {
    console.error("Unable to run OnChain Attest: ", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
