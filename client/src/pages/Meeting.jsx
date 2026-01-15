import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAttentionTracking } from '../hooks/useAttentionTracking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const Meeting = () => {
  const { code } = useParams();
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState('');
  const [participantId, setParticipantId] = useState(null);
  const [error, setError] = useState('');
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // We only enable tracking after joining
  const handleTrackingUpdate = useRef((data) => {
    // This will be replaced once joined
  });

  const { score, status } = useAttentionTracking((data) => {
    if (meetingEnded) return; // Stop tracking if ended
    if (handleTrackingUpdate.current) handleTrackingUpdate.current(data);
  });

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingCode: code, name })
      });
      const data = await res.json();
      
      if (data.success) {
        setParticipantId(data.participant.id);
        setJoined(true);
        // Setup tracking sender
        handleTrackingUpdate.current = (trackingData) => {
           // Send heartbeat to server
           fetch('/api/track', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
               participantId: data.participant.id,
               currentScore: trackingData.score,
               events: [] 
             })
           })
           .then(res => res.json())
           .then(resData => {
             if (resData.ended) {
               setFinalScore(trackingData.score);
               setMeetingEnded(true);
             }
           })
           .catch(err => console.error("Tracking Error", err));
        };
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to join meeting');
    }
  };

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">Join Meeting</CardTitle>
            <CardDescription>Enter your name to join the session.</CardDescription>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleJoin} className="space-y-4">
               <Input 
                 placeholder="Your Name" 
                 value={name} 
                 onChange={e => setName(e.target.value)} 
                 required
               />
               {error && <p className="text-sm text-red-500">{error}</p>}
               <Button type="submit" className="w-full">Join Now</Button>
             </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (meetingEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <Card className="max-w-md w-full text-center border-red-200 bg-red-50">
          <CardHeader>
            <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            </div>
            <CardTitle className="text-2xl text-red-900">Meeting Ended</CardTitle>
            <CardDescription className="text-red-700">The host has ended this session.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-slate-700">Final Score: {finalScore}</p>
            <Button className="mt-6 w-full" variant="outline" onClick={() => window.location.href = '/'}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">You are in the meeting</h1>
        <p className="text-muted-foreground font-medium">Keep this tab open and active to maintain your focus score.</p>
      </div>

      <div className="relative group">
        <div className={`absolute -inset-1 blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${
            status === 'active' ? 'bg-green-600' : status === 'idle' ? 'bg-yellow-500' : 'bg-red-600'
        }`}></div>
        <Card className="relative w-80 text-center border-t-4 border-t-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-8xl tabular-nums font-black text-blue-600 tracking-tighter">
              {score}
            </CardTitle>
            <CardDescription className="uppercase tracking-widest font-bold text-blue-400 mt-2">
              Current Focus Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border ${
               status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 
               status === 'idle' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
               'bg-red-100 text-red-700 border-red-200'
            }`}>
              {status === 'active' && <span className="w-2.5 h-2.5 mr-2 bg-green-600 rounded-full animate-pulse"/>}
              {status === 'idle' && <span className="w-2.5 h-2.5 mr-2 bg-yellow-600 rounded-full"/>}
              {status === 'away' && <span className="w-2.5 h-2.5 mr-2 bg-red-600 rounded-full"/>}
              {status}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-md text-sm text-center text-slate-800 p-6 border border-slate-200 rounded-xl bg-slate-100 shadow-md">
        <p className="leading-relaxed">
          <strong className="text-slate-900">Privacy Notice:</strong> We only check if this tab is active and if you are interacting with the page. We do <u>not</u> access your camera, microphone, or screen content.
        </p>
      </div>
    </div>
  );
};

export default Meeting;
