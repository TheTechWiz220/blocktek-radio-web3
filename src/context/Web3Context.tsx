// src/context/Web3Context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { DJ_PASS_ADDRESS, DJ_PASS_ABI, isValidContractAddress } from '@/lib/contracts';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isWrongNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isDJ: boolean;
  djLoading: boolean;
  refreshDJStatus: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDJ, setIsDJ] = useState(false);
  const [djLoading, setDjLoading] = useState(false);
  
  const TARGET_CHAIN = "0x1"; // Ethereum Mainnet

  const getInjectedProvider = useCallback(() => {
    const injected = (window as any).ethereum;
    if (!injected) return null;
    
    if (injected.providers && Array.isArray(injected.providers)) {
      return injected.providers.find((p: any) => p.isMetaMask) || injected.providers[0];
    }
    return injected;
  }, []);

  const checkDJStatus = useCallback(async (addr: string, provider: ethers.BrowserProvider) => {
    if (!isValidContractAddress(DJ_PASS_ADDRESS)) {
      console.log("DJ Pass contract not deployed yet");
      setIsDJ(false);
      return;
    }

    setDjLoading(true);
    try {
      const contract = new ethers.Contract(DJ_PASS_ADDRESS, DJ_PASS_ABI, provider);
      const balance = await contract.balanceOf(addr);
      setIsDJ(Number(balance) > 0);
    } catch (err) {
      console.error("DJ check failed:", err);
      setIsDJ(false);
    } finally {
      setDjLoading(false);
    }
  }, []);

  const refreshDJStatus = useCallback(async () => {
    if (!account) return;
    
    const selected = getInjectedProvider();
    if (!selected) return;
    
    try {
      const provider = new ethers.BrowserProvider(selected as any);
      await checkDJStatus(account, provider);
    } catch (err) {
      console.error("Failed to refresh DJ status:", err);
    }
  }, [account, getInjectedProvider, checkDJStatus]);

  const connectWallet = async () => {
    const selected = getInjectedProvider();
    if (!selected) {
      alert("Install MetaMask or another web3 wallet");
      return;
    }

    setIsConnecting(true);
    try {
      await selected.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(selected as any);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const network = await provider.getNetwork();
      const chainId = "0x" + network.chainId.toString(16);
      
      if (chainId !== TARGET_CHAIN) {
        setIsWrongNetwork(true);
        try {
          await selected.request({ 
            method: 'wallet_switchEthereumChain', 
            params: [{ chainId: TARGET_CHAIN }] 
          });
          setIsWrongNetwork(false);
        } catch (err: any) {
          if (err.code === 4902) {
            alert("Please add Ethereum Mainnet to MetaMask.");
          }
        }
      }

      await checkDJStatus(address, provider);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsWrongNetwork(false);
    setIsDJ(false);
  };

  useEffect(() => {
    const selected = getInjectedProvider();
    if (!selected) return;

    const handleAccounts = (accounts: string[]) => {
      if (accounts[0]) {
        setAccount(accounts[0]);
        // Re-check DJ status when account changes
        const provider = new ethers.BrowserProvider(selected as any);
        checkDJStatus(accounts[0], provider);
      } else {
        setAccount(null);
        setIsDJ(false);
      }
    };

    const handleChainChanged = () => window.location.reload();

    try {
      selected.on('accountsChanged', handleAccounts);
      selected.on('chainChanged', handleChainChanged);
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
          await checkDJStatus(accounts[0].address, provider);
        }
      } catch (err) {
        console.log('Auto-connect skipped');
      }
    })();

    return () => {
      try {
        selected.removeListener('accountsChanged', handleAccounts);
        selected.removeListener('chainChanged', handleChainChanged);
      } catch (e) {
        // ignore
      }
    };
  }, [getInjectedProvider, checkDJStatus]);

  return (
    <Web3Context.Provider value={{
      account,
      isConnected: !!account,
      isWrongNetwork,
      connectWallet,
      disconnect,
      isConnecting,
      isDJ,
      djLoading,
      refreshDJStatus,
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
