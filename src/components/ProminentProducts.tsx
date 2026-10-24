import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  Sparkles, 
  Gift, 
  Star, 
  PhoneCall, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { ProductItem } from '../types/index.ts';

export const ProminentProducts: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [interestModalItem, setInterestModalItem] = useState<ProductItem | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const filteredItems = contentData.products.items.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  }) as ProductItem[];

  const handleInterestClick = (item: ProductItem) => {
    setInterestModalItem(item);
  };

  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Featured Header Card (With blue gradient & thin red border as requested in PDF) */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-2 border-[#EC1C24]/30 shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#005596]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EC1C24] text-white shadow-xs">
              <Star className="w-3.5 h-3.5 fill-white" /> {contentData.products.hotBadge}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#005596] text-white">
              <Gift className="w-3.5 h-3.5" /> Ưu Đãi Đặc Quyền Quầy Giao Dịch
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {contentData.products.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {contentData.products.desc}
          </p>
        </div>
      </div>

      {/* Filter Chips (Tất cả | Cá nhân | Hộ kinh doanh | Doanh nghiệp | Ưu đãi | Bán đấu giá tài sản) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {contentData.products.categories.map((cat) => {
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveFilter(cat.id);
                setActiveSlideIndex(0);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#005596] text-white shadow-md shadow-blue-900/20'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Carousel Featured View */}
      {filteredItems.length > 0 && (
        <div className="relative bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tiêu Điểm Sản Phẩm ({activeSlideIndex + 1}/{filteredItems.length})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Carousel Card */}
          {(() => {
            const currentItem = filteredItems[activeSlideIndex] || filteredItems[0];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Poster Image */}
                <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center p-2 group">
                  <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    className="max-h-[360px] w-auto object-contain rounded-xl group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/vietinbank-logo.jpg';
                    }}
                  />
                </div>

                {/* Info & Interest Action */}
                <div className="lg:col-span-6 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                    {currentItem.categoryLabel}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                    {currentItem.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentItem.desc}
                  </p>

                  <div className="space-y-2 pt-1">
                    {currentItem.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleInterestClick(currentItem)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#EC1C24] hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{contentData.products.interestButtonText}</span>
                    </button>

                    <a
                      href={`tel:${contentData.products.interestModal.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-3.5 bg-blue-50 hover:bg-blue-100 text-[#005596] font-semibold text-sm rounded-2xl border border-blue-200 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Tư vấn: {contentData.products.interestModal.displayPhone}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Grid of All Posters (Easy swipe/browse for mobile customers) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#005596]" />
          <span>Danh sách áp phích & sản phẩm giới thiệu</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border-2 border-slate-200/90 hover:border-[#005596] rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              <div className="space-y-4">
                {/* Poster Display */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 aspect-4/3 flex items-center justify-center p-2">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/vietinbank-logo.jpg';
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-[#005596]/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {prod.categoryLabel}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#005596] transition-colors leading-snug line-clamp-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {prod.desc}
                  </p>
                </div>
              </div>

              {/* Action Button: Tôi quan tâm */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleInterestClick(prod)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#EC1C24] hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{contentData.products.interestButtonText}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interest Modal (Required by PDF 5: "Khi khách bấm Tôi quan tâm...") */}
      {interestModalItem && (
        <div 
          onClick={() => setInterestModalItem(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-red-200 space-y-5 text-center relative animate-fadeIn"
          >
            <button
              onClick={() => setInterestModalItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-red-100 text-[#EC1C24] flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-8 h-8 fill-[#EC1C24]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005596]">
                {interestModalItem.name}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {contentData.products.interestModal.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {contentData.products.interestModal.message}
              </p>
            </div>

            {/* Direct Counselor Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-left flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {contentData.products.interestModal.contactPerson}
                </div>
                <div className="text-xs text-slate-500">
                  SĐT: {contentData.products.interestModal.displayPhone}
                </div>
              </div>

              <a
                href={`tel:${contentData.products.interestModal.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi tư vấn ngay</span>
              </a>
            </div>

            <button
              onClick={() => setInterestModalItem(null)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Đóng thông báo
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
