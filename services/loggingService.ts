import { supabase } from './supabaseService';

// Session tracking state
let sessionStartTime: number | null = null;
let eventSequence = 0;
let messageSequence = 0;
let currentConversationId: string | null = null;
let turnNumber = 0;
let lastMessageTime: number | null = null;

// Generate unique session ID
const generateSessionId = (): string => {
    const stored = sessionStorage.getItem('thinkmethod_session_id');
    if (stored) return stored;

    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('thinkmethod_session_id', newId);
    return newId;
};

// Generate unique conversation ID
const generateConversationId = (): string => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create conversation ID
const getConversationId = (): string => {
    if (!currentConversationId) {
        currentConversationId = generateConversationId();
        turnNumber = 0;
    }
    return currentConversationId;
};

// Start a new conversation
export const startNewConversation = (): void => {
    currentConversationId = generateConversationId();
    turnNumber = 0;
    lastMessageTime = null;
};

// Get current session ID
export const getSessionId = (): string => generateSessionId();

// Initialize session start time
const initSessionStartTime = (): number => {
    if (!sessionStartTime) {
        const stored = sessionStorage.getItem('thinkmethod_session_start');
        if (stored) {
            sessionStartTime = parseInt(stored, 10);
        } else {
            sessionStartTime = Date.now();
            sessionStorage.setItem('thinkmethod_session_start', sessionStartTime.toString());
        }
    }
    return sessionStartTime;
};

// Get time since session start in milliseconds
const getTimeSinceSessionStart = (): number => {
    const startTime = initSessionStartTime();
    return Date.now() - startTime;
};

// Event categories
export type EventCategory =
    | 'navigation'
    | 'design'
    | 'wizard'
    | 'comparison'
    | 'glossary'
    | 'chat'
    | 'auth'
    | 'button'
    | 'interaction';

// Event actions
export type EventAction =
    | 'click'
    | 'view'
    | 'navigate'
    | 'submit'
    | 'open'
    | 'close'
    | 'select'
    | 'add'
    | 'remove'
    | 'send'
    | 'receive';

interface ActivityLogData {
    event_type: string;
    event_category: EventCategory;
    event_action: EventAction;
    event_label?: string;
    event_value?: Record<string, any>;
}

interface ChatLogData {
    message_role: 'user' | 'assistant' | 'system';
    message_content: string;
    current_design?: string;
    sources?: string[];
    token_count?: number;
    response_time_ms?: number;
}

// Logging service
export const loggingService = {
    // Log activity/click event with sequential data
    async logActivity(data: ActivityLogData): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            eventSequence++;

            await supabase.from('activity_logs').insert({
                user_id: user?.id || null,
                session_id: getSessionId(),
                event_type: data.event_type,
                event_category: data.event_category,
                event_action: data.event_action,
                event_label: data.event_label || null,
                event_value: data.event_value || {},
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                // Sequential analysis fields
                event_sequence: eventSequence,
                time_since_session_start_ms: getTimeSinceSessionStart(),
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    },

    // Log chat message with full sequential analysis data
    async logChatMessage(data: ChatLogData): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Increment counters
            messageSequence++;
            turnNumber++;

            // Calculate time since last message
            const now = Date.now();
            const timeSinceLastMessage = lastMessageTime ? now - lastMessageTime : null;
            lastMessageTime = now;

            const sessionStart = initSessionStartTime();

            await supabase.from('chat_logs').insert({
                user_id: user?.id || null,
                session_id: getSessionId(),
                conversation_id: getConversationId(),
                message_role: data.message_role,
                message_content: data.message_content,
                current_design: data.current_design || null,
                sources: data.sources || [],
                token_count: data.token_count || null,
                response_time_ms: data.response_time_ms || null,
                // Sequential analysis fields
                turn_number: turnNumber,
                message_sequence: messageSequence,
                time_since_session_start_ms: now - sessionStart,
                time_since_last_message_ms: timeSinceLastMessage,
                session_start_time: new Date(sessionStart).toISOString(),
                message_timestamp: new Date(now).toISOString(),
            });
        } catch (error) {
            console.error('Failed to log chat message:', error);
        }
    },

    // Start a new session
    async startSession(): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Initialize session start time
            sessionStartTime = Date.now();
            sessionStorage.setItem('thinkmethod_session_start', sessionStartTime.toString());

            // Reset counters
            eventSequence = 0;
            messageSequence = 0;
            turnNumber = 0;
            currentConversationId = null;
            lastMessageTime = null;

            await supabase.from('user_sessions').upsert({
                session_id: getSessionId(),
                user_id: user?.id || null,
                started_at: new Date().toISOString(),
                is_active: true,
                total_messages: 0,
                total_events: 0,
                device_info: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            }, {
                onConflict: 'session_id',
            });
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    },

    // End session with duration
    async endSession(): Promise<void> {
        try {
            const sessionStart = initSessionStartTime();
            const totalDuration = Date.now() - sessionStart;

            await supabase.from('user_sessions').update({
                ended_at: new Date().toISOString(),
                is_active: false,
                total_duration_ms: totalDuration,
                total_messages: messageSequence,
                total_events: eventSequence,
            }).eq('session_id', getSessionId());
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    },

    // Quick logging helper functions
    logClick(category: EventCategory, label: string, value?: Record<string, any>) {
        this.logActivity({
            event_type: 'click',
            event_category: category,
            event_action: 'click',
            event_label: label,
            event_value: value,
        });
    },

    logNavigation(from: string, to: string) {
        this.logActivity({
            event_type: 'navigation',
            event_category: 'navigation',
            event_action: 'navigate',
            event_label: to,
            event_value: { from, to },
        });
    },

    logDesignView(designName: string, designId: string) {
        this.logActivity({
            event_type: 'design_view',
            event_category: 'design',
            event_action: 'view',
            event_label: designName,
            event_value: { designId },
        });
    },

    logWizardStep(step: number, answer: string) {
        this.logActivity({
            event_type: 'wizard_step',
            event_category: 'wizard',
            event_action: 'select',
            event_label: `step_${step}`,
            event_value: { step, answer },
        });
    },

    logComparison(action: 'add' | 'remove', designId: string) {
        this.logActivity({
            event_type: 'comparison',
            event_category: 'comparison',
            event_action: action,
            event_label: designId,
        });
    },

    logUserMessage(content: string, currentDesign?: string) {
        this.logChatMessage({
            message_role: 'user',
            message_content: content,
            current_design: currentDesign,
        });
    },

    logAssistantMessage(content: string, responseTimeMs: number, currentDesign?: string, sources?: string[]) {
        this.logChatMessage({
            message_role: 'assistant',
            message_content: content,
            current_design: currentDesign,
            sources: sources,
            response_time_ms: responseTimeMs,
        });
    },

    logAuthEvent(action: 'signin' | 'signup' | 'signout' | 'reset_password', success: boolean) {
        this.logActivity({
            event_type: 'auth',
            event_category: 'auth',
            event_action: action === 'signout' ? 'click' : 'submit',
            event_label: action,
            event_value: { success },
        });
    },

    // Reset conversation (for new chat sessions)
    resetConversation() {
        startNewConversation();
    },
};

export default loggingService;
