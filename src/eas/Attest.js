import {
  EAS as EAS150,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import axios from "axios";

export const attestNoun = async (data) => {
  try {
    if (!data) {
      throw new Error("Invalid input parameters");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log("Provider:", provider);

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const signer = await provider.getSigner(data.userAddress);
    console.log("Signer:", signer);

    const easContractAddress = "0x4200000000000000000000000000000000000021";
    const schemaUID = "0";

    // Initialize EAS instance
    const eas = new EAS150(easContractAddress);

    // Connect signer to EAS instance
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "address AounAddress, uint256 NounId, address TokenizedNounAddress, address FractionalNounAddress"
    );
    const encodedData = schemaEncoder.encodeData([
      { name: "Title", value: data.Title, type: "string" },
      { name: "Owner", value: data.Owner, type: "address" },
      { name: "canPost", value: data.canPost, type: "bool" },
    ]);

    // Attest the data
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: data.userAddress,
        expirationTime: data.expirationTime,
        revocable: false,
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log("New attestation UID:", newAttestationUID);

    // Store the attestation data (assuming axios exists)
    const attestedData = {
      postData: data,
      attestUID: newAttestationUID,
    };
  } catch (error) {
    console.error("Unable to run OnChain Attest: ", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
