import React, { useState, useEffect } from 'react';
import contentData from '../data/contentData.json';
import { 
  PhoneCall, 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin, 
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSupportModal?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  PiggyBank: <PiggyBank className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />
};

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSupportModal }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
        ' • ' +
        now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-[#003c71] via-[#005596] to-[#002f5a] text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {contentData.brand.branch}
            </span>
            <span className="hidden md:inline text-white/50">|</span>
            <span className="hidden md:inline text-blue-100">{contentData.brand.kioskTitle}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="hidden sm:flex items-center gap-1.5 text-blue-100">
              <Clock className="w-3.5 h-3.5 text-blue-200" />
              <span>{timeStr}</span>
            </div>
            
            <a 
              href={`tel:${contentData.brand.counselorSupport.phone}`}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-2.5 py-1 rounded-full transition-all shadow-sm font-semibold"
              title="Hotline Chuyên viên tư vấn quầy"
            >
              <PhoneCall className="w-3 h-3 animate-bounce" />
              <span>Tư vấn: {contentData.brand.counselorSupport.displayPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo & Bank Title */}
          <div 
            onClick={() => setActiveTab('faq')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-12 w-auto flex items-center justify-center bg-white rounded-lg p-1 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
              <img 
                src={contentData.brand.logo} 
                alt="VietinBank Logo" 
                className="h-10 w-auto object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = contentData.brand.logoBackup;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#005596] tracking-tight">
                  Vietin<span className="text-[#EC1C24]">Bank</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-[#EC1C24] px-1.5 py-0.5 rounded">
                  Kiosk Quầy
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {contentData.brand.tagline} • Chi nhánh Cần Thơ
              </p>
            </div>
          </div>

          {/* Quick Counselor Badge */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-2 px-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-[#005596] flex items-center justify-center font-bold text-sm">
              {contentData.brand.counselorSupport.name.charAt(0)}
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-800">{contentData.brand.counselorSupport.name}</div>
              <div className="text-slate-500">{contentData.brand.counselorSupport.title}</div>
            </div>
          </div>
        </div>

        {/* 7 Feature Navigation Tabs (Scrollable on small devices) */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-1.5">
          {contentData.navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-md shadow-blue-900/20 font-semibold'
                    : 'text-slate-600 hover:text-[#005596] hover:bg-slate-100/80'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#005596]'}>
                  {iconMap[item.icon] || <HelpCircle className="w-4 h-4" />}
                </span>
                <span>{item.title}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
