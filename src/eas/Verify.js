import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import axios from "axios";

// async function fetchAttestation() {
//   // Use constants for configurations
//   const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";

//   // Initialize EAS and provider
//   const eas = new EAS150(EAS_CONTRACT_ADDRESS);
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   console.log("Provider:", provider);
//   eas.connect(provider);

//   // Define UID as a constant if it's not dynamic
//   const UID =
//     "0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69";

//   try {
//     const attestation = await eas.getAttestation(UID); // This function returns an attestation object
//     console.log(attestation);
//   } catch (error) {
//     console.error("Error fetching attestation:", error);
//   }
// }

// Schema ID for "Verified Account" attestation (replace if different)
const schemaId =
  "0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69";

// Replace with the recipient's Ethereum address to verify
const recipientAddress = "0x709d29dc073F42feF70B6aa751A8D186425b2750";

async function verifyAccount() {
  try {
    // Initialize the EAS SDK with the Sepolia network provider
    const eas = new EAS(schemaId, {
      provider: new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
      ),
    });

    // Fetch the attestation for the recipient address and schema ID
    const attestation = await eas.getAttestation(recipientAddress);

    // Check if attestation exists and has expected data
    if (
      attestation &&
      attestation.schema === schemaId &&
      attestation.issuer === "Coinbase"
    ) {
      console.log("Account is verified!");
    } else {
      console.log("Account verification failed or attestation not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

verifyAccount();

// fetchAttestation();
