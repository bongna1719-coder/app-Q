import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  ExternalLink, 
  Search, 
  Navigation, 
  Building2, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Branch } from '../types/index.ts';

export const BranchNetwork: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  const branches = contentData.branches.items as Branch[];

  const filteredBranches = branches.filter((b) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      b.name.toLowerCase().includes(term) ||
      b.branch.toLowerCase().includes(term) ||
      b.address.toLowerCase().includes(term)
    );
  });

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003c71] via-[#005596] to-[#002f5a] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <MapPin className="w-3.5 h-3.5 text-blue-300" /> Mạng Lưới Điểm Giao Dịch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {contentData.branches.title}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            {contentData.branches.subtitle}. Tìm kiếm nhanh địa chỉ, giờ mở cửa và bản đồ đường đi đến phòng giao dịch gần nhất.
          </p>
        </div>

        {/* Search input in banner */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên PGD, đường..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid of Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white border-2 border-slate-200/90 hover:border-[#005596] rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
          >
            <div className="space-y-4">
              {/* Branch Exterior Photo */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-16/10 border border-slate-200/80">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = './assets/vietinbank-logo.jpg';
                  }}
                />
                {branch.badge && (
                  <span className="absolute top-3 left-3 bg-[#005596]/95 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {branch.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">
                  STT: #{branch.id}
                </span>
              </div>

              {/* Info Details */}
              <div className="space-y-2.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005596] transition-colors leading-snug">
                  {branch.name}
                </h3>

                {/* Address + Google Maps Icon Link */}
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span>{branch.address}</span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#005596]" />
                    <span>Thời gian giao dịch:</span>
                  </div>
                  <div className="text-slate-600 text-[11px] space-y-0.5 pl-5">
                    <div>• <strong>Sáng:</strong> {branch.openingHours.morning}</div>
                    <div>• <strong>Chiều:</strong> {branch.openingHours.afternoon}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Maps & Direct Call */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
              {/* Google Maps Button with map pin icon */}
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#005596] rounded-xl font-bold text-xs transition-all active:scale-95 border border-blue-200"
                title="Mở chỉ đường trên Google Maps"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Chỉ đường Maps</span>
                <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
              </a>

              {/* Direct Telephone Call Button (Required: Hotline bấm có thể gọi được luôn) */}
              <a
                href={`tel:${branch.tel}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#EC1C24] hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm"
                title={`Gọi hotline ${branch.phone}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{branch.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">Không tìm thấy phòng giao dịch phù hợp</h4>
          <p className="text-xs text-slate-400">Vui lòng thử tìm kiếm bằng từ khoá khác hoặc xem tất cả danh sách</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-2 text-xs font-semibold text-[#005596] hover:underline"
          >
            Hiện toàn bộ 7 phòng giao dịch
          </button>
        </div>
      )}
    </section>
  );
};
