import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI NOVDEV - Multi AI Chat Platform',
  description: 'Chat dengan berbagai AI: Gemini, ChatGPT, Claude, dan Ollama dalam satu platform',
  keywords: 'AI, Chat, Gemini, ChatGPT, Claude, Ollama, AI Assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}