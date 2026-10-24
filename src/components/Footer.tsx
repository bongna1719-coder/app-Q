import React from 'react';
import contentData from '../data/contentData.json';
import { PhoneCall, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#002f5a] text-white border-t border-blue-900 mt-12 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Bank Branding */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                Vietin<span className="text-[#EC1C24]">Bank</span>
              </span>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              {contentData.brand.subName}
              <br />
              <strong>{contentData.brand.branch}</strong>
            </p>
            <div className="text-[11px] text-blue-300">
              Số 59-59A Phan Đình Phùng, P. Ninh Kiều, TP. Cần Thơ
            </div>
          </div>

          {/* Col 2: Counselor Hotline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Chuyên Viên Tư Vấn Tại Quầy
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="font-semibold text-white">{contentData.brand.counselorSupport.name}</div>
                <div className="text-blue-200 text-[11px]">{contentData.brand.counselorSupport.title}</div>
                <a 
                  href={`tel:${contentData.brand.counselorSupport.phone}`}
                  className="mt-1 inline-flex items-center gap-1 text-[#EC1C24] font-bold hover:underline"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{contentData.brand.counselorSupport.displayPhone}</span>
                </a>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="font-semibold text-white">{contentData.brand.counselorProduct.name}</div>
                <div className="text-blue-200 text-[11px]">{contentData.brand.counselorProduct.title}</div>
                <a 
                  href={`tel:${contentData.brand.counselorProduct.phone}`}
                  className="mt-1 inline-flex items-center gap-1 text-[#EC1C24] font-bold hover:underline"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{contentData.brand.counselorProduct.displayPhone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Tính Năng Tương Tác
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-100">
              {contentData.navigation.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => {
                      setActiveTab(n.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-yellow-300 transition-colors text-left cursor-pointer"
                  >
                    • {n.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Kiosk Security & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Bảo Mật & An Toàn
            </h4>
            <p className="text-xs text-blue-200 leading-relaxed">
              Kiosk phục vụ khách hàng tra cứu thông tin và trải nghiệm số tại quầy giao dịch. Mọi dữ liệu cá nhân không bị lưu trữ ngoài thiết bị của quý khách.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" /> An toàn & Bảo mật ngân hàng
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-300 gap-2 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank) - Chi nhánh Cần Thơ.
          </div>
          <div className="flex items-center gap-1">
            <span>Đồng hành cùng phát triển</span> • <span>Nâng giá trị cuộc sống</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
