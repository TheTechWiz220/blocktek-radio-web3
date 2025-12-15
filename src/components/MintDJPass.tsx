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
  isValidContractAddress
} from "@/lib/contracts";

interface MintDJPassProps {
  onMintSuccess?: () => void;
}

const MintDJPass = ({ onMintSuccess }: MintDJPassProps) => {
  const { account, isDJ, refreshDJStatus } = useWeb3();
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
      const contract = new ethers.Contract(DJ_PASS_ADDRESS, DJ_PASS_ABI, signer);

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
          description: "Welcome to the DJ family. Your dashboard is now unlocked!",
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
