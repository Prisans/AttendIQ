import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const Dashboard = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll for updates every 2 seconds
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/meetings/${code}`);
        const data = await res.json();
        if (data.meeting) {
          setMeeting(data.meeting);
          setParticipants(data.participants.sort((a,b) => b.score - a.score)); // Sort by high score
        }
      } catch (err) {
        console.error("Error polling", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingData();
    const interval = setInterval(fetchMeetingData, 2000);
    return () => clearInterval(interval);
  }, [code]);

  if (loading) return <div className="flex justify-center p-20">Loading...</div>;
  if (!meeting) return <div className="flex justify-center p-20 text-red-500">Meeting not found</div>;

  const averageScore = participants.length > 0 
    ? Math.round(participants.reduce((acc, p) => acc + p.score, 0) / participants.length)
    : 0;

  const handleEndMeeting = async () => {
    if (!confirm('Are you sure you want to end this meeting? Participants will no longer be able to join.')) return;
    try {
      await fetch('http://localhost:5000/api/end-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingCode: code })
      });
      setMeeting(prev => ({ ...prev, status: 'ended' })); // Update local state immediately
      alert('Meeting ended. You can now return to home.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
           <div className="flex flex-col gap-2 mt-2">
             <div className="flex items-center gap-2">
               <span className="text-muted-foreground w-12">Code:</span>
               <code className="bg-slate-100 px-2 py-1 rounded font-mono text-lg font-bold select-all cursor-pointer text-slate-900 border border-slate-200" onClick={() => navigator.clipboard.writeText(code)}>
                 {code}
               </code>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-muted-foreground w-12">Link:</span>
               <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  <span className="text-sm text-slate-600 truncate max-w-[200px]">{window.location.origin}/meeting/{code}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Copy Link" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/meeting/${code}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
               </div>
             </div>
           </div>
           <p className="text-sm text-green-600 font-medium flex items-center gap-2 mt-2">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
             Live Tracking Active
           </p>
        </div>
        <div className="flex gap-2">
          {meeting.status === 'ended' ? (
             <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
          ) : (
             <Button variant="destructive" onClick={handleEndMeeting}>End Meeting</Button>
          )}
          <Card className="w-full md:w-auto min-w-[200px] border-primary/20 bg-primary/5">
             <CardHeader className="p-4 pb-2">
                <CardDescription>Average Attention</CardDescription>
                <CardTitle className="text-4xl text-primary">{averageScore}%</CardTitle>
             </CardHeader>
             <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                 across {participants.length} participants
             </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-xl font-semibold">Participants</h2>
        
        {participants.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
            No participants yet. Share the code <strong>{code}</strong> to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((p) => (
              <Card key={p.id} className="transition-all duration-300 hover:shadow-lg border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-bold text-blue-700">
                    {p.name}
                  </CardTitle>
                  <div className={`text-2xl font-bold text-blue-600`}>
                    {p.score}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-1000 bg-blue-600`} 
                      style={{ width: `${p.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-400 mt-2 text-right">
                    Last active: {new Date(p.last_active || p.join_time).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
