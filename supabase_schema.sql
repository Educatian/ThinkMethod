-- ============================================
-- ThinkMethod Activity Logging SQL Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Activity Logs Table (for click events)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_action TEXT NOT NULL,
    event_label TEXT,
    event_value JSONB DEFAULT '{}',
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    -- Sequential analysis fields
    event_sequence INTEGER,                    -- Order of events in session
    time_since_session_start_ms BIGINT,       -- Milliseconds since session started
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat Logs Table (for AI message exchanges)
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    conversation_id TEXT NOT NULL,             -- Groups messages in same conversation
    message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
    message_content TEXT NOT NULL,
    current_design TEXT,
    sources JSONB DEFAULT '[]',
    token_count INTEGER,
    response_time_ms INTEGER,
    -- Sequential analysis fields for conversation flow
    turn_number INTEGER NOT NULL,              -- 1, 2, 3... within conversation
    message_sequence INTEGER NOT NULL,         -- Overall message order in session
    time_since_session_start_ms BIGINT,       -- Milliseconds since session started
    time_since_last_message_ms BIGINT,        -- Milliseconds since previous message
    session_start_time TIMESTAMPTZ,           -- When the session started
    message_timestamp TIMESTAMPTZ DEFAULT NOW(), -- Exact timestamp of message
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Sessions Table (for tracking sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT UNIQUE NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    total_duration_ms BIGINT,                 -- Total session duration
    total_messages INTEGER DEFAULT 0,         -- Total chat messages
    total_events INTEGER DEFAULT 0,           -- Total activity events
    device_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_session_id ON activity_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_sequence ON activity_logs(session_id, event_sequence);

-- Chat logs indexes
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_conversation_id ON chat_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_logs_turn ON chat_logs(conversation_id, turn_number);
CREATE INDEX IF NOT EXISTS idx_chat_logs_sequence ON chat_logs(session_id, message_sequence);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Activity logs: Allow insert for all (even anonymous), read only own data
CREATE POLICY "Allow insert for all" ON activity_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own activity" ON activity_logs
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Chat logs: Same as activity logs
CREATE POLICY "Allow insert for all" ON chat_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own chats" ON chat_logs
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- User sessions: Users can manage their own sessions
CREATE POLICY "Allow insert for all" ON user_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================
-- Views for Analytics & Sequential Analysis
-- ============================================

-- View: Daily activity summary
CREATE OR REPLACE VIEW daily_activity_summary AS
SELECT 
    DATE(created_at) as date,
    event_category,
    event_action,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users
FROM activity_logs
GROUP BY DATE(created_at), event_category, event_action
ORDER BY date DESC;

-- View: Chat statistics
CREATE OR REPLACE VIEW chat_statistics AS
SELECT 
    DATE(created_at) as date,
    message_role,
    COUNT(*) as message_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(response_time_ms) FILTER (WHERE message_role = 'assistant') as avg_response_time_ms
FROM chat_logs
GROUP BY DATE(created_at), message_role
ORDER BY date DESC;

-- View: Popular research designs
CREATE OR REPLACE VIEW popular_designs AS
SELECT 
    event_label as design_name,
    COUNT(*) as view_count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM activity_logs
WHERE event_category = 'design' AND event_action = 'view'
GROUP BY event_label
ORDER BY view_count DESC;

-- View: Conversation flow analysis (for sequential analysis)
CREATE OR REPLACE VIEW conversation_flow_analysis AS
SELECT 
    conversation_id,
    session_id,
    user_id,
    turn_number,
    message_role,
    message_content,
    current_design,
    response_time_ms,
    time_since_session_start_ms,
    time_since_last_message_ms,
    message_timestamp,
    -- Calculate inter-message gap categories
    CASE 
        WHEN time_since_last_message_ms IS NULL THEN 'first_message'
        WHEN time_since_last_message_ms < 5000 THEN 'quick_response'
        WHEN time_since_last_message_ms < 30000 THEN 'normal_response'
        WHEN time_since_last_message_ms < 120000 THEN 'delayed_response'
        ELSE 'long_gap'
    END as response_category
FROM chat_logs
ORDER BY conversation_id, turn_number;

-- View: Session conversation summary
CREATE OR REPLACE VIEW session_conversation_summary AS
SELECT 
    session_id,
    conversation_id,
    user_id,
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE message_role = 'user') as user_messages,
    COUNT(*) FILTER (WHERE message_role = 'assistant') as assistant_messages,
    MAX(turn_number) as total_turns,
    MIN(message_timestamp) as conversation_start,
    MAX(message_timestamp) as conversation_end,
    EXTRACT(EPOCH FROM (MAX(message_timestamp) - MIN(message_timestamp))) * 1000 as conversation_duration_ms,
    AVG(response_time_ms) FILTER (WHERE message_role = 'assistant') as avg_ai_response_time_ms,
    AVG(time_since_last_message_ms) FILTER (WHERE message_role = 'user' AND turn_number > 1) as avg_user_think_time_ms
FROM chat_logs
GROUP BY session_id, conversation_id, user_id;

-- View: User message patterns (for lag sequential analysis)
CREATE OR REPLACE VIEW user_message_patterns AS
SELECT 
    c1.conversation_id,
    c1.turn_number as turn,
    c1.message_role,
    c1.message_timestamp,
    c1.time_since_last_message_ms as gap_from_previous,
    c2.message_role as next_message_role,
    c2.time_since_last_message_ms as next_message_gap,
    c1.current_design
FROM chat_logs c1
LEFT JOIN chat_logs c2 ON c1.conversation_id = c2.conversation_id 
    AND c2.turn_number = c1.turn_number + 1
ORDER BY c1.conversation_id, c1.turn_number;

