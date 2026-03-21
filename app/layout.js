import { Inter } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "ReplyAI Support Chat",
  description: "ReplyAI lets any business deploy a smart AI chatbot on their website in minutes.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-[#050509] min-h-screen flex flex-col p-0 text-zinc-100 selection:bg-zinc-800 font-sans antialiased`}>
        <div className="fixed inset-0 -z-20 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        </div>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}