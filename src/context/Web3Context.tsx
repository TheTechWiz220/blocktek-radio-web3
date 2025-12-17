// src/context/Web3Context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useBalance,
  useReadContract
} from 'wagmi';
import { abstractTestnet } from '@/wagmi'; // Import from our config
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
  const { address, isConnected, chain, isConnecting: isAccountConnecting } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  // Balance
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address,
  });

  // DJ Status state
  const { data: djBalance, isLoading: djLoading, refetch: refetchDJ } = useReadContract({
    address: DJ_PASS_ADDRESS as `0x${string}`,
    abi: DJ_PASS_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isValidContractAddress(DJ_PASS_ADDRESS)
    }
  });

  const isDJ = !!(djBalance && Number(djBalance) > 0);

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Derived state
  const account = address || null;
  const isConnecting = isAccountConnecting || isConnectPending;
  const chainId = chain ? "0x" + chain.id.toString(16) : null;

  // Format balance
  const formattedBalance = balanceData
    ? parseFloat(ethers.formatEther(balanceData.value)).toFixed(4) + " " + balanceData.symbol
    : "0.00 ETH";

  // Check network - simplifying strict check
  useEffect(() => {
    // Wagmi handles "unsupported" state internally usually, but for our UI flag:
    // If we are connected and chain.id is not one of our configured chains, Wagmi might return chain as undefined or unsupported.
    if (chain?.unsupported) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }

    // DEBUG: Log chain state
    const checkProvider = async () => {
      if (window.ethereum) {
        const rawChainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log("SYNC CHECK:", {
          wagmiChainId: chain?.id,
          wagmiChainName: chain?.name,
          rawChainId: rawChainId,
          match: chain?.id === parseInt(rawChainId, 16)
        });
      }
    };
    checkProvider();

  }, [chain]);


  const connectWallet = async () => {
    // Default to first connector (usually Injected/MetaMask)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    } else {
      alert("No wallet connector found");
    }
  };

  const switchNetwork = async (targetChainId: string) => {
    // targetChainId is hex string, e.g. "0x2b74"
    const chainIdDecimal = parseInt(targetChainId, 16);
    console.log(`Attempting to switch network to decimal: ${chainIdDecimal} (Hex: ${targetChainId})`);

    try {
      if (!switchChainAsync) {
        console.error("switchChainAsync is not defined. Wagmi hook issue?");
        alert("Internal Error: Network switching not initialized.");
        return;
      }
      await switchChainAsync({ chainId: chainIdDecimal });
      console.log("Network switch successful or prompt open.");
    } catch (error: any) {
      console.error("Failed to switch network:", error);
      alert(`Failed to switch network: ${error.message || "Unknown error"}`);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Web3Context.Provider value={{
      account,
      isConnected,
      isWrongNetwork,
      connectWallet,
      disconnect: handleDisconnect,
      isConnecting,
      isDJ,
      djLoading,
      refreshDJStatus: async () => { await refetchDJ() },
      balance: formattedBalance,
      refreshBalance: async () => { await refetchBalance() },
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
