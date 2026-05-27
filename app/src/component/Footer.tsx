export function Footer() {
  return (
    <footer
      className="fixed bottom-0 inset-x-0 h-8 z-50 flex items-center justify-between px-6"
      style={{
        background: 'rgba(10, 17, 29, 0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #1A2840',
      }}
    >
      <div className="flex items-center gap-4">
        <span className="font-body text-xs" style={{ color: '#475569' }}>
          ForensicAI v2.4.1
        </span>
        <span className="font-body text-xs" style={{ color: '#475569' }}>
          Hawk Eye Platform
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="relative inline-flex w-2 h-2 rounded-full"
          style={{ background: '#06B6D4' }}
        >
          <span
            className="absolute inset-0 rounded-full animate-pulse-dot"
            style={{ background: '#06B6D4' }}
          />
        </span>
        <span className="font-mono text-xs" style={{ color: '#06B6D4' }}>
          299/300 Active
        </span>
      </div>
    </footer>
  );
}
