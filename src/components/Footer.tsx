import { DonationDialog } from "./DonationDialog";

export function Footer() {
  return (
    <footer className="border-t py-4 mt-auto">
      <div className="container flex justify-center">
        <DonationDialog />
      </div>
    </footer>
  );
}