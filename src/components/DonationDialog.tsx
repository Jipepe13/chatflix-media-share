import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SUPPORTED_CURRENCIES = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "BNB", label: "Binance Coin (BNB)" },
  { value: "DOGE", label: "Dogecoin (DOGE)" },
  { value: "SHIB", label: "Shiba Inu (SHIB)" },
  { value: "PEPE", label: "Pepe (PEPE)" },
];

export function DonationDialog() {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting donation:", { currency, amount, email, transactionHash });

    try {
      // Convert amount to number before sending to Supabase
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        throw new Error("Le montant doit être un nombre valide");
      }

      // Save donation to database
      const { error: donationError } = await supabase.from("donations").insert({
        currency,
        amount: numericAmount, // Now sending a number instead of a string
        donor_email: email,
        transaction_hash: transactionHash,
      });

      if (donationError) throw donationError;

      // Send confirmation emails
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Faire un don</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faire un don en cryptomonnaie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="currency">Cryptomonnaie</label>
            <Select onValueChange={handleCurrencySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une cryptomonnaie" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount">Montant</label>
            <Input
              id="amount"
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="transactionHash">Hash de la transaction</label>
            <Input
              id="transactionHash"
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Confirmer le don
          </Button>

          {showWallet && walletAddress && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="font-medium mb-2">Adresse du portefeuille :</p>
              <p className="break-all">{walletAddress}</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}