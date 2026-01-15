import React, { useState } from 'react';
import { Button } from "./ui/Button";

const Layout = ({ children }) => {
  const [showAbout, setShowAbout] = useState(false);
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 -z-10" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-focus"><circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
            AttendIQ
          </div>
          <div className="flex gap-4">
             <Button variant="ghost" size="sm" onClick={() => setShowAbout(true)}>About</Button>
          </div>
        </div>
      </nav>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-lg shadow-xl m-4 border border-slate-200">
            <h2 className="text-2xl text-blue-600 font-bold mb-4">About AttendIQ</h2>
            <p className="text-muted-foreground mb-4">
              AttendIQ is a privacy-first attention tracker for online meetings. 
              We calculate engagement scores based on:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
              <li>active: Tab is focused and user is interacting.</li>
              <li>idle: No mouse/keyboard activity for 30s.</li>
              <li>away: Tab is hidden or window is blurred.</li>
            </ul>
            <div className="flex justify-end">
              <Button onClick={() => setShowAbout(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      <footer className="border-t bg-background/50 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AttendIQ. Privacy First Attention Tracking.
      </footer>
    </div>
  );
};

export default Layout;
