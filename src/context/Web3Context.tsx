// src/context/Web3Context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isWrongNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const TARGET_CHAIN = "0x1"; // Ethereum Mainnet

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("Install MetaMask! https://metamask.io");
      return;
    }

    setIsConnecting(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const network = await provider.getNetwork();
      const chainId = network.chainId.toString(16);
      if (chainId !== TARGET_CHAIN) {
        setIsWrongNetwork(true);
        try {
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: TARGET_CHAIN }],
          });
          setIsWrongNetwork(false);
        } catch (err: any) {
          if (err.code === 4902) {
            alert("Please add Ethereum Mainnet to MetaMask.");
          }
        }
      }
    } catch (err: any) {
      console.error("Wallet connect failed:", err);
      if (err.code !== 4001) alert("Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsWrongNetwork(false);
  };

  useEffect(() => {
    if (!(window as any).ethereum) return;

    const handleAccounts = (accounts: string[]) => {
      setAccount(accounts[0] || null);
    };

    (window as any).ethereum.on("accountsChanged", handleAccounts);
    (window as any).ethereum.on("chainChanged", () => window.location.reload());

    // Auto-connect if already authorized
    (async () => {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      } catch (err) {
        console.log("Auto-connect skipped");
      }
    })();

    return () => {
      (window as any).ethereum.removeListener("accountsChanged", handleAccounts);
    };
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      isConnected: !!account,
      isWrongNetwork,
      connectWallet,
      disconnect,
      isConnecting,
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within Web3Provider");
  return context;
};
