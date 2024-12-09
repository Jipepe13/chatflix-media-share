import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useDonation = () => {
  const [currency, setCurrency] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const { toast } = useToast();

  const handleCurrencySelect = async (value: string) => {
    setCurrency(value);
    const { data: walletData, error } = await supabase
      .from("crypto_wallets")
      .select("address")
      .eq("currency", value)
      .single();

    if (error) {
      console.error("Error fetching wallet address:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer l'adresse du portefeuille",
      });
      return;
    }

    setWalletAddress(walletData.address);
    setShowWallet(false);
  };

  const submitDonation = async () => {
    console.log("Submitting donation:", { currency, amount, email, transactionHash });

    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        throw new Error("Le montant doit être un nombre valide");
      }

      const { error: donationError } = await supabase.from("donations").insert({
        currency,
        amount: numericAmount,
        donor_email: email,
        transaction_hash: transactionHash,
      });

      if (donationError) throw donationError;

      const { error: emailError } = await supabase.functions.invoke("send-donation-email", {
        body: {
          donorEmail: email,
          amount: numericAmount,
          currency,
          transactionHash,
        },
      });

      if (emailError) throw emailError;

      setShowWallet(true);
      toast({
        title: "Merci pour votre don !",
        description: "Un email de confirmation vous a été envoyé.",
      });
    } catch (error) {
      console.error("Error processing donation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre don",
      });
    }
  };

  return {
    currency,
    amount,
    email,
    transactionHash,
    walletAddress,
    showWallet,
    setAmount,
    setEmail,
    setTransactionHash,
    handleCurrencySelect,
    submitDonation,
  };
};