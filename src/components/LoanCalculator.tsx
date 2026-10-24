import React, { useState, useMemo, useId } from 'react';
import contentData from '../data/contentData.json';
import { 
  Calculator, 
  Table, 
  Calendar, 
  TrendingDown, 
  ChevronRight, 
  FileSpreadsheet, 
  Printer, 
  X, 
  Info,
  DollarSign,
  ArrowUpDown
} from 'lucide-react';
import { LoanScheduleRow } from '../types/index.ts';

export const LoanCalculator: React.FC = () => {
  // Input states (Rule: NO slider, MUST be text/number input)
  const [loanAmountRaw, setLoanAmountRaw] = useState<string>('1000000000'); // 1 billion VND
  const [loanDurationMonths, setLoanDurationMonths] = useState<number>(60); // 60 months
  const [annualRate, setAnnualRate] = useState<number>(8.0);
  const [disbursementDate, setDisbursementDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [frequencyId, setFrequencyId] = useState<string>('monthly'); // monthly, quarterly, semi_annual, annual
  const [paymentDay, setPaymentDay] = useState<number>(25); // e.g. 25th of month
  const [roundingMode, setRoundingMode] = useState<'unit' | 'thousand'>('thousand'); // round to 1 VND or 1.000 VND
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loanInputId = useId();
  const durationInputId = useId();
  const rateInputId = useId();
  const disbursementInputId = useId();
  const paymentDayInputId = useId();
  const frequencyInputId = useId();

  // Parsing values
  const principal = Number(loanAmountRaw.replace(/\D/g, '')) || 0;

  // Selected frequency
  const selectedFreq = contentData.loan.frequencies.find((f) => f.id === frequencyId) || contentData.loan.frequencies[0];
  const totalPeriods = Math.max(1, Math.ceil(loanDurationMonths / selectedFreq.periodMonths));

  // Compute Amortization Schedule
  const scheduleData = useMemo(() => {
    if (principal <= 0 || totalPeriods <= 0) {
      return { rows: [] as LoanScheduleRow[], totalPrincipal: 0, totalInterest: 0, grandTotal: 0, firstMonthPay: 0, lastMonthPay: 0 };
    }

    const periodRate = (annualRate / 100) / selectedFreq.divisor;
    const basePrincipalPerPeriod = principal / totalPeriods;

    const round = (val: number) => {
      if (roundingMode === 'thousand') {
        return Math.round(val / 1000) * 1000;
      }
      return Math.round(val);
    };

    const rows: LoanScheduleRow[] = [];
    let currentBalance = principal;
    let accumulatedPrincipalPaid = 0;
    let accumulatedInterestPaid = 0;

    // Disbursement Date parse
    const [dYear, dMonth, dDay] = disbursementDate.split('-').map(Number);
    let startDate = new Date(dYear, dMonth - 1, dDay || 1);

    for (let period = 1; period <= totalPeriods; period++) {
      // Calculate payment date: advance by periodMonths, clamp day to chosen paymentDay
      const nextDate = new Date(startDate.getFullYear(), startDate.getMonth() + (period * selectedFreq.periodMonths), paymentDay);
      // Format as DD/MM/YYYY
      const formattedDate = `${String(nextDate.getDate()).padStart(2, '0')}/${String(nextDate.getMonth() + 1).padStart(2, '0')}/${nextDate.getFullYear()}`;

      // Principal for this period
      let pPay = round(basePrincipalPerPeriod);

      // Interest for this period = Dư nợ đầu kỳ * Lãi suất kỳ
      let iPay = round(currentBalance * periodRate);

      // On the LAST period, adjust rounding discrepancies
      if (period === totalPeriods) {
        pPay = currentBalance; // Pay exact remaining principal
      }

      const rowTotal = pPay + iPay;
      const remainingAfterPeriod = Math.max(0, currentBalance - pPay);

      rows.push({
        period,
        paymentDate: formattedDate,
        remainingPrincipal: remainingAfterPeriod,
        principalPayment: pPay,
        interestPayment: iPay,
        totalPayment: rowTotal
      });

      accumulatedPrincipalPaid += pPay;
      accumulatedInterestPaid += iPay;
      currentBalance = remainingAfterPeriod;
    }

    const firstMonthPay = rows[0]?.totalPayment || 0;
    const lastMonthPay = rows[rows.length - 1]?.totalPayment || 0;

    return {
      rows,
      totalPrincipal: accumulatedPrincipalPaid,
      totalInterest: accumulatedInterestPaid,
      grandTotal: accumulatedPrincipalPaid + accumulatedInterestPaid,
      firstMonthPay,
      lastMonthPay
    };
  }, [principal, totalPeriods, annualRate, selectedFreq, disbursementDate, paymentDay, roundingMode]);

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' VND';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-[#003c71] via-[#005596] to-[#002f5a] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-200 border border-red-400/30">
            <Calculator className="w-3.5 h-3.5 text-yellow-300" /> {contentData.loan.method}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {contentData.loan.title}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            {contentData.loan.description} Giúp Quý khách chủ động lên kế hoạch tài chính cá nhân & kinh doanh tối ưu nhất.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Table className="w-4 h-4" />
          <span>Xem chi tiết lịch trả nợ ({totalPeriods} kỳ)</span>
        </button>
      </div>

      {/* Main Grid: Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Inputs (100% text/number input as per rule) */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#005596]" />
              <span>Thông tin khoản vay</span>
            </h2>
            <p className="text-xs text-slate-500">
              Nhập trực tiếp số tiền vay, thời hạn và chu kỳ trả nợ mong muốn
            </p>
          </div>

          {/* Input 1: Số tiền vay (dạng nhập text phân cách hàng nghìn) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={loanInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Số tiền vay (VND) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold text-[#005596]">
                {formatVnd(principal)}
              </span>
            </div>

            <div className="relative">
              <input
                id={loanInputId}
                type="text"
                value={principal > 0 ? new Intl.NumberFormat('vi-VN').format(principal) : ''}
                onChange={(e) => setLoanAmountRaw(e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập số tiền muốn vay"
                className="w-full px-4 py-3.5 text-base sm:text-lg font-bold rounded-2xl border border-slate-300 focus:border-[#005596] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-slate-900"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Quick Loan Amount Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { l: '300 Triệu', v: 300000000 },
                { l: '500 Triệu', v: 500000000 },
                { l: '1 Tỷ', v: 1000000000 },
                { l: '2 Tỷ', v: 2000000000 },
                { l: '5 Tỷ', v: 5000000000 }
              ].map((c) => (
                <button
                  key={c.v}
                  type="button"
                  onClick={() => setLoanAmountRaw(c.v.toString())}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    principal === c.v ? 'bg-[#005596] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input 2: Thời gian vay (tháng) */}
            <div className="space-y-1.5">
              <label htmlFor={durationInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={durationInputId}
                  type="number"
                  min="1"
                  max="420"
                  value={loanDurationMonths}
                  onChange={(e) => setLoanDurationMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 text-base font-bold rounded-2xl border border-slate-300 focus:border-[#005596] focus:ring-4 focus:ring-blue-100 focus:outline-none text-slate-900"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Tháng
                </span>
              </div>
            </div>

            {/* Input 3: Lãi suất vay (%/năm) */}
            <div className="space-y-1.5">
              <label htmlFor={rateInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={rateInputId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-base font-bold rounded-2xl border border-slate-300 focus:border-[#005596] focus:ring-4 focus:ring-blue-100 focus:outline-none text-slate-900"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/năm
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Input 4: Ngày giải ngân */}
            <div className="space-y-1.5">
              <label htmlFor={disbursementInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Ngày giải ngân
              </label>
              <input
                id={disbursementInputId}
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-3 text-sm font-semibold rounded-2xl border border-slate-300 focus:border-[#005596] focus:outline-none text-slate-800"
              />
            </div>

            {/* Input 5: Chu kỳ trả nợ */}
            <div className="space-y-1.5">
              <label htmlFor={frequencyInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Chu kỳ trả nợ
              </label>
              <select
                id={frequencyInputId}
                value={frequencyId}
                onChange={(e) => setFrequencyId(e.target.value)}
                className="w-full px-3 py-3 text-sm font-semibold rounded-2xl border border-slate-300 focus:border-[#005596] focus:outline-none text-slate-800 bg-white"
              >
                {contentData.loan.frequencies.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 6: Ngày trả nợ định kỳ (1 - 31) */}
            <div className="space-y-1.5">
              <label htmlFor={paymentDayInputId} className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Ngày trả nợ định kỳ
              </label>
              <div className="relative">
                <input
                  id={paymentDayInputId}
                  type="number"
                  min="1"
                  max="31"
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-3 text-sm font-bold rounded-2xl border border-slate-300 focus:border-[#005596] focus:outline-none text-slate-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                  hằng tháng
                </span>
              </div>
            </div>
          </div>

          {/* Rounding Mode Switch */}
          <div className="pt-2 flex flex-wrap items-center justify-between text-xs border-t border-slate-100 gap-2">
            <span className="font-semibold text-slate-600">Quy tắc làm tròn số:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRoundingMode('thousand')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  roundingMode === 'thousand' ? 'bg-[#005596] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tròn đến 1.000 đồng
              </button>
              <button
                type="button"
                onClick={() => setRoundingMode('unit')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  roundingMode === 'unit' ? 'bg-[#005596] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tròn đến đơn vị đồng
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary Panel (Matching OCR Screenshot) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#003c71] to-[#005596] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Dư nợ giảm dần
                </span>
                <h3 className="text-xl font-bold">Kế Hoạch Trả Nợ</h3>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur">
                <TrendingDown className="w-6 h-6 text-yellow-300" />
              </div>
            </div>

            {/* First and Last Month Payment */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="text-xs text-blue-100 font-medium">Số tiền trả hàng tháng:</div>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="text-[11px] text-blue-200">Kỳ đầu tiên cao nhất</div>
                  <div className="text-xl sm:text-2xl font-black text-yellow-300">
                    {formatVnd(scheduleData.firstMonthPay)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-blue-200">Kỳ cuối cùng</div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {formatVnd(scheduleData.lastMonthPay)}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Interest & Grand Total */}
            <div className="space-y-2.5">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-between text-xs text-blue-100">
                <span>Tổng tiền gốc:</span>
                <span className="font-bold text-white">{formatVnd(scheduleData.totalPrincipal)}</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-between text-xs text-blue-100">
                <span>Tổng tiền lãi phải trả:</span>
                <span className="font-bold text-yellow-300">{formatVnd(scheduleData.totalInterest)}</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 flex items-center justify-between text-sm text-white font-bold">
                <span>Tổng gốc + lãi:</span>
                <span className="text-base text-yellow-300">{formatVnd(scheduleData.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Open Detail Amortization Table */}
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 active:scale-98 text-slate-900 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Table className="w-5 h-5" />
              <span>Xem chi tiết lịch trả nợ ({totalPeriods} kỳ)</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Amortization Table Modal (Exact replica of PDF Step 2) */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#003c71] to-[#005596] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  {contentData.brand.name} • {contentData.brand.branch}
                </span>
                <h3 className="text-lg sm:text-2xl font-black">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Khoản vay: {formatVnd(principal)} • Thời hạn: {loanDurationMonths} tháng • Lãi suất: {annualRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="In biểu mẫu"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Table Body (Scrollable) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3 text-center">Kỳ</th>
                    <th className="py-3 px-3">Kỳ trả nợ</th>
                    <th className="py-3 px-3 text-right">Số gốc còn lại</th>
                    <th className="py-3 px-3 text-right">Gốc</th>
                    <th className="py-3 px-3 text-right">Lãi</th>
                    <th className="py-3 px-3 text-right">Tổng gốc + Lãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Period 0 (Disbursement) */}
                  <tr className="bg-slate-50/70 text-slate-500 font-medium">
                    <td className="py-2.5 px-3 text-center">0</td>
                    <td className="py-2.5 px-3">
                      {disbursementDate.split('-').reverse().join('/')} (Giải ngân)
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      {new Intl.NumberFormat('vi-VN').format(principal)}
                    </td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                  </tr>

                  {/* Scheduled periods */}
                  {scheduleData.rows.map((r) => (
                    <tr key={r.period} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{r.period}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{r.paymentDate}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {new Intl.NumberFormat('vi-VN').format(r.remainingPrincipal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                        {new Intl.NumberFormat('vi-VN').format(r.principalPayment)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-amber-600">
                        {new Intl.NumberFormat('vi-VN').format(r.interestPayment)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#005596]">
                        {new Intl.NumberFormat('vi-VN').format(r.totalPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#003c71] text-white font-black text-xs sm:text-sm">
                    <td colSpan={3} className="py-3 px-4 uppercase tracking-wider text-left">
                      TỔNG CỘNG
                    </td>
                    <td className="py-3 px-3 text-right">
                      {new Intl.NumberFormat('vi-VN').format(scheduleData.totalPrincipal)}
                    </td>
                    <td className="py-3 px-3 text-right text-yellow-300">
                      {new Intl.NumberFormat('vi-VN').format(scheduleData.totalInterest)}
                    </td>
                    <td className="py-3 px-3 text-right text-yellow-300">
                      {new Intl.NumberFormat('vi-VN').format(scheduleData.grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer Note */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#005596]" />
                <span>Số liệu mang tính chất tham khảo tại thời điểm tra cứu. Sai lệch làm tròn được điều chỉnh vào kỳ trả nợ cuối cùng.</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-black text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
