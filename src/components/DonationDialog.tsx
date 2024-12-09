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

          {currency && walletAddress && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="font-medium mb-2">Adresse du portefeuille :</p>
              <p className="break-all text-sm">{walletAddress}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Envoyez vos {currency} à cette adresse, puis remplissez le formulaire ci-dessous avec les détails de la transaction.
              </p>
            </div>
          )}

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
            <p className="text-xs text-muted-foreground">
              Le hash de transaction est l'identifiant unique de votre transfert. Vous le trouverez dans votre portefeuille ou sur l'exchange après avoir effectué le transfert.
            </p>
          </div>

          <Button type="submit" className="w-full">
            Confirmer le don
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}