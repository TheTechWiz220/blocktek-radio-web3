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
  balance: string;
  refreshBalance: () => Promise<void>;
  chainId: string | null;
  switchNetwork: (chainId: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDJ, setIsDJ] = useState(false);
  const [djLoading, setDjLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0.00");
  const [chainId, setChainId] = useState<string | null>(null);

  const TARGET_CHAIN = "0x1"; // Ethereum Mainnet

  const getInjectedProvider = useCallback(() => {
    const injected = (window as any).ethereum;
    if (!injected) return null;

    if (injected.providers && Array.isArray(injected.providers)) {
      return injected.providers.find((p: any) => p.isMetaMask) || injected.providers[0];
    }
    return injected;
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!account) {
      setBalance("0.00");
      return;
    }

    const selected = getInjectedProvider();
    if (!selected) return;

    try {
      const provider = new ethers.BrowserProvider(selected as any);
      const bal = await provider.getBalance(account);
      const formatted = parseFloat(ethers.formatEther(bal)).toFixed(4);
      setBalance(`${formatted} ETH`);
    } catch (err) {
      console.error("Failed to refresh balance:", err);
      // Don't reset balance on error to avoid flickering if it's transient
    }
  }, [account, getInjectedProvider]);

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

  // Refresh balance whenever DJ status is refreshed or account changes, effectively
  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const switchNetwork = async (targetChainId: string) => {
    const selected = getInjectedProvider();
    if (!selected) return;

    try {
      await selected.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        if (targetChainId === "0x2b74") {
          try {
            await selected.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x2b74",
                  chainName: "Abstract Testnet",
                  rpcUrls: ["https://api.testnet.abs.xyz"],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://explorer.testnet.abs.xyz"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add network:", addError);
            throw addError;
          }
        }
      } else {
        throw switchError;
      }
    }
  };

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
      const chainIdHex = "0x" + network.chainId.toString(16);
      setChainId(chainIdHex);

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
    setBalance("0.00");
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
        // refreshBalance will trigger via effect dependency on account (inside refreshBalance)
      } else {
        setAccount(null);
        setIsDJ(false);
        setBalance("0.00");
      }
    };

    const handleChainChanged = (chainId: string) => {
      // chainId comes as hex from buffer usually
      setChainId(chainId);
      window.location.reload();
    };

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
          const network = await provider.getNetwork();
          setChainId("0x" + network.chainId.toString(16));
          await checkDJStatus(accounts[0].address, provider);
          // refreshBalance will trigger via effect
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
      balance,
      refreshBalance,
      chainId,
      switchNetwork,
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
