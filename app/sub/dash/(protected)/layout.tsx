import { AuthProvider } from "@/providers";

export default function ProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return(<AuthProvider>{children}</AuthProvider>)
}