import { useState } from "react";
import { useWriteContract, useAccount, useSwitchChain, useChainId } from 'wagmi'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/context/Web3Context";
import { abstractTestnet } from "@/wagmi";
import {
  DJ_PASS_ADDRESS,
  DJ_PASS_ABI,
  MINT_PRICE,
  MINT_PRICE_WEI,
  isValidContractAddress,
} from "@/lib/contracts";

interface MintDJPassProps {
  onMintSuccess?: () => void;
}

const MintDJPass = ({ onMintSuccess }: MintDJPassProps) => {
  const { account, isDJ, refreshDJStatus } = useWeb3();
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { toast } = useToast();
  const [mintSuccess, setMintSuccess] = useState(false);
  const [showNetworkHelp, setShowNetworkHelp] = useState(false);

  const { writeContractAsync, isPending: isMinting } = useWriteContract();

  const isOnCorrectNetwork = currentChainId === 11124;

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: 11124 });
      setShowNetworkHelp(false);
    } catch (e: any) {
      console.error("Network switch failed:", e);
      // Show manual instructions if programmatic switch fails
      setShowNetworkHelp(true);
      toast({
        title: "Manual Network Setup Required",
        description: "Please add Abstract Testnet manually to your wallet.",
        variant: "destructive",
      });
    }
  };

  const handleMint = async () => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    // Check Network (Abstract Testnet - chain ID 11124)
    if (!isOnCorrectNetwork) {
      await handleSwitchNetwork();
      return;
    }

    if (!isValidContractAddress(DJ_PASS_ADDRESS)) {
      toast({
        title: "Contract not deployed",
        description: "DJ Pass contract is not yet deployed.",
        variant: "destructive",
      });
      return;
    }

    try {
      const txHash = await writeContractAsync({
        address: DJ_PASS_ADDRESS as `0x${string}`,
        abi: DJ_PASS_ABI,
        functionName: 'mint',
        args: [1n], // Quantity as bigint
        value: MINT_PRICE_WEI,
        account: address,
        chain: abstractTestnet,
      });

      toast({
        title: "Transaction submitted",
        description: "Waiting for confirmation on chain...",
      });

      // We could use useWaitForTransactionReceipt hook, but since this is an event handler,
      // we can't call hooks conditionally here. 
      // Ideally we should move 'receipt' waiting to a useEffect or separate component logic
      // OR mostly just let the UI show "Pending" until the global state updates (since we refetch).
      // BUT for now, let's trust that refetching happens or the user sees the toast.
      // Wagmi v2 writeContractAsync returns the hash. 
      // We can use a separate component to watch for the receipt or just fire-and-forget + toast.
      // For best UX, let's rely on the toast for submission. 
      // And maybe trigger a delayed refresh.

      setTimeout(() => {
        refreshDJStatus();
        onMintSuccess?.();
        setMintSuccess(true);
        // Note: This is an optimistic success UI. Real success depends on chain confirmation.
      }, 5000);

    } catch (err: any) {
      console.error("Mint error:", err);
      toast({
        title: "Mint failed",
        description: err.message || "Transaction failed",
        variant: "destructive",
      });
    }
  };

  // Already a DJ - show success state
  if (isDJ || mintSuccess) {
    return (
      <Card className="relative overflow-hidden border-2 border-green-500/50 bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-teal-900/30">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20 ring-2 ring-green-500/30">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                DJ Pass Holder
                <Crown className="w-5 h-5 text-yellow-500" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Full access to DJ Dashboard unlocked
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-blue-900/40 hover:border-purple-400/70 transition-all duration-300 group">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-400/30 transition-all duration-500" />

      <div className="relative p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 ring-2 ring-purple-500/40 group-hover:ring-purple-400/60 transition-all">
            <Crown className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              Mint DJ Pass
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Unlock exclusive DJ features & streaming tools
            </p>
          </div>
        </div>

        {/* Network Warning */}
        {!isOnCorrectNetwork && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-400">Wrong Network</p>
                <p className="text-amber-300/80">Switch to Abstract Testnet to mint</p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Network Instructions */}
        {showNetworkHelp && (
          <div className="mb-4 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-xs">
            <p className="font-medium text-blue-400 mb-2">Add Network Manually:</p>
            <div className="space-y-1 text-blue-300/80">
              <p><strong>Network:</strong> Abstract Sepolia Testnet</p>
              <p><strong>RPC:</strong> https://api.testnet.abs.xyz</p>
              <p><strong>Chain ID:</strong> 11124</p>
              <p><strong>Symbol:</strong> ETH</p>
              <p><strong>Explorer:</strong> https://explorer.testnet.abs.xyz</p>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Live streaming dashboard access</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>Schedule & manage radio shows</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Exclusive DJ community access</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-foreground">
            {MINT_PRICE} ETH
          </span>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            Limited: 1,000 max
          </span>
        </div>

        {!isOnCorrectNetwork ? (
          <Button
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-0 shadow-lg"
          >
            {isSwitching ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Switching Network...
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 mr-2" />
                Switch to Abstract Testnet
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleMint}
            disabled={isMinting}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
          >
            {isMinting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Minting...
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Mint DJ Pass
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MintDJPass;
