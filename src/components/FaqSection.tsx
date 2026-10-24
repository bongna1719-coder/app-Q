import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  KeyRound, 
  CreditCard, 
  Fingerprint, 
  FileText, 
  CalendarClock, 
  Youtube, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  PhoneCall, 
  X, 
  Maximize2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquareOff
} from 'lucide-react';
import { FaqItem } from '../types/index.ts';

const iconCatalog: Record<string, React.ReactNode> = {
  'forgot-password': <KeyRound className="w-6 h-6 text-amber-500" />,
  'close-card': <CreditCard className="w-6 h-6 text-rose-500" />,
  'biometric': <Fingerprint className="w-6 h-6 text-emerald-500" />,
  'e-tax': <FileText className="w-6 h-6 text-blue-500" />,
  'booking': <CalendarClock className="w-6 h-6 text-purple-500" />
};

export const FaqSection: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'success' | 'need_help' | 'ended'>('idle');

  const selectedTopic = contentData.faq.items.find(
    (item) => item.id === selectedTopicId
  ) as FaqItem | undefined;

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setFeedbackState('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    setSelectedTopicId(null);
    setFeedbackState('idle');
  };

  const handleEndChat = () => {
    setFeedbackState('ended');
  };

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* If No Topic is Selected: Show Topic Selection Grid */}
      {!selectedTopic ? (
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#005596]">
              <HelpCircle className="w-3.5 h-3.5" /> Hỗ trợ khách hàng tại quầy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {contentData.faq.question}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Chạm vào tình huống quý khách đang cần xử lý để xem quy trình hướng dẫn chi tiết từng bước bằng hình ảnh & video.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contentData.faq.items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleSelectTopic(item.id)}
                className="group relative bg-white border border-slate-200/90 hover:border-[#005596] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent -mr-6 -mt-6 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:scale-105 transition-transform shadow-xs">
                      {iconCatalog[item.id] || <HelpCircle className="w-6 h-6 text-[#005596]" />}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full group-hover:bg-blue-50 group-hover:text-[#005596] transition-colors">
                      {item.steps.length} bước
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005596] transition-colors mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#005596]">
                  <span className="flex items-center gap-1 group-hover:underline">
                    Xem hướng dẫn chi tiết
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-[#005596] group-hover:text-white flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#005596] text-white flex items-center justify-center shrink-0 shadow-sm">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Cần sự hỗ trợ trực tiếp từ Chuyên viên tại quầy?</h4>
                <p className="text-xs text-slate-600">
                  Chuyên viên {contentData.brand.counselorSupport.name} luôn sẵn sàng hỗ trợ quý khách thực hiện các thao tác.
                </p>
              </div>
            </div>
            <a
              href={`tel:${contentData.brand.counselorSupport.phone}`}
              className="inline-flex items-center gap-2 bg-[#005596] hover:bg-[#003c71] active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gọi {contentData.brand.counselorSupport.displayPhone}</span>
            </a>
          </div>
        </div>
      ) : (
        /* If Topic Selected: Step-by-step Interactive Viewer */
        <div className="space-y-8 animate-fadeIn">
          {/* Breadcrumb / Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToMenu}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh mục</span>
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
                {selectedTopic.category}
              </span>
            </div>

            {selectedTopic.videoUrl && (
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-sm"
              >
                <Youtube className="w-4 h-4" />
                <span>Xem Video hướng dẫn YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </a>
            )}
          </div>

          {/* Topic Title Header */}
          <div className="bg-gradient-to-r from-[#005596] to-[#003c71] text-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-blue-100 mb-2">
                  Quy trình {selectedTopic.steps.length} bước tiêu chuẩn
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{selectedTopic.title}</h1>
                <p className="text-sm text-blue-100 mt-2 max-w-2xl">{selectedTopic.desc}</p>
              </div>
              <div className="hidden md:block p-3 bg-white/10 rounded-2xl backdrop-blur">
                {iconCatalog[selectedTopic.id] || <HelpCircle className="w-8 h-8 text-white" />}
              </div>
            </div>
          </div>

          {/* Steps Timeline Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Các bước thực hiện chi tiết:</span>
              </h3>
              <span className="text-xs text-slate-500 italic">Nhấn vào ảnh để xem phóng to</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTopic.steps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Step badge & text */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-[#005596] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {step.step}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 leading-snug whitespace-pre-line">
                        {step.text}
                      </div>
                    </div>

                    {/* Step Image */}
                    <div 
                      onClick={() => setZoomedImage(step.image)}
                      className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 group cursor-pointer aspect-video flex items-center justify-center"
                    >
                      <img
                        src={step.image}
                        alt={`Minh họa bước ${step.step}`}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to placeholder if not loaded
                          (e.target as HTMLImageElement).src = './assets/vietinbank-logo.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" /> Phóng to ảnh
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-[11px] font-medium text-slate-400">
                      Bước {step.step} / {selectedTopic.steps.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Video Box */}
          {selectedTopic.videoUrl && (
            <div className="bg-red-50/70 border border-red-200/70 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Youtube className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Xem video thao tác trực tiếp trên YouTube</h4>
                  <p className="text-xs text-slate-600">
                    Video trực quan từng thao tác giúp Quý khách dễ dàng tự thực hiện tại nhà hoặc tại quầy.
                  </p>
                </div>
              </div>
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
              >
                <Youtube className="w-4 h-4" />
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}

          {/* Feedback & End Conversation Section (Required by User/PDF) */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-sm">
            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                {contentData.faq.promptQuestion}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Ý kiến của Quý khách giúp chúng tôi nâng cao chất lượng phục vụ tại quầy giao dịch.
              </p>
            </div>

            {/* Response options */}
            {feedbackState === 'idle' && (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => setFeedbackState('success')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Đã ổn, tôi làm được rồi</span>
                </button>

                <button
                  onClick={() => setFeedbackState('need_help')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>

                <button
                  onClick={handleBackToMenu}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại menu chính</span>
                </button>

                <button
                  onClick={handleEndChat}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 border border-rose-200 text-sm font-semibold transition-all cursor-pointer"
                >
                  <MessageSquareOff className="w-4 h-4" />
                  <span>Kết thúc cuộc trò chuyện</span>
                </button>
              </div>
            )}

            {/* If Customer Said "Đã ổn" */}
            {feedbackState === 'success' && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-xl mx-auto space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-emerald-900 leading-relaxed">
                  VietinBank rất vui vì đã hỗ trợ được Quý khách thành công! Chúc Quý khách có trải nghiệm tuyệt vời cùng VietinBank iPay.
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleBackToMenu}
                    className="px-4 py-2 bg-[#005596] hover:bg-[#003c71] text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={handleEndChat}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* If Customer Said "Chưa ổn" (Required wording) */}
            {feedbackState === 'need_help' && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl max-w-xl mx-auto space-y-4 animate-fadeIn text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#005596] text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Thông tin hỗ trợ trực tiếp</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {contentData.faq.supportResponse}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Chuyên viên {contentData.brand.counselorSupport.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      SĐT: {contentData.brand.counselorSupport.displayPhone}
                    </div>
                  </div>
                  <a
                    href={`tel:${contentData.brand.counselorSupport.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi hỗ trợ</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleBackToMenu}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={handleEndChat}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* End conversation gratitude message */}
            {feedbackState === 'ended' && (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl max-w-xl mx-auto space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-base font-bold text-slate-900">
                  {contentData.faq.gratitudeMessage}
                </div>
                <button
                  onClick={handleBackToMenu}
                  className="px-5 py-2.5 bg-[#005596] hover:bg-[#003c71] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  Bắt đầu cuộc trò chuyện mới
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal Preview */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl flex flex-col items-center overflow-hidden"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-xs text-slate-500 font-medium mb-2">Ảnh minh họa hướng dẫn thao tác</div>
            <img
              src={zoomedImage}
              alt="Minh họa phóng to"
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};
