import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/constants/crypto";
import { useDonation } from "@/hooks/useDonation";

export function DonationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const {
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
  } = useDonation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDonation();
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