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
    const injected = (window as any).ethereum;
    if (!injected) {
      alert("Install MetaMask or another web3 wallet (https://metamask.io)");
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
          if (err && err.code === 4902) {
            alert('Please add Ethereum Mainnet to your wallet.');
          }
        }
      }
    } catch (err: any) {
      console.error("Wallet connect failed:", err);
      if (err?.code !== 4001) alert("Connection failed: " + (err?.message || String(err)));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsWrongNetwork(false);
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
        if (accounts.length > 0) setAccount(accounts[0].address);
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
