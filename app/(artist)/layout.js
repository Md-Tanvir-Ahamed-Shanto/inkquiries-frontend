import Header from "@/components/common/Header";
import "../globals.css";
import Footer from "@/components/common/Footer";
import ToasterProvider from "../ToasterProvider";

export const metadata = {
  title: "Inkquiries - Tattoo Artist Platform",
  description: "Connect with talented tattoo artists and showcase your work",
};

export default function ArtistLayout({ children }) {
  return (
    <>
      <div className="p-4 bg-background text-foreground" suppressHydrationWarning>
      <Header />
      <ToasterProvider />
        {children}
      <Footer />
      </div>
    </>
  );
}
