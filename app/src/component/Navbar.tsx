import { useState } from 'react';
import { Search, Command, Bell, ChevronDown } from 'lucide-react';
import { CommandBar } from './CommandBar';

export function Navbar() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-6"
        style={{
          background: 'rgba(10, 17, 29, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #1A2840',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="font-display text-base font-semibold text-text-primary">
            Hawk Eye
          </span>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className="relative transition-all duration-200 ease-out"
            style={{ width: searchFocused ? 400 : 300 }}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
            <input
              type="text"
              placeholder="بحث سريع..."
              className="w-full h-10 pr-10 pl-4 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                background: '#121C2B',
                border: '1px solid #1A2840',
                color: '#F8FAFC',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* AI Command Button */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              color: '#F8FAFC',
            }}
          >
            <Command className="w-4 h-4" />
            <span className="font-body text-sm">AI Command</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ background: '#121C2B', border: '1px solid #1A2840' }}
          >
            <Bell className="w-5 h-5" style={{ color: '#94A3B8' }} />
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center"
              style={{ background: '#EF4444', color: 'white' }}
            >
              3
            </span>
          </button>

          {/* User Avatar */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 transition-all duration-200"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                color: 'white',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              AE
            </div>
            <ChevronDown className="w-4 h-4" style={{ color: '#475569' }} />
          </button>
        </div>
      </nav>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div
          className="fixed top-[72px] left-24 z-50 w-80 rounded-xl overflow-hidden"
          style={{
            background: '#0D1420',
            border: '1px solid #1A2840',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="p-3 border-b" style={{ borderColor: '#1A2840' }}>
            <span className="font-body text-sm font-medium text-text-primary">الإشعارات</span>
          </div>
          {[
            { severity: 'critical', text: 'الوكيل #42 اكتشف نمط مكالمات متكرر', time: 'منذ 5 دقائق' },
            { severity: 'medium', text: 'تحديث نتائج القضية CDR-2025-0130', time: 'منذ 12 دقيقة' },
            { severity: 'low', text: 'اكتمال تحليل 3 ملفات جديدة', time: 'منذ 30 دقيقة' },
          ].map((notif, i) => (
            <div
              key={i}
              className="p-3 flex gap-3 items-start border-b transition-colors duration-200 hover:bg-[#121C2B]"
              style={{ borderColor: '#1A2840' }}
            >
              <span
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{
                  background:
                    notif.severity === 'critical' ? '#EF4444' : notif.severity === 'medium' ? '#F59E0B' : '#3B82F6',
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-text-primary truncate">{notif.text}</p>
                <p className="font-body text-xs mt-1" style={{ color: '#475569' }}>{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div
          className="fixed top-[72px] left-6 z-50 w-48 rounded-xl overflow-hidden"
          style={{
            background: '#0D1420',
            border: '1px solid #1A2840',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          {['الملف الشخصي', 'الإعدادات', 'تسجيل الخروج'].map((item, i) => (
            <button
              key={i}
              className="w-full text-right px-4 py-2.5 font-body text-sm text-text-secondary transition-colors duration-200 hover:bg-[#121C2B] hover:text-text-primary"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Command Bar Modal */}
      {isCommandOpen && <CommandBar onClose={() => setIsCommandOpen(false)} />}
    </>
  );
}
