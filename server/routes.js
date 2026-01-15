const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

// --- Helpers ---
const generateId = () => Math.random().toString(36).substring(2, 9);

// --- Routes ---

// 1. Create a Meeting
router.post('/meetings', async (req, res) => {
  const { hostName, title } = req.body;
  if (!hostName) return res.status(400).json({ error: 'Host name is required' });

  // In a real app, you might authenticate the host here.
  // For this version, we just create a record.
  
  const meetingId = generateId(); // Friendly ID for sharing
  
  const { data, error } = await supabase
    .from('meetings')
    .insert([
      { 
        meeting_code: meetingId, 
        title: title || 'Untitled Meeting',
        host_name: hostName,
        status: 'active'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating meeting:', error);
    return res.status(500).json({ error: 'Failed to create meeting' });
  }

  res.json({ success: true, meeting: data });
});

// 2. Join a Meeting
router.post('/join', async (req, res) => {
  const { meetingCode, name } = req.body;
  
  if (!meetingCode || !name) {
    return res.status(400).json({ error: 'Meeting code and name are required' });
  }

  // Check if meeting exists
  const { data: meeting, error: fetchError } = await supabase
    .from('meetings')
    .select('*')
    .eq('meeting_code', meetingCode)
    .single();

  if (fetchError || !meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }

  if (meeting.status === 'ended') {
    return res.status(403).json({ error: 'Meeting has ended' });
  }

  // Create participant
  const { data: participant, error: insertError } = await supabase
    .from('participants')
    .insert([{
      meeting_id: meeting.id, // Using the UUID from DB
      name: name,
      join_time: new Date().toISOString(),
      score: 100 // Initial focus score
    }])
    .select()
    .single();

  if (insertError) {
    console.error('Error joining meeting:', insertError);
    return res.status(500).json({ error: 'Failed to join meeting' });
  }

  res.json({ success: true, participant });
});

// 3. Track Attention (Heartbeat)
router.post('/track', async (req, res) => {
  const { participantId, events, currentScore } = req.body;
  
  // Log events (optional, for detailed analytics)
  // For now, we update the participant's current state/score
  
  // Note: 'events' would be an array of { type: 'blur', timestamp: ... }
  
  // Check if meeting is still active
  const { data: participant } = await supabase
    .from('participants')
    .select('meeting_id')
    .eq('id', participantId)
    .single();

  if (participant) {
    const { data: meeting } = await supabase
      .from('meetings')
      .select('status')
      .eq('id', participant.meeting_id)
      .single();
      
    if (meeting && meeting.status === 'ended') {
      return res.json({ success: false, ended: true });
    }
  }

  // Update participant score in DB
  const { error } = await supabase
    .from('participants')
    .update({ 
      score: currentScore,
      last_active: new Date().toISOString()
    })
    .eq('id', participantId);

  if (error) {
      console.error('Error tracking:', error);
       // Don't fail the client hard on tracking errors, just log
      return res.status(200).json({ success: false }); 
  }

  res.json({ success: true });
});

// 4. End a Meeting
router.post('/end-meeting', async (req, res) => {
  const { meetingCode } = req.body;
  
  const { error } = await supabase
    .from('meetings')
    .update({ status: 'ended' })
    .eq('meeting_code', meetingCode);

  if (error) {
    console.error('Error ending meeting:', error);
    return res.status(500).json({ error: 'Failed to end meeting' });
  }

  res.json({ success: true });
});

// 5. Get Meeting Details (Polling for Host Dashboard)
router.get('/meetings/:code', async (req, res) => {
  const { code } = req.params;

  // Get Meeting
  const { data: meeting, error: mError } = await supabase
    .from('meetings')
    .select('*')
    .eq('meeting_code', code)
    .single();
    
  if (mError || !meeting) return res.status(404).json({ error: 'Meeting not found' });

  // Get Participants
  // Note: In a real Supabase app, you'd use Realtime Subscriptions instead of polling!
  const { data: participants, error: pError } = await supabase
    .from('participants')
    .select('*')
    .eq('meeting_id', meeting.id);

  res.json({ 
    meeting, 
    participants: participants || [] 
  });
});

module.exports = router;
