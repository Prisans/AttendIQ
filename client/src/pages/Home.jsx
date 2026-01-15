import React, { useState } from 'react';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [hostName, setHostName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName, title: `${hostName}'s Meeting` })
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/dashboard/${data.meeting.meeting_code}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to create meeting: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 p-2">
          Focus Matters.
        </h1>
        <p className="text-xl text-muted-foreground">
          Measure meeting engagement ethically. Real-time attention scores without video or audio recording.
        </p>
      </div>

      <Card className="w-full max-w-md border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600" >Start a Session</CardTitle>
          <CardDescription>Generate a link for your participants.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateMeeting} className="flex flex-col gap-4">
            <Input 
              placeholder="Your Name (Host)" 
              value={hostName} 
              onChange={(e) => setHostName(e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="w-full font-bold" disabled={loading} variant="premium">
              {loading ? 'Creating...' : 'Create Instant Meeting'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-8 mt-12 text-center text-sm text-muted-foreground w-full max-w-4xl">
         <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white rounded-full shadow-sm text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .99 1.74l2.1 1.2a2 2 0 0 0 1.98 0l2.1-1.2a2 2 0 0 0 .99-1.74v-3.24a2 2 0 0 0-.97-1.71l-1.5-.75V8a4 4 0 0 1 8 0v2.43l-1.5.75a2 2 0 0 0-.97 1.71v3.24a2 2 0 0 0 .99 1.74l2.1 1.2a2 2 0 0 0 1.98 0l2.1-1.2a2 2 0 0 0 .99-1.74v-3.24a2 2 0 0 0-.99-1.74l-1.5-.75A6 6 0 0 0 12 2C8.69 2 6 4.69 6 8v2.17l-3.03 2.75Z"/></svg>
            </div>
            <p>Privacy First</p>
         </div>
         <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white rounded-full shadow-sm text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <p>Real-time Updates</p>
         </div>
         <div className="flex flex-col items-center gap-2">
             <div className="p-3 bg-white rounded-full shadow-sm text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>
             </div>
            <p>Focus Scores</p>
         </div>
      </div>
    </div>
  );
};

export default Home;
