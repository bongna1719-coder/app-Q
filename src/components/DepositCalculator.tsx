import React, { useState, useId } from 'react';
import contentData from '../data/contentData.json';
import { 
  PiggyBank, 
  Calculator, 
  TrendingUp, 
  AlertCircle, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle2, 
  Coins, 
  Video
} from 'lucide-react';

export const DepositCalculator: React.FC = () => {
  const [depositAmountRaw, setDepositAmountRaw] = useState<string>('100000000');
  const [selectedTermIndex, setSelectedTermIndex] = useState<number>(6); // Default 12 months
  const [interestRate, setInterestRate] = useState<string>('4.7');
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  const amountInputId = useId();
  const termSelectId = useId();
  const rateInputId = useId();

  // Parsing & validation
  const amountNumber = Number(depositAmountRaw.replace(/\D/g, '')) || 0;
  const rateNumber = parseFloat(interestRate) || 0;
  const currentTerm = contentData.deposit.terms[selectedTermIndex];

  // Validation messages
  const amountError = amountNumber <= 0 ? contentData.deposit.errorAmount : null;
  const termError = !currentTerm ? contentData.deposit.errorTerm : null;
  const rateError = (isNaN(rateNumber) || rateNumber < 0 || rateNumber > 25) ? contentData.deposit.errorRate : null;

  // Calculation formula for standard end-of-term deposit:
  // Lãi = (Số tiền * Lãi suất %/năm * Số ngày gửi) / 365
  // hoặc (Số tiền * Lãi suất %/năm * Số tháng) / 12
  const calculatedInterest = React.useMemo(() => {
    if (amountNumber <= 0 || !currentTerm || rateNumber < 0) return 0;
    if (currentTerm.months === 0) {
      // Không kỳ hạn tính 30 ngày tham chiếu
      return Math.round((amountNumber * (rateNumber / 100) * 30) / 365);
    }
    return Math.round((amountNumber * (rateNumber / 100) * currentTerm.months) / 12);
  }, [amountNumber, currentTerm, rateNumber]);

  const totalAmount = amountNumber + calculatedInterest;

  // Quick preset amount buttons
  const presets = [
    { label: '50 Triệu', value: 50000000 },
    { label: '100 Triệu', value: 100000000 },
    { label: '200 Triệu', value: 200000000 },
    { label: '500 Triệu', value: 500000000 },
    { label: '1 Tỷ', value: 1000000000 }
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setDepositAmountRaw(rawVal);
  };

  const handleTermChange = (idx: number) => {
    setSelectedTermIndex(idx);
    const term = contentData.deposit.terms[idx];
    if (term && !isCustomRate) {
      setInterestRate(term.defaultRate.toString());
    }
  };

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' VND';
  };

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003c71] via-[#005596] to-[#002f5a] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-300" /> {contentData.deposit.productName}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {contentData.deposit.title}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            Ước tính số tiền lãi nhận được khi gửi tiết kiệm tại VietinBank. Lãi suất cạnh tranh, an toàn tối đa với mạng lưới ngân hàng thương mại hàng đầu Việt Nam.
          </p>
        </div>

        {/* Video Guide Button */}
        <a
          href={contentData.deposit.videoGuideUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Video className="w-4 h-4" />
          <span>Video hướng dẫn gửi tiết kiệm (TikTok)</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#005596]" />
              <span>Nhập thông tin tiền gửi</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống tự động áp biểu lãi suất niêm yết mới nhất của VietinBank
            </p>
          </div>

          {/* Input 1: Số tiền gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={amountInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Số tiền gửi dự tính (VND) <span className="text-red-500">*</span>
              </label>
              {amountNumber > 0 && (
                <span className="text-xs font-semibold text-[#005596]">
                  {formatVnd(amountNumber)}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id={amountInputId}
                type="text"
                value={amountNumber > 0 ? new Intl.NumberFormat('vi-VN').format(amountNumber) : ''}
                onChange={handleAmountChange}
                placeholder="Ví dụ: 100,000,000"
                className={`w-full px-4 py-3.5 text-base sm:text-lg font-bold rounded-2xl border ${
                  amountError ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-[#005596] focus:ring-blue-100'
                } focus:outline-none focus:ring-4 transition-all text-slate-900`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {amountError && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{amountError}</span>
              </div>
            )}

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setDepositAmountRaw(p.value.toString())}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    amountNumber === p.value
                      ? 'bg-[#005596] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  +{p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div className="space-y-2">
            <label htmlFor={termSelectId} className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Kỳ hạn gửi <span className="text-red-500">*</span>
            </label>

            <select
              id={termSelectId}
              value={selectedTermIndex}
              onChange={(e) => handleTermChange(Number(e.target.value))}
              className="w-full px-4 py-3.5 text-sm sm:text-base font-semibold rounded-2xl border border-slate-300 focus:border-[#005596] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-slate-900 bg-white"
            >
              {contentData.deposit.terms.map((t, idx) => (
                <option key={idx} value={idx}>
                  {t.label} (Lãi suất chuẩn: {t.defaultRate}%/năm)
                </option>
              ))}
            </select>

            {termError && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{termError}</span>
              </div>
            )}
          </div>

          {/* Input 3: Lãi suất (%/năm) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={rateInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomRate(!isCustomRate);
                  if (isCustomRate && currentTerm) {
                    setInterestRate(currentTerm.defaultRate.toString());
                  }
                }}
                className="text-xs font-semibold text-[#005596] hover:underline cursor-pointer"
              >
                {isCustomRate ? 'Dùng mức niêm yết quầy' : 'Chỉnh sửa lãi suất'}
              </button>
            </div>

            <div className="relative">
              <input
                id={rateInputId}
                type="number"
                step="0.05"
                min="0"
                max="25"
                value={interestRate}
                disabled={!isCustomRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className={`w-full px-4 py-3.5 text-base sm:text-lg font-bold rounded-2xl border ${
                  rateError ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-[#005596] focus:ring-blue-100'
                } ${!isCustomRate ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : 'bg-white text-slate-900'} focus:outline-none focus:ring-4 transition-all`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                %/năm
              </span>
            </div>

            {rateError && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{rateError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Calculation Results Display (Matching PDF Layout) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#003c71] to-[#005596] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Kết quả dự tính
                </span>
                <h3 className="text-xl font-bold">Lợi Nhuận Tiết Kiệm</h3>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            {/* Item 1: Tiền lãi dự tính */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 space-y-1">
              <div className="text-xs text-blue-100 font-medium flex items-center justify-between">
                <span>Tiền lãi dự tính nhận được:</span>
                <span className="text-[11px] text-emerald-300 font-bold">Trả lãi sau</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-yellow-300 tracking-tight">
                {formatVnd(calculatedInterest)}
              </div>
              <div className="text-[11px] text-blue-200">
                Kỳ hạn: <strong>{currentTerm?.label}</strong> • Lãi suất: <strong>{rateNumber}%/năm</strong>
              </div>
            </div>

            {/* Item 2: Tổng tiền nhận được (Gốc + Lãi) */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 space-y-1">
              <div className="text-xs text-blue-100 font-medium">
                Tổng số tiền khi đáo hạn (Gốc + Lãi):
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formatVnd(totalAmount)}
              </div>
            </div>

            {/* Item 3: Số tiền gốc gửi ban đầu */}
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-between text-xs text-blue-100">
              <span>Tiền gửi ban đầu:</span>
              <span className="font-bold text-white">{formatVnd(amountNumber)}</span>
            </div>
          </div>

          {/* Advice / CTA Box */}
          <div className="bg-black/20 rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="text-xs font-semibold text-yellow-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mẹo gia tăng lãi suất:</span>
            </div>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              Mở sổ tiết kiệm online trên ứng dụng <strong>VietinBank iPay</strong> để được cộng thêm tới <strong>+0.3%/năm</strong> so với biểu lãi suất tại quầy!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
