import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RESEARCH_DESIGNS } from '../constants';
import { loggingService } from '../services/loggingService';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sources?: string[];
}

interface ChatAdvisorProps {
    currentDesign?: string;
}

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Build knowledge base from research designs
const buildKnowledgeBase = () => {
    return RESEARCH_DESIGNS.map(design => `
## ${design.name} (${design.category})
**Best For:** ${design.bestFor}
**Description:** ${design.description}
**Strengths:** ${design.strengths.join('; ')}
**Weaknesses:** ${design.weaknesses.join('; ')}
**Sampling:** ${design.checklist.sampling}
**Analysis:** ${design.checklist.analysis}
${design.pitfalls ? `**Common Pitfalls:** ${design.pitfalls.join('; ')}` : ''}
${design.costLevel ? `**Cost:** ${design.costLevel}` : ''}
${design.expertiseRequired ? `**Expertise:** ${design.expertiseRequired}` : ''}
`).join('\n---\n');
};

const KNOWLEDGE_BASE = buildKnowledgeBase();

const SYSTEM_PROMPT = `You are a friendly Research Design Advisor. You have access to 18 research designs.

## Knowledge Base
${KNOWLEDGE_BASE}

## Response Format Rules - VERY IMPORTANT
1. Keep responses SHORT and SCANNABLE (max 150 words)
2. Use bullet points (•) instead of paragraphs
3. Use **bold** for key terms only
4. Add emoji icons at start of key sections: 📊 for data, ✅ for pros, ⚠️ for cons, 💡 for tips
5. End with 1-2 short follow-up question suggestions in format: "Ask me: ..."
6. NO long paragraphs - users want quick answers
7. Use simple, conversational language

Example good response:
"**RCT** is great for your goal! Here's why:

✅ **Pros:**
• Random assignment = highest internal validity
• Clear causal conclusions

⚠️ **Challenges:**
• Expensive ($$$)
• May not be ethical for all topics

💡 **Tip:** Aim for 30+ participants per group

Ask me: 'How do I calculate sample size?' or 'What if I can't randomize?'"`;

// Rich text renderer for chat messages
const RichTextMessage: React.FC<{ content: string; onQuickAction: (text: string) => void }> = ({ content, onQuickAction }) => {
    // Extract "Ask me:" suggestions for buttons
    const askMeMatch = content.match(/Ask me:?\s*['""]?(.+?)['""]?(?:\s+or\s+['""]?(.+?)['""]?)?$/i);
    const suggestions: string[] = [];
    let mainContent = content;

    if (askMeMatch) {
        mainContent = content.replace(/Ask me:?.+$/i, '').trim();
        if (askMeMatch[1]) suggestions.push(askMeMatch[1].replace(/['"'""]/g, '').trim());
        if (askMeMatch[2]) suggestions.push(askMeMatch[2].replace(/['"'""]/g, '').trim());
    }

    // Parse and render rich content
    const renderContent = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            // Headers with emoji
            if (trimmed.startsWith('##')) {
                return (
                    <h4 key={i} className="font-bold text-sky-700 mt-2 mb-1 text-sm">
                        {trimmed.replace(/^#+\s*/, '')}
                    </h4>
                );
            }

            // Section headers with icons
            if (trimmed.match(/^[✅⚠️💡📊🎯📋]/)) {
                return (
                    <div key={i} className="font-semibold text-slate-700 mt-2 mb-1 text-xs">
                        {renderBoldText(trimmed)}
                    </div>
                );
            }

            // Bullet points - styled cards
            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                const bulletContent = trimmed.replace(/^[•\-*]\s*/, '');
                return (
                    <div key={i} className="flex items-start gap-2 py-1 text-xs">
                        <span className="text-sky-400 mt-0.5">•</span>
                        <span className="text-slate-600">{renderBoldText(bulletContent)}</span>
                    </div>
                );
            }

            // Regular text
            return (
                <p key={i} className="text-xs text-slate-600 leading-relaxed">
                    {renderBoldText(trimmed)}
                </p>
            );
        });
    };

    // Render bold text
    const renderBoldText = (text: string) => {
        const parts = text.split(/\*\*(.+?)\*\*/g);
        return parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-800">{part}</strong> : part
        );
    };

    return (
        <div className="space-y-1">
            {renderContent(mainContent)}

            {/* Quick action buttons */}
            {suggestions.length > 0 && (
                <div className="pt-2 mt-2 border-t border-slate-200 space-y-1.5">
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Quick questions:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {suggestions.map((suggestion, i) => (
                            <button
                                key={i}
                                onClick={() => onQuickAction(suggestion)}
                                className="px-2.5 py-1 text-[11px] bg-gradient-to-r from-sky-50 to-blue-50 
                           text-sky-700 rounded-full border border-sky-200 
                           hover:from-sky-100 hover:to-blue-100 hover:border-sky-300
                           transition-all duration-200 shadow-sm hover:shadow"
                            >
                                {suggestion.length > 35 ? suggestion.slice(0, 35) + '...' : suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ChatAdvisor: React.FC<ChatAdvisorProps> = ({ currentDesign }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: '👋 Hi! I\'m your **Research Design Advisor**.\n\n💡 I know 18 research methodologies and can help you:\n• Choose the right design\n• Compare approaches\n• Understand tradeoffs\n\nAsk me: "Which design for measuring attitudes?" or "Compare RCT vs quasi-experiment"',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (customInput?: string) => {
        const messageText = customInput || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Log user message
        loggingService.logUserMessage(messageText.trim(), currentDesign);

        const startTime = Date.now();

        try {
            if (!ai) {
                throw new Error('API key not configured');
            }

            const conversationHistory = messages
                .slice(-4)
                .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n\n');

            const contextInfo = currentDesign
                ? `\nContext: User is viewing "${currentDesign}".`
                : '';

            const prompt = `${SYSTEM_PROMPT}${contextInfo}\n\nConversation:\n${conversationHistory}\n\nUser: ${userMessage.content}\n\nAssistant (remember: SHORT, use bullets, add emoji, end with "Ask me:"):`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const metadata = response.candidates?.[0]?.groundingMetadata;
            const sources: string[] = [];
            if (metadata?.groundingChunks) {
                metadata.groundingChunks.forEach((chunk: any) => {
                    if (chunk.web?.title) sources.push(chunk.web.title);
                });
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.text || 'Sorry, I couldn\'t generate a response.',
                timestamp: new Date(),
                sources: sources.length > 0 ? sources : undefined,
            };
            setMessages(prev => [...prev, assistantMessage]);

            // Log assistant response
            const responseTime = Date.now() - startTime;
            loggingService.logAssistantMessage(
                assistantMessage.content,
                responseTime,
                currentDesign,
                sources
            );
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '⚠️ **Error**\n\nCouldn\'t connect to AI service.\n\nAsk me: "Try again"',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickAction = (text: string) => {
        handleSend(text);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
                }}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                    </>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
                    style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(14, 165, 233, 0.1)',
                        height: '520px',
                        maxHeight: 'calc(100vh - 150px)',
                    }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-sky-500 to-blue-600">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-lg">🎓</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm">Research Advisor</h3>
                            <p className="text-white/70 text-[10px]">AI + Google Search</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="overflow-y-auto p-3 space-y-3" style={{ height: 'calc(100% - 120px)' }}>
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[90%] rounded-xl px-3 py-2.5 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-sm'
                                        : 'bg-slate-50 border border-slate-100 rounded-bl-sm shadow-sm'
                                        }`}
                                >
                                    {message.role === 'user' ? (
                                        <p className="text-sm">{message.content}</p>
                                    ) : (
                                        <RichTextMessage content={message.content} onQuickAction={handleQuickAction} />
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-50 border border-slate-100 rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400">Researching...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about research designs..."
                                className="flex-1 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-400 focus:bg-white text-sm transition-all"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
                                style={{
                                    background: input.trim() ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#e2e8f0',
                                }}
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatAdvisor;
