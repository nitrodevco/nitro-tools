import { Eye, X } from 'lucide-react';
import { useState } from 'react';
import { RightPanel } from './RightPanel';

export function MobilePreviewSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-16 right-4 z-40 h-12 w-12 rounded-full bg-primary shadow-lg flex items-center justify-center text-primary-foreground"
        aria-label="Open preview"
      >
        <Eye className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background border-t border-border rounded-t-xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '82dvh' }}
      >
        {/* Drag handle + close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="w-10 h-1 rounded-full bg-border mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <span className="text-sm font-semibold">Preview &amp; Export</span>
          <button
            onClick={() => setOpen(false)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 min-h-0">
          <RightPanel />
        </div>
      </div>
    </>
  );
}
