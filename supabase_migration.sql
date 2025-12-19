-- ============================================
-- ThinkMethod - Add Missing Columns
-- Run this FIRST if tables already exist
-- ============================================

-- Add new columns to activity_logs
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS event_sequence INTEGER,
ADD COLUMN IF NOT EXISTS time_since_session_start_ms BIGINT;

-- Add new columns to chat_logs
ALTER TABLE chat_logs
ADD COLUMN IF NOT EXISTS conversation_id TEXT,
ADD COLUMN IF NOT EXISTS turn_number INTEGER,
ADD COLUMN IF NOT EXISTS message_sequence INTEGER,
ADD COLUMN IF NOT EXISTS time_since_session_start_ms BIGINT,
ADD COLUMN IF NOT EXISTS time_since_last_message_ms BIGINT,
ADD COLUMN IF NOT EXISTS session_start_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS message_timestamp TIMESTAMPTZ DEFAULT NOW();

-- Add new columns to user_sessions
ALTER TABLE user_sessions
ADD COLUMN IF NOT EXISTS total_duration_ms BIGINT,
ADD COLUMN IF NOT EXISTS total_messages INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_events INTEGER DEFAULT 0;

-- Remove NOT NULL constraint if it causes issues (for existing rows)
-- Note: New rows will still have these values populated by the app
ALTER TABLE chat_logs ALTER COLUMN conversation_id DROP NOT NULL;
ALTER TABLE chat_logs ALTER COLUMN turn_number DROP NOT NULL;
ALTER TABLE chat_logs ALTER COLUMN message_sequence DROP NOT NULL;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_sequence ON activity_logs(session_id, event_sequence);
CREATE INDEX IF NOT EXISTS idx_chat_logs_conversation_id ON chat_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_turn ON chat_logs(conversation_id, turn_number);
CREATE INDEX IF NOT EXISTS idx_chat_logs_sequence ON chat_logs(session_id, message_sequence);

-- ============================================
-- Views for Sequential Analysis
-- ============================================

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
WHERE conversation_id IS NOT NULL
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
WHERE conversation_id IS NOT NULL
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
WHERE c1.conversation_id IS NOT NULL
ORDER BY c1.conversation_id, c1.turn_number;

SELECT 'Migration completed successfully!' as status;
