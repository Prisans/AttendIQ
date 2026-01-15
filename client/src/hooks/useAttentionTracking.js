import { useState, useEffect, useRef, useCallback } from 'react';

export function useAttentionTracking(onUpdate) {
  const [score, setScore] = useState(100);
  const [status, setStatus] = useState('active'); // active, idle, away
  
  // Scoring parameters
  const params = {
    idleThreshold: 30000, // 30s considers you idle
    awayPenaltyPerSec: 1, // lose 1 point per second when away/idle
    recoveryPerSec: 0.5, // recover 0.5 point per second when active
    minScore: 0,
    maxScore: 100
  };

  const state = useRef({
    lastActivity: Date.now(),
    isActive: true, // Window is focused and user is interacting
    isTabVisible: true, // Tab is visible
    score: 100,
    status: 'active'
  });

  // Helper to sync state to React state and parent
  const syncState = useCallback(() => {
    setScore(Math.round(state.current.score));
    setStatus(state.current.status);
    if (onUpdate) {
      onUpdate({
        score: Math.round(state.current.score),
        status: state.current.status,
        timestamp: Date.now()
      });
    }
  }, [onUpdate]);

  // Activity listeners (mouse, key)
  useEffect(() => {
    const handleActivity = () => {
      state.current.lastActivity = Date.now();
      if (state.current.status === 'idle') {
        state.current.status = 'active';
        state.current.isActive = true;
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  // Visibility (Tab switch) and Focus (Window blur) listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        state.current.isTabVisible = false;
        state.current.status = 'away';
      } else {
        state.current.isTabVisible = true;
        // Don't auto-set to active immediately, let activity handler do it or next loop
        state.current.lastActivity = Date.now(); 
        state.current.status = 'active';
      }
    };

    const handleBlur = () => {
      state.current.isActive = false;
    };

    const handleFocus = () => {
      state.current.isActive = true;
      state.current.lastActivity = Date.now();
      state.current.status = 'active';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Main Tracking Loop (Runs every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - state.current.lastActivity;

      // Determine Status
      if (!state.current.isTabVisible) {
        state.current.status = 'away'; // Tab hidden
      } else if (!state.current.isActive) {
         // Window visible but not focused (e.g. side by side window)
         // We can be lenient here, or strict. Let's be lenient: counts as Active but maybe slower decay?
         // For now, let's treat blur as potential distraction if prolonged.
         // Actually prompt said "window blur and focus".
         state.current.status = 'away'; 
      } else if (timeSinceLastActivity > params.idleThreshold) {
        state.current.status = 'idle';
      } else {
        state.current.status = 'active';
      }

      // Calculate Score
      if (state.current.status === 'active') {
        // Recover
        state.current.score = Math.min(params.maxScore, state.current.score + params.recoveryPerSec);
      } else {
        // Decay
        state.current.score = Math.max(params.minScore, state.current.score - params.awayPenaltyPerSec);
      }

      syncState();

    }, 1000);

    return () => clearInterval(interval);
  }, [syncState]);

  return { score, status };
}
