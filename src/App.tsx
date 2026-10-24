import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { DownloadIpay } from './components/DownloadIpay.tsx';
import { GameHub } from './components/GameHub.tsx';
import { DepositCalculator } from './components/DepositCalculator.tsx';
import { LoanCalculator } from './components/LoanCalculator.tsx';
import { ProminentProducts } from './components/ProminentProducts.tsx';
import { BranchNetwork } from './components/BranchNetwork.tsx';
import { Footer } from './components/Footer.tsx';
import gsap from 'gsap';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // GSAP smooth page transition on activeTab change
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      {/* Top Header & Brand Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main ref={mainContentRef} className="flex-1">
        {activeTab === 'faq' && <FaqSection />}
        {activeTab === 'download_ipay' && <DownloadIpay />}
        {activeTab === 'games' && <GameHub />}
        {activeTab === 'deposit_calc' && <DepositCalculator />}
        {activeTab === 'loan_calc' && <LoanCalculator />}
        {activeTab === 'products' && <ProminentProducts />}
        {activeTab === 'branches' && <BranchNetwork />}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
