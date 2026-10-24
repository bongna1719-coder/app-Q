import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  Smartphone, 
  Apple, 
  Play, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Gift, 
  Percent,
  CheckCircle2
} from 'lucide-react';

export const DownloadIpay: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Generate QR code URLs using public QR service for quick scanning
  const iosQr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(contentData.downloadIpay.appleStoreUrl)}`;
  const androidQr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(contentData.downloadIpay.googlePlayUrl)}`;

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#003c71] via-[#005596] to-[#002f5a] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-200 border border-red-400/30">
            <Zap className="w-3.5 h-3.5 text-yellow-300" /> Ứng Dụng Ngân Hàng Số Thế Hệ Mới
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {contentData.downloadIpay.title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            {contentData.downloadIpay.subtitle}. Quét mã QR bằng camera điện thoại của Quý khách ngay tại quầy để tải và kích hoạt nhanh chóng trong 1 phút!
          </p>
        </div>
      </div>

      {/* 2 Big QR Cards for iOS & Android */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* iOS Card */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-900"></div>
          
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
            <Apple className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Dành cho iPhone & iPad</span>
          <h3 className="text-xl font-bold text-slate-900 mb-2">VietinBank iPay trên App Store</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-xs">
            Hỗ trợ iOS 13.0 trở lên, tối ưu mượt mà cho Face ID và NFC CCCD
          </p>

          {/* QR Code Container */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner mb-6 relative group/qr">
            <img
              src={iosQr}
              alt="QR Code Tải iPay trên App Store"
              className="w-48 h-48 object-contain rounded-lg"
              loading="lazy"
            />
            <div className="mt-2 text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-[#005596]" /> Quét bằng Camera iPhone
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <a
              href={contentData.downloadIpay.appleStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Apple className="w-5 h-5" />
              <span>Mở App Store</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(contentData.downloadIpay.appleStoreUrl, 'ios')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
              title="Sao chép đường link"
            >
              {copiedType === 'ios' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'ios' ? 'Đã sao chép' : 'Copy link'}</span>
            </button>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#005596]"></div>
          
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 fill-white" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Dành cho Samsung, Xiaomi, OPPO...</span>
          <h3 className="text-xl font-bold text-slate-900 mb-2">VietinBank iPay trên Google Play</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-xs">
            Hỗ trợ Android 8.0 trở lên, tương thích cảm biến vân tay và quét chip NFC
          </p>

          {/* QR Code Container */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner mb-6 relative group/qr">
            <img
              src={androidQr}
              alt="QR Code Tải iPay trên Google Play"
              className="w-48 h-48 object-contain rounded-lg"
              loading="lazy"
            />
            <div className="mt-2 text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-emerald-600" /> Quét bằng Zalo / Camera
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <a
              href={contentData.downloadIpay.googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#005596] hover:bg-[#003c71] text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mở Google Play</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(contentData.downloadIpay.googlePlayUrl, 'android')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
              title="Sao chép đường link"
            >
              {copiedType === 'android' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'android' ? 'Đã sao chép' : 'Copy link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#005596]" />
          <span>Tại sao Quý khách nên cài đặt VietinBank iPay ngay hôm nay?</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentData.downloadIpay.features.map((feat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#005596] flex items-center justify-center font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{feat.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
