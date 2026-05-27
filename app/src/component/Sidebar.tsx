import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  GitCompareArrows,
  FileText,
  Settings,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'لوحة القيادة' },
  { path: '/analysis', icon: Search, label: 'تحليل' },
  { path: '/cross-case', icon: GitCompareArrows, label: 'ربط قضايا' },
  { path: '/reports', icon: FileText, label: 'تقارير' },
  { path: '/settings', icon: Settings, label: 'إعدادات' },
];

export function Sidebar() {
  return (
    <aside
      className="fixed right-0 top-16 w-16 h-[calc(100vh-64px)] z-40 flex flex-col items-center pt-6 gap-1"
      style={{
        background: '#0A111D',
        borderLeft: '1px solid #1A2840',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-[#121C2B] text-brand-blue'
                  : 'text-[#475569] hover:bg-[#0D1420] hover:text-text-secondary'
              }`
            }
            title={item.label}
            end={item.path === '/'}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full"
                    style={{
                      background: 'linear-gradient(to bottom, #3B82F6, #06B6D4)',
                    }}
                  />
                )}
                <Icon className="w-5 h-5" />
              </>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
}
