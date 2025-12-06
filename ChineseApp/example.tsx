import React from 'react';
import { Flame, Check, Calendar, Layers } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      {/* Mobile Frame Emulator */}
      <div className="w-full max-w-[375px] bg-black rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-800 h-[812px] relative text-white">
        
        {/* Status Bar Mockup */}
        <div className="h-12 w-full flex justify-between items-center px-6 text-xs font-medium absolute top-0 left-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2.5 bg-white rounded-sm"></div>
            <div className="w-0.5 h-2.5 bg-white/30 rounded-sm"></div>
          </div>
        </div>

        {/* Content ScrollView */}
        <div className="h-full overflow-y-auto pt-14 pb-8 px-4 scrollbar-hide">
          
          {/* --- MODULE 1: CÁ NHÂN --- */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">Cá nhân</h2>
            
            <div className="bg-[#1C1C1E] rounded-[24px] p-5 relative overflow-hidden">
              {/* Header: Icon & Text */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  {/* Flame Icon Background Effect */}
                  <div className="absolute inset-0 bg-purple-500 blur-md opacity-20 rounded-full"></div>
                  <Flame size={40} className="text-[#A855F7] fill-[#A855F7]" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-1 text-[10px] font-bold text-white">
                    39
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Thói quen thành hình!</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Bạn đã online 1 phút</p>
                </div>
              </div>

              {/* Streak Bar Container */}
              {/* Sử dụng gap-4 cố định để căn chỉnh chính xác viên thuốc nền */}
              <div className="flex items-start gap-4 relative">
                
                {/* Active Pill Background (T2-T5) */}
                {/* Đã chỉnh: h-8 (bằng hình tròn), bỏ padding thừa, ôm vừa đủ 4 ngày */}
                <div className="bg-[#9333EA] rounded-full flex gap-4 absolute left-0 top-0 z-0 items-center h-8 pl-0 pr-0">
                   {/* Invisible spacers to match exact width of days */}
                   <div className="w-8"></div>
                   <div className="w-8"></div>
                   <div className="w-8"></div>
                   <div className="w-8"></div>
                </div>

                {/* Days Rendering */}
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
                  const isActive = index < 4; // T2-T5
                  const isLastActive = index === 3; // T5
                  
                  return (
                    <div key={day} className="flex flex-col items-center gap-2 z-10 w-8">
                      {/* Circle Container */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-transparent' : 'bg-[#27272a]'}`}>
                        {isActive && (
                          <Check size={18} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                      {/* Text Label */}
                      <span className={`text-xs font-medium ${isLastActive ? 'text-[#D8B4FE]' : isActive ? 'text-white' : 'text-gray-500'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* --- MODULE 2: TIỆN ÍCH --- */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Tiện ích</h2>
            
            <div className="grid grid-cols-2 gap-3">
              
              {/* Card 1: Hôm nay đã tra (Panda) */}
              <div className="bg-[#1C1C1E] rounded-[24px] p-4 relative h-40 flex flex-col justify-between overflow-hidden group cursor-pointer hover:bg-[#2c2c2e] transition-colors">
                <div>
                    <p className="text-gray-400 text-xs mb-1">Hôm nay đã tra</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">1</span>
                        <span className="text-sm text-white">từ</span>
                    </div>
                    <div className="flex flex-col mt-1">
                        <span className="text-[#EF4444] text-xs font-bold">-94%</span>
                        <span className="text-gray-500 text-[10px]">so với hôm qua</span>
                    </div>
                </div>
                
                {/* Panda Image Mockup */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 transition-transform group-hover:scale-110">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png" 
                    alt="Panda" 
                    className="w-full h-full object-contain opacity-90 drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3 h-40">
                
                {/* Card 2: Lịch sử */}
                <div className="bg-[#1C1C1E] rounded-[24px] p-4 flex-1 relative overflow-hidden group cursor-pointer hover:bg-[#2c2c2e] transition-colors flex items-center">
                    <span className="text-[#FCA5A5] font-semibold z-10 relative text-sm">Lịch sử</span>
                    {/* Decorative Icon */}
                    <div className="absolute -right-2 -bottom-4 transform -rotate-12 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Calendar size={56} className="text-[#F87171]" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Card 3: Từ vựng */}
                <div className="bg-[#1C1C1E] rounded-[24px] p-4 flex-1 relative overflow-hidden group cursor-pointer hover:bg-[#2c2c2e] transition-colors flex items-center">
                    <span className="text-[#BFDBFE] font-semibold z-10 relative text-sm">Từ vựng</span>
                    {/* Decorative Icon */}
                    <div className="absolute -right-2 -bottom-4 transform -rotate-12 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Layers size={56} className="text-[#60A5FA]" strokeWidth={1.5} />
                    </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Tab Bar Mockup (Visual Context) */}
        <div className="absolute bottom-0 w-full h-20 bg-[#1C1C1E] flex justify-around items-start pt-4 px-2 border-t border-white/5">
             <div className="w-12 h-12 flex flex-col items-center gap-1 opacity-50">
                <div className="w-6 h-6 rounded bg-gray-500"></div>
                <div className="h-1 w-8 bg-gray-600 rounded"></div>
             </div>
             <div className="w-12 h-12 flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded bg-purple-500"></div>
                <div className="h-1 w-8 bg-purple-400 rounded"></div>
             </div>
             <div className="w-12 h-12 flex flex-col items-center gap-1 opacity-50">
                <div className="w-6 h-6 rounded bg-gray-500"></div>
                <div className="h-1 w-8 bg-gray-600 rounded"></div>
             </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-40"></div>
      </div>
    </div>
  );
}