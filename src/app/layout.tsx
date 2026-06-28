import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from '@/providers/theme-provider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { RouteProvider } from '@/context/RouteContext';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} min-h-screen flex flex-col font-poppins`} suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RouteProvider>
                <CartProvider>
                  <Navbar />

                  {/* Main content grows to push footer down */}
                  <main className="min-h-screen flex-1">
                    {children}
                  </main>

                  <Footer />
                </CartProvider>
              </RouteProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

