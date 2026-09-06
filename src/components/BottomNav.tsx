import { NavLink } from 'react-router';

const TABS = [
  { to: '/', icon: '🏠', label: 'Dashboard', end: true },
  { to: '/cases', icon: '📁', label: 'Cases', end: false },
  { to: '/calendar', icon: '📅', label: 'Calendar', end: false },
  { to: '/study', icon: '📚', label: 'Study', end: false },
  { to: '/guidance', icon: '✦', label: 'Guidance', end: false },
  { to: '/rules', icon: '📖', label: 'Rules', end: false },
  { to: '/settings', icon: '⚙︎', label: 'Settings', end: false },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}
        >
          <span className="bottom-nav-icon" aria-hidden="true">
            {tab.icon}
          </span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
