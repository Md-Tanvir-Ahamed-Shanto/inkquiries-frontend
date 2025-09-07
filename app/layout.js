import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Inkquiries - Tattoo Artist Platform",
  description: "Connect with talented tattoo artists and showcase your work",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
         <Toaster position="top-right" duration={2000} closeButton={true} richColors />
      </body>
    </html>
  );
}