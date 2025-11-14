// src/context/Web3Context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// DJ PASS NFT CONTRACT (REPLACE WITH YOURS)
const DJ_PASS_CONTRACT = "0xYourDJPassContract"; // ← UPDATE THIS
const DJ_PASS_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isWrongNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isDJ: boolean; // ← ADD THIS
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDJ, setIsDJ] = useState(false); // ← ADD THIS STATE HERE
  const TARGET_CHAIN = "0x1"; // Ethereum Mainnet

  const connectWallet = async () => {
    const injected = (window as any).ethereum;
    if (!injected) {
      alert("Install MetaMask or another web3 wallet[](https://metamask.io)");
      return;
    }

    // Handle multiple injected providers (Wallets that populate window.ethereum.providers)
    const getInjectedProvider = () => {
      if (injected.providers && Array.isArray(injected.providers)) {
        // prefer MetaMask if present
        return injected.providers.find((p: any) => p.isMetaMask) || injected.providers[0];
      }
      return injected;
    };

    const selected = getInjectedProvider();

    setIsConnecting(true);
    try {
      // use the selected provider for requests
      if (typeof selected.request === 'function') {
        await selected.request({ method: 'eth_requestAccounts' });
      } else if (typeof injected.request === 'function') {
        await injected.request({ method: 'eth_requestAccounts' });
      }

      const provider = new ethers.BrowserProvider(selected as any);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const network = await provider.getNetwork();
      const chainId = network.chainId.toString(16);
      if (chainId !== TARGET_CHAIN) {
        setIsWrongNetwork(true);
        try {
          const reqTarget = (selected && typeof selected.request === 'function') ? selected : injected;
          await reqTarget.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: TARGET_CHAIN }] });
          setIsWrongNetwork(false);
        } catch (err: any) {
          if (err.code === 4902) alert("Add Ethereum Mainnet to MetaMask.");
        }
      }

      // Check DJ status after connect ← ADD THIS CALL HERE
      checkDJStatus(address, provider);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsWrongNetwork(false);
    setIsDJ(false); // ← ADD THIS TO RESET DJ STATUS
  };

  // ADD THIS FUNCTION HERE
  const checkDJStatus = async (addr: string, provider: ethers.BrowserProvider) => {
    try {
      const contract = new ethers.Contract(DJ_PASS_CONTRACT, DJ_PASS_ABI, provider);
      const balance = await contract.balanceOf(addr);
      setIsDJ(Number(balance) > 0);
    } catch (err) {
      console.error("DJ check failed:", err);
      setIsDJ(false);
    }
  };

  useEffect(() => {
    const injected = (window as any).ethereum;
    if (!injected) return;

    const getInjectedProvider = () => {
      if (injected.providers && Array.isArray(injected.providers)) {
        return injected.providers.find((p: any) => p.isMetaMask) || injected.providers[0];
      }
      return injected;
    };

    const selected = getInjectedProvider();

    const handleAccounts = (accounts: string[]) => {
      setAccount(accounts[0] || null);
    };

    // attach listeners to the selected provider if available
    try {
      if (selected && typeof selected.on === 'function') {
        selected.on('accountsChanged', handleAccounts);
        selected.on('chainChanged', () => window.location.reload());
      } else if (typeof injected.on === 'function') {
        injected.on('accountsChanged', handleAccounts);
        injected.on('chainChanged', () => window.location.reload());
      }
    } catch (e) {
      console.warn('Failed to attach provider listeners', e);
    }

    // Auto-connect if already authorized
    (async () => {
      try {
        const provider = new ethers.BrowserProvider(selected as any);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          checkDJStatus(accounts[0].address, provider); // ← ADD THIS CALL HERE
        }
      } catch (err) {
        console.log('Auto-connect skipped');
      }
    })();

    return () => {
      try {
        if (selected && typeof selected.removeListener === 'function') {
          selected.removeListener('accountsChanged', handleAccounts);
        } else if (typeof injected.removeListener === 'function') {
          injected.removeListener('accountsChanged', handleAccounts);
        }
      } catch (e) {
        // ignore
      }
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
      isDJ, // ← ADD THIS TO THE CONTEXT VALUE
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
