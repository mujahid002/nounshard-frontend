import Link from "next/link";
import { useGlobalContext } from "../context/Store";
import { useEffect } from "react";
import { ethers } from "ethers";

export default function NavBar() {
  const { userAddress, nativeBalance, setUserAddress, setNativeBalance } =
    useGlobalContext();

  const ConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "Your browser doesn't seem to support connecting to Ethereum wallets. Please consider using a compatible browser like Chrome, Firefox, or Brave with a wallet extension like MetaMask."
        );
      }

      const ethereum = window.ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum);

      // Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        console.log("User rejected account connection.");
        return;
      }

      const [address] = accounts;
      setUserAddress(address);

      // Check if the network is baseSepolia
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const baseSepoliaChainId = "0x14a34"; // 84532 in hexadecimal

      if (chainId !== baseSepoliaChainId) {
        console.log("The chainId is not Base. Switching network...");
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: baseSepoliaChainId }],
        });
      } else {
        console.log("The chainId is Base.");
      }

      // Fetch the native balance (ETH)
      const nativeBalance = await provider.getBalance(address);
      setNativeBalance(ethers.utils.formatEther(nativeBalance));

      // Subscribe to account changes
      ethereum.on("accountsChanged", async (newAccounts) => {
        const newAddress = newAccounts.length > 0 ? newAccounts[0] : "";
        setUserAddress(newAddress);
        console.log("Account changed, new address:", newAddress);

        // Update balances on account change
        if (newAddress) {
          const newNativeBalance = await provider.getBalance(newAddress);
          setNativeBalance(ethers.utils.formatEther(newNativeBalance));
        } else {
          setNativeBalance("0");
        }
      });
    } catch (error) {
      console.error("Install metamask OR unable to call", error);
    }
  };

  useEffect(() => {
    ConnectWallet();
  }, []);

  return (
    <nav className="py-5 px-12 flex justify-between items-center">
      <Link href="/">
        <p className="bg-white text-3xl font-bold underline underline-offset-4 decoration-wavy decoration-2 decoration-purple-500 cursor-pointer">
          {"NounShards"}
        </p>
      </Link>
      {userAddress && userAddress.length > 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-purple-500">{userAddress}</p>
          <div className="flex gap-4 items-center justify-center">
            <p className="text-purple-500">
              {nativeBalance
                ? "Base: " + parseFloat(nativeBalance).toFixed(2)
                : "Loading..."}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={ConnectWallet}
          className="bg-purple-50 hover:bg-purple-500 hover:text-white transition-colors duration-500 text-purple-500 rounded-md px-5 py-2"
        >
          Connect Metamask
        </button>
      )}
    </nav>
  );
}
