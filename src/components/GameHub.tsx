import React, { useState, useEffect, useRef, useCallback } from 'react';
import contentData from '../data/contentData.json';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  Trophy, 
  Gift, 
  RotateCcw, 
  Play, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: { score: number; voucherCode: string; reward: string; timestamp: string }) => void;
    onFlappyVoucherLose?: (data: { score: number; timestamp: string }) => void;
  }
}

export const GameHub: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'snake'>('flappy');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003c71] via-[#005596] to-[#002f5a] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-200 border border-red-400/30">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" /> Giải Trí & Nhận Thưởng Tại Quầy
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Thử Thách Game - Nhận Voucher Xăng 2 Lít
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            Trong thời gian chờ đến lượt giao dịch, mời Quý khách tham gia các mini-game tương tác vui nhộn để nhận ngay mã phiếu quà tặng xăng Petrolimex/PVOIL tri ân từ VietinBank.
          </p>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setSelectedGame('flappy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              selectedGame === 'flappy'
                ? 'bg-white text-[#005596] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Flappy Bird</span>
          </button>
          <button
            onClick={() => setSelectedGame('snake')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              selectedGame === 'snake'
                ? 'bg-white text-[#005596] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-500" />
            <span>Rắn Săn Mồi</span>
          </button>
        </div>
      </div>

      {/* Render Selected Game */}
      {selectedGame === 'flappy' ? (
        <FlappyBirdGame onCopyVoucher={handleCopyVoucher} copiedCode={copiedCode} />
      ) : (
        <SnakeGame onCopyVoucher={handleCopyVoucher} copiedCode={copiedCode} />
      )}
    </section>
  );
};

/* =========================================================================
   GAME 1: FLAPPY BIRD ("Chờ vui – Chơi hay – Nhận quà liền tay")
   ========================================================================= */

const WIN_SCORE = 20;
const VOUCHER_TEXT = 'Voucher mua 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

interface FlappyProps {
  onCopyVoucher: (code: string) => void;
  copiedCode: string | null;
}

const FlappyBirdGame: React.FC<FlappyProps> = ({ onCopyVoucher, copiedCode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('flappy_high_score') || '0', 10);
  });
  const [lastVoucher, setLastVoucher] = useState<string>(() => {
    return localStorage.getItem('flappy_last_voucher') || '';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Internal game engine state refs
  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'won' | 'lost',
    birdY: 180,
    birdVelocity: 0,
    pipes: [] as { x: number; topHeight: number; bottomY: number; passed: boolean }[],
    score: 0,
    frameCount: 0,
    gravity: 0.38,
    jumpForce: -6.8,
    pipeSpeed: 2.1,
    pipeGap: 135,
    animationFrameId: 0
  });

  const generateVoucherCode = useCallback(() => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  };

  const winGame = useCallback(() => {
    const code = generateVoucherCode();
    setVoucherCode(code);
    setGameState('won');
    stateRef.current.gameState = 'won';
    cancelAnimationFrame(stateRef.current.animationFrameId);

    // Persist
    localStorage.setItem('flappy_last_voucher', code);
    setLastVoucher(code);

    triggerConfetti();

    // Fire webapp callback if exists
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: code,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [generateVoucherCode]);

  const endGame = useCallback((finalScore: number) => {
    setGameState('lost');
    stateRef.current.gameState = 'lost';
    cancelAnimationFrame(stateRef.current.animationFrameId);

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappy_high_score', finalScore.toString());
    }

    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [highScore]);

  const resetGame = () => {
    const s = stateRef.current;
    s.birdY = 180;
    s.birdVelocity = 0;
    s.pipes = [];
    s.score = 0;
    s.frameCount = 0;
    s.gameState = 'playing';
    setCurrentScore(0);
    setGameState('playing');
  };

  const startGame = () => {
    resetGame();
  };

  const jump = useCallback(() => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.birdVelocity = stateRef.current.jumpForce;
    } else if (stateRef.current.gameState === 'idle' || stateRef.current.gameState === 'lost') {
      startGame();
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const loop = () => {
      if (!running) return;

      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear & Background Gradient (VietinBank sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.7, '#e0f2fe');
      skyGrad.addColorStop(1, '#f8fafc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds decoration
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(60, 70, 26, 0, Math.PI * 2);
      ctx.arc(90, 60, 32, 0, Math.PI * 2);
      ctx.arc(120, 70, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 110, 22, 0, Math.PI * 2);
      ctx.arc(310, 100, 30, 0, Math.PI * 2);
      ctx.arc(340, 110, 20, 0, Math.PI * 2);
      ctx.fill();

      // Ground
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, height - 24, width, 4);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, height - 20, width, 20);

      if (s.gameState === 'playing') {
        s.frameCount++;

        // Apply Gravity
        s.birdVelocity += s.gravity;
        s.birdY += s.birdVelocity;

        // Ground and ceiling collision
        if (s.birdY + 14 >= height - 24) {
          s.birdY = height - 24 - 14;
          endGame(s.score);
        }
        if (s.birdY - 14 <= 0) {
          s.birdY = 14;
          s.birdVelocity = 0;
        }

        // Spawn Pipes
        if (s.frameCount % 90 === 0 && s.score < WIN_SCORE) {
          const minHeight = 50;
          const maxHeight = height - 24 - s.pipeGap - minHeight;
          const topH = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
          s.pipes.push({
            x: width,
            topHeight: topH,
            bottomY: topH + s.pipeGap,
            passed: false
          });
        }

        // Move Pipes & Check Collisions
        for (let i = s.pipes.length - 1; i >= 0; i--) {
          const pipe = s.pipes[i];
          pipe.x -= s.pipeSpeed;

          const birdX = 70;
          const birdRadius = 14;

          // Check passing pipe
          if (!pipe.passed && pipe.x + 48 < birdX) {
            pipe.passed = true;
            s.score += 1;
            setCurrentScore(s.score);

            if (s.score >= WIN_SCORE) {
              winGame();
              return;
            }
          }

          // Collision with pipe bounds
          const inPipeX = birdX + birdRadius > pipe.x && birdX - birdRadius < pipe.x + 48;
          const hitTop = s.birdY - birdRadius < pipe.topHeight;
          const hitBottom = s.birdY + birdRadius > pipe.bottomY;

          if (inPipeX && (hitTop || hitBottom)) {
            endGame(s.score);
            return;
          }

          // Remove offscreen
          if (pipe.x < -60) {
            s.pipes.splice(i, 1);
          }
        }
      }

      // Draw Pipes (Styled in VietinBank deep navy/blue)
      s.pipes.forEach((pipe) => {
        // Top pipe
        const gradTop = ctx.createLinearGradient(pipe.x, 0, pipe.x + 48, 0);
        gradTop.addColorStop(0, '#005596');
        gradTop.addColorStop(0.5, '#0284c7');
        gradTop.addColorStop(1, '#003c71');
        ctx.fillStyle = gradTop;
        ctx.fillRect(pipe.x, 0, 48, pipe.topHeight);
        ctx.fillStyle = '#002f5a';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 12, 54, 12);

        // Bottom pipe
        const bottomH = height - 24 - pipe.bottomY;
        const gradBot = ctx.createLinearGradient(pipe.x, 0, pipe.x + 48, 0);
        gradBot.addColorStop(0, '#005596');
        gradBot.addColorStop(0.5, '#0284c7');
        gradBot.addColorStop(1, '#003c71');
        ctx.fillStyle = gradBot;
        ctx.fillRect(pipe.x, pipe.bottomY, 48, bottomH);
        ctx.fillStyle = '#002f5a';
        ctx.fillRect(pipe.x - 3, pipe.bottomY, 54, 12);
      });

      // Draw Bird / Mascot (Golden Bank Card or Winged Mascot)
      const birdX = 70;
      const birdY = s.birdY;
      ctx.save();
      ctx.translate(birdX, birdY);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (s.birdVelocity * 4 * Math.PI) / 180));
      ctx.rotate(angle);

      // Card body (VietinBank Red & Blue Mascot Card)
      ctx.fillStyle = '#EC1C24';
      ctx.beginPath();
      ctx.roundRect(-16, -11, 32, 22, 5);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wing
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(-4, 0, 9, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(9.5, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(14, -2);
      ctx.lineTo(21, 0);
      ctx.lineTo(14, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      s.animationFrameId = requestAnimationFrame(loop);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(stateRef.current.animationFrameId);
    };
  }, [endGame, winGame]);

  // Encouragement message based on score
  const getEncouragement = (score: number) => {
    if (score < 5) return 'Khởi động nhẹ nhàng!';
    if (score < 10) return 'Tốt lắm, tiếp tục nào!';
    if (score < 15) return 'Một nửa chặng đường rồi!';
    if (score < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  return (
    <div id="flappy-voucher-game" className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
      {/* Top Game Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>{GAME_TITLE}</span>
          </h2>
          <p className="text-xs text-slate-500">{contentData.games.flappy.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl font-medium text-slate-700">
            Điểm cao nhất: <span className="font-bold text-[#005596]">{highScore}/20</span>
          </div>
          {lastVoucher && (
            <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold hidden sm:block">
              Mã gần nhất: <span className="font-mono">{lastVoucher}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="relative max-w-lg mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-slate-100 bg-sky-100 select-none touch-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={480}
          onClick={jump}
          className="w-full h-[420px] sm:h-[480px] block cursor-pointer"
        />

        {/* Live Score HUD Overlay while playing */}
        {gameState === 'playing' && (
          <div className="absolute top-4 inset-x-4 pointer-events-none flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur px-5 py-2 rounded-2xl shadow-md border border-slate-200/70 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Thử thách
              </div>
              <div className="text-2xl font-black text-[#005596]">
                Điểm: {currentScore}/20
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-48 bg-black/20 h-2.5 rounded-full mt-2 overflow-hidden backdrop-blur">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(currentScore / 20) * 100}%` }}
              ></div>
            </div>

            <div className="mt-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse-subtle">
              {getEncouragement(currentScore)}
            </div>
          </div>
        )}

        {/* Idle Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white text-[#005596] flex items-center justify-center shadow-lg animate-bounce">
              <Gift className="w-9 h-9 text-[#EC1C24]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">{GAME_TITLE}</h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xs mx-auto">
                Vượt qua 20 chướng ngại vật để nhận voucher 2 lít xăng Petrolimex/PVOIL
              </p>
            </div>
            <div className="text-xs text-yellow-300 bg-black/40 px-3.5 py-1.5 rounded-full font-medium">
              💡 Chạm vào màn hình hoặc nhấn phím Space để bay
            </div>
            <button
              onClick={startGame}
              className="mt-2 inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>
          </div>
        )}

        {/* Lose Screen */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-rose-400 flex items-center justify-center shadow-md">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-rose-300">
                Rất tiếc, bạn đã vượt qua {currentScore}/20 thử thách
              </h3>
              <p className="text-xs text-slate-200 mt-1">
                Chỉ còn một chút nữa thôi, hãy thử lại nhé!
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={() => setGameState('idle')}
                className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Win Screen (20 Points Reached) */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-[#003c71]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center shadow-xl animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                Xuất sắc hoàn thành
              </span>
              <h3 className="text-2xl font-black mt-1">Chúc mừng Quý khách!</h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xs mt-1">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <strong>voucher 2 lít xăng</strong>.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="bg-white text-slate-900 rounded-2xl p-4 w-full max-w-xs shadow-2xl border-2 border-yellow-400 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                MÃ PHIẾU QUÀ TẶNG
              </div>
              <div className="text-2xl font-black font-mono tracking-widest text-[#005596] bg-slate-50 py-2 rounded-xl border border-dashed border-[#005596]">
                {voucherCode}
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên quầy để nhận quà.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={() => onCopyVoucher(voucherCode)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {copiedCode === voucherCode ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode === voucherCode ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>

              <button
                onClick={startGame}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch Tap Action Area for Mobile */}
      <div className="max-w-lg mx-auto block sm:hidden">
        <button
          onClick={jump}
          className="w-full py-4 bg-[#005596] text-white font-bold text-sm rounded-2xl active:scale-98 shadow-md flex items-center justify-center gap-2"
        >
          <ArrowUp className="w-5 h-5" /> Chạm vào đây để nhân vật bay lên
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: RẮN SĂN MỒI ("VietinBank Snake Challenge")
   ========================================================================= */

interface SnakeProps {
  onCopyVoucher: (code: string) => void;
  copiedCode: string | null;
}

const SnakeGame: React.FC<SnakeProps> = ({ onCopyVoucher, copiedCode }) => {
  const GRID_SIZE = 20;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState<number>(0);
  const [rewardWon, setRewardWon] = useState<string>('Chưa đạt mốc nhận thưởng');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [finishTime, setFinishTime] = useState<string>('');

  const snakeState = useRef({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    direction: { x: 0, y: -1 },
    nextDirection: { x: 0, y: -1 },
    food: { x: 5, y: 5 },
    score: 0,
    hasNotified20: false,
    hasNotified40: false,
    timer: 0 as any
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const spawnFood = () => {
    const s = snakeState.current;
    let newX: number, newY: number;
    while (true) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      const onSnake = s.snake.some((seg) => seg.x === newX && seg.y === newY);
      if (!onSnake) break;
    }
    s.food = { x: newX, y: newY };
  };

  const startSnakeGame = () => {
    const s = snakeState.current;
    s.snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    s.direction = { x: 0, y: -1 };
    s.nextDirection = { x: 0, y: -1 };
    s.score = 0;
    s.hasNotified20 = false;
    s.hasNotified40 = false;
    setScore(0);
    setRewardWon('Chưa đạt mốc nhận thưởng');
    setVoucherCode('');
    spawnFood();
    setGameState('playing');
  };

  const finishGame = useCallback((finalScore: number) => {
    clearInterval(snakeState.current.timer);
    setGameState('ended');
    const nowStr = new Date().toLocaleString('vi-VN');
    setFinishTime(nowStr);

    let reward = '';
    if (finalScore >= 40) {
      reward = '02 voucher xăng, mỗi voucher trị giá 2 lít';
      setVoucherCode(`VB-40-${Math.floor(100000 + Math.random() * 900000)}`);
      try { confetti(); } catch (e) {}
    } else if (finalScore >= 20) {
      reward = '01 voucher xăng trị giá 2 lít';
      setVoucherCode(`VB-20-${Math.floor(100000 + Math.random() * 900000)}`);
      try { confetti(); } catch (e) {}
    } else {
      reward = 'Chưa đạt mốc nhận voucher';
    }
    setRewardWon(reward);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = snakeState.current;
      if (gameState !== 'playing') return;

      if (e.key === 'ArrowUp' && s.direction.y === 0) {
        e.preventDefault();
        s.nextDirection = { x: 0, y: -1 };
      } else if (e.key === 'ArrowDown' && s.direction.y === 0) {
        e.preventDefault();
        s.nextDirection = { x: 0, y: 1 };
      } else if (e.key === 'ArrowLeft' && s.direction.x === 0) {
        e.preventDefault();
        s.nextDirection = { x: -1, y: 0 };
      } else if (e.key === 'ArrowRight' && s.direction.x === 0) {
        e.preventDefault();
        s.nextDirection = { x: 1, y: 0 };
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Game loop interval (speed adjusted for comfortable play by elderly & general customers)
  useEffect(() => {
    if (gameState !== 'playing') return;

    snakeState.current.timer = setInterval(() => {
      const s = snakeState.current;
      s.direction = s.nextDirection;

      const head = s.snake[0];
      const newHead = { x: head.x + s.direction.x, y: head.y + s.direction.y };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        finishGame(s.score);
        return;
      }

      // Self collision
      if (s.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        finishGame(s.score);
        return;
      }

      s.snake.unshift(newHead);

      // Check food
      if (newHead.x === s.food.x && newHead.y === s.food.y) {
        s.score += 1;
        setScore(s.score);
        spawnFood();

        // Milestone 20 check (avoid duplicate popup)
        if (s.score === 20 && !s.hasNotified20) {
          s.hasNotified20 = true;
          showToast('🎉 Chúc mừng Quý khách đã đạt 20 điểm! Quý khách nhận được 01 voucher xăng 2 lít.');
        }

        // Milestone 40 check
        if (s.score === 40 && !s.hasNotified40) {
          s.hasNotified40 = true;
          showToast('🌟 Xuất sắc! Quý khách đã đạt 40 điểm! Quý khách nhận được 02 voucher xăng (mỗi voucher 2 lít).');
        }
      } else {
        s.snake.pop();
      }

      // Draw onto canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cell = canvas.width / GRID_SIZE;

      // Clear background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(canvas.width, i * cell);
        ctx.stroke();
      }

      // Draw Food (Golden Coin with VietinBank V)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc((s.food.x + 0.5) * cell, (s.food.y + 0.5) * cell, cell * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.floor(cell * 0.5)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₫', (s.food.x + 0.5) * cell, (s.food.y + 0.5) * cell);

      // Draw Snake
      s.snake.forEach((seg, index) => {
        if (index === 0) {
          // Head (Red accent)
          ctx.fillStyle = '#EC1C24';
        } else {
          // Body (VietinBank Blue)
          ctx.fillStyle = '#005596';
        }
        ctx.beginPath();
        ctx.roundRect(seg.x * cell + 1.5, seg.y * cell + 1.5, cell - 3, cell - 3, 5);
        ctx.fill();
      });
    }, 125); // Gentle speed suitable for all ages

    return () => clearInterval(snakeState.current.timer);
  }, [gameState, finishGame]);

  const handleDpad = (dx: number, dy: number) => {
    const s = snakeState.current;
    if (gameState !== 'playing') return;
    if (dx !== 0 && s.direction.x === 0) s.nextDirection = { x: dx, y: 0 };
    if (dy !== 0 && s.direction.y === 0) s.nextDirection = { x: 0, y: dy };
  };

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {contentData.games.snake.title}
          </h2>
          <p className="text-xs text-slate-500">{contentData.games.snake.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-blue-50 text-[#005596] border border-blue-200 px-3 py-1.5 rounded-xl font-bold">
            Điểm hiện tại: <span className="text-lg font-black">{score}</span>
          </div>
          <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-medium">
            Mốc quà: <span className="font-semibold text-emerald-700">
              {score >= 40 ? '2 Voucher' : score >= 20 ? '1 Voucher' : 'Cần 20đ'}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#005596]" />
          <span>Dùng phím mũi tên hoặc nút điều hướng dưới màn hình để di chuyển rắn ăn điểm.</span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-[11px]">
          <span className="text-emerald-700">20 điểm: 01 voucher 2L</span>
          <span className="text-purple-700">40 điểm: 02 voucher 2L</span>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden shadow-inner border-4 border-slate-200 bg-slate-50">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full aspect-square block"
        />

        {/* Milestone Achievement Non-Disruptive Toast */}
        {toastMessage && (
          <div className="absolute top-4 inset-x-4 bg-emerald-600/95 text-white p-3 rounded-2xl shadow-xl text-xs font-semibold text-center animate-bounce z-20">
            {toastMessage}
          </div>
        )}

        {/* Idle Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white text-emerald-600 flex items-center justify-center shadow-lg animate-pulse">
              <Flame className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{contentData.games.snake.title}</h3>
              <p className="text-xs text-slate-200 mt-1 max-w-xs">
                Vượt mốc 20 điểm nhận ngay 1 voucher xăng 2 lít, vượt 40 điểm nhận 2 voucher xăng!
              </p>
            </div>
            <button
              onClick={startSnakeGame}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>
          </div>
        )}

        {/* Game End Receipt Modal ("Phiếu xác nhận quà tặng" required by PDF) */}
        {gameState === 'ended' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-3 z-30 animate-fadeIn">
            <div className="bg-white text-slate-900 rounded-3xl p-5 w-full max-w-sm shadow-2xl border-4 border-yellow-400 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-[#005596]">VIETINBANK REWARD</span>
                <span className="text-[10px] text-slate-400 font-medium">{finishTime}</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phiếu Xác Nhận Quà Tặng
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {score} <span className="text-sm font-semibold text-slate-500">Điểm</span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${
                score >= 20 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="text-xs font-semibold">Mức quà đạt được:</div>
                <div className="text-sm font-bold mt-0.5">{rewardWon}</div>
                {voucherCode && (
                  <div className="mt-2 text-lg font-mono font-black tracking-widest text-[#005596] bg-white py-1.5 px-3 rounded-xl border border-dashed border-[#005596]">
                    {voucherCode}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-600 leading-tight">
                {score >= 20
                  ? 'Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.'
                  : 'Rất tiếc, Quý khách chưa đạt mốc nhận voucher. Hãy thử lại để chinh phục mốc 20 điểm!'}
              </p>

              <div className="flex items-center justify-center gap-2 pt-1">
                {voucherCode && (
                  <button
                    onClick={() => onCopyVoucher(voucherCode)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {copiedCode === voucherCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === voucherCode ? 'Đã copy' : 'Sao chép mã'}</span>
                  </button>
                )}
                <button
                  onClick={startSnakeGame}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#005596] hover:bg-[#003c71] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chơi lại</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* D-Pad On-Screen Controls for Kiosk Screen & Mobile */}
      <div className="max-w-xs mx-auto pt-2">
        <div className="text-center text-[11px] font-semibold text-slate-400 mb-2">
          Phím điều hướng cảm ứng
        </div>
        <div className="grid grid-cols-3 gap-2 w-44 mx-auto">
          <div></div>
          <button
            onClick={() => handleDpad(0, -1)}
            className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-blue-100 text-slate-800 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div></div>
          
          <button
            onClick={() => handleDpad(-1, 0)}
            className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-blue-100 text-slate-800 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleDpad(0, 1)}
            className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-blue-100 text-slate-800 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleDpad(1, 0)}
            className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-blue-100 text-slate-800 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
