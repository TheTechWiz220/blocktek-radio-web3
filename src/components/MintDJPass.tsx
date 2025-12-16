import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/context/Web3Context";
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
  const { account, isDJ, refreshDJStatus, switchNetwork, chainId } = useWeb3();
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const handleMint = async () => {
    if (!account || !window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    // Check Network (Abstract Testnet)
    if (chainId !== "0x2b58") {
      try {
        await switchNetwork("0x2b58");
        // We return here because switchNetwork likely triggers page reload or state change. 
        // User will need to click Mint again after switch.
        return;
      } catch (e) {
        toast({
          title: "Wrong Network",
          description: "Please switch to Abstract Testnet to mint.",
          variant: "destructive",
        });
        return;
      }
    }

    if (!isValidContractAddress(DJ_PASS_ADDRESS)) {
      toast({
        title: "Contract not deployed",
        description: "DJ Pass contract is not yet deployed. Coming soon!",
        variant: "destructive",
      });
      return;
    }
    setIsMinting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        DJ_PASS_ADDRESS,
        DJ_PASS_ABI,
        signer
      );

      // Get current mint price from contract (more reliable)
      const price = await contract.MINT_PRICE();

      // Send transaction
      const tx = await contract.mint(1, { value: price });

      toast({
        title: "Transaction submitted",
        description: "Waiting for confirmation on chain...",
      });

      // Wait for receipt — this properly detects confirmation
      const receipt = await provider.waitForTransactionReceipt(tx.hash);

      if (receipt.status === 1) {
        setMintSuccess(true);
        toast({
          title: "DJ Pass Minted! 🎧",
          description:
            "Welcome to the DJ family. Your dashboard is now unlocked!",
        });
        await refreshDJStatus();
        onMintSuccess?.();
      } else {
        throw new Error("Transaction failed on chain");
      }
    } catch (err: any) {
      console.error("Mint error:", err);

      let errorMessage = "Transaction failed. Please try again.";
      if (err.code === "ACTION_REJECTED") {
        errorMessage = "Transaction cancelled by user.";
      } else if (err.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH balance for mint.";
      } else if (err.message?.includes("Exceeds wallet limit")) {
        errorMessage = "You've reached the maximum mints per wallet.";
      } else if (err.message?.includes("Exceeds max supply")) {
        errorMessage = "All DJ Passes have been minted!";
      } else if (err.message?.includes("timeout")) {
        errorMessage = "Transaction timed out. Check your network.";
      }

      toast({
        title: "Mint failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
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
      </div>
    </Card>
  );
};

export default MintDJPass;
