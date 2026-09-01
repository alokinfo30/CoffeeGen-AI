import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Plus,
  Sliders,
  ChevronDown,
  ChevronUp,
  Activity,
  Coffee,
  RotateCcw,
  Zap,
  Flame,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ChatMessage,
  CustomerProfile,
  EnvironmentContext,
  MenuItem,
  CartItem,
  CustomizationState
} from '../types';

interface ChatInterfaceProps {
  activeProfile: CustomerProfile;
  env: EnvironmentContext;
  onOpenCustomizer: (item: MenuItem, initialCustomization?: Partial<CustomizationState>) => void;
  onAddToCartDirect: (item: MenuItem, customization?: Partial<CustomizationState>) => void;
  onViewTrace: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  activeProfile,
  env,
  onOpenCustomizer,
  onAddToCartDirect,
  onViewTrace
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome greeting on profile switch
  useEffect(() => {
    const welcomeText = activeProfile.caffeineTolerance === 'decaf'
      ? `Welcome back, ${activeProfile.name}! I'm Sage, your AI Barista powered by Google ADK. Since it's ${env.timeOfDay} and you prefer decaf/low caffeine, I've got our Swiss Water Colombian roast and herbal refreshers ready for you. How can I craft your drink today?`
      : activeProfile.dietaryRestrictions.includes('keto')
      ? `Hello Dr. ${activeProfile.name.split(' ')[1] || activeProfile.name}! Sage here, your ADK Barista. Ready with single-origin pour-overs and brain-fuel MCT Americanos with zero sugar. What are we brewing this ${env.timeOfDay}?`
      : activeProfile.allergies.includes('dairy')
      ? `Hi ${activeProfile.name}! Great to see you. I'm Sage, your AI Barista. I have our fresh Oat milk microfoam and seasonal syrups prepped with zero dairy cross-contamination. What are you in the mood for?`
      : `Welcome to Roast & Reason, ${activeProfile.name}! I'm Sage, your AI Coffee Sommelier powered by Google ADK & RAG. How can I customize your perfect brew this ${env.timeOfDay}?`;

    setMessages([
      {
        id: `welcome-${activeProfile.id}`,
        sender: 'agent',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeProfile.id, env.timeOfDay]);

  // Dynamic quick prompt chips based on customer profile
  const promptSuggestions = [
    activeProfile.caffeineTolerance === 'decaf'
      ? '🌙 Relaxing decaf brew for the afternoon'
      : activeProfile.dietaryRestrictions.includes('keto')
      ? '⚡ Keto brain-fuel coffee with zero sugar'
      : activeProfile.allergies.includes('dairy')
      ? '🌾 Refreshing iced oat milk latte'
      : '☕ Energizing afternoon single-origin roast',
    '🥐 Recommended pastry pairing for my taste',
    '✨ Surprise me with custom flavor notes',
    '🧊 Chilled artisanal drink under $6'
  ];

  const handleSendMessage = async (userQuery?: string) => {
    const query = userQuery || inputText.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          customerProfileId: activeProfile.id,
          environmentContext: env,
          conversationHistory: messages.slice(-4).map((m) => ({
            sender: m.sender === 'agent' ? 'agent' : 'user',
            text: m.text
          }))
        })
      });

      const data = await res.json();

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedItems: data.recommendedItems,
        actionSuggestion: data.actionSuggestion,
        adkTrace: data.adkTrace,
        ragSources: data.ragSources
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.error('Failed to query barista agent:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: "I'm experiencing a brief connectivity glitch with the Cloud Run agent service. Let's look at our fresh morning roast collection!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Barista voice playback with resilient fallbacks
  const fallbackToWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*_~`]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onend = () => setPlayingVoiceId(null);
        utterance.onerror = () => setPlayingVoiceId(null);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setPlayingVoiceId(null);
      }
    } else {
      setPlayingVoiceId(null);
    }
  };

  const handlePlayVoice = async (msgId: string, text: string) => {
    if (playingVoiceId === msgId) {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (_) {}
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }
      setPlayingVoiceId(null);
      return;
    }

    setPlayingVoiceId(msgId);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 250) })
      });
      const data = await response.json();

      if (data.success && data.base64Audio) {
        try {
          const audio = new Audio(`data:audio/wav;base64,${data.base64Audio}`);
          audioRef.current = audio;
          audio.onended = () => setPlayingVoiceId(null);
          audio.onerror = () => {
            console.info('Audio element source unsupported, switching to Web Speech synthesizer');
            fallbackToWebSpeech(text);
          };
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              fallbackToWebSpeech(text);
            });
          }
        } catch (_) {
          fallbackToWebSpeech(text);
        }
      } else {
        fallbackToWebSpeech(text);
      }
    } catch (err) {
      fallbackToWebSpeech(text);
    }
  };

  return (
    <div className="flex flex-col h-[740px] bg-zinc-900/70 backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Header bar */}
      <div className="bg-zinc-950/80 border-b border-white/[0.06] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 shadow-md ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-zinc-950 stroke-[2.2]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-zinc-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-sm text-zinc-100">Barista Sage</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono border border-amber-500/25">
                ADK Agent • Gemini 3.7
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Real-time conversational recommendations & personalized RAG
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `welcome-reset`,
                sender: 'agent',
                text: `Session refreshed. How can I craft your drink today, ${activeProfile.name}?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/[0.08] transition"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isPlaying = playingVoiceId === msg.id;
          const isTraceExpanded = expandedTraceId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Agent Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Coffee className="w-4 h-4" />
                </div>
              )}

              {/* Message Content Bubble */}
              <div className={`max-w-[90%] sm:max-w-[82%] space-y-2.5`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none'
                      : 'bg-zinc-900/90 border border-white/[0.08] text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Audio Speaker for Agent */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/[0.06] text-[11px] text-zinc-400">
                      <button
                        onClick={() => handlePlayVoice(msg.id, msg.text)}
                        className="flex items-center gap-1.5 hover:text-amber-300 transition text-[11px] font-medium"
                        title="Listen to barista voice"
                      >
                        {isPlaying ? (
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <div className="flex items-center gap-0.5 h-3">
                              <span className="w-1 bg-amber-400 rounded-full animate-wave-1"></span>
                              <span className="w-1 bg-amber-400 rounded-full animate-wave-2"></span>
                              <span className="w-1 bg-amber-400 rounded-full animate-wave-3"></span>
                              <span className="w-1 bg-amber-400 rounded-full animate-wave-4"></span>
                            </div>
                            <span className="font-semibold">Speaking... (Stop)</span>
                          </div>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Listen to Voice</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] font-mono text-zinc-500">{msg.timestamp}</span>
                    </div>
                  )}
                </div>

                {/* ADK Trace Observability Accordion */}
                {!isUser && msg.adkTrace && msg.adkTrace.length > 0 && (
                  <div className="bg-zinc-950/80 border border-amber-500/20 rounded-2xl overflow-hidden text-xs shadow-inner">
                    <button
                      onClick={() => setExpandedTraceId(isTraceExpanded ? null : msg.id)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-amber-300/90 hover:bg-zinc-900 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span className="font-mono text-[11px] font-semibold">
                          ADK Execution Pipeline ({msg.adkTrace.length} stages)
                        </span>
                        {msg.ragSources && (
                          <span className="text-[10px] text-zinc-400 hidden sm:inline font-mono">
                            • {msg.ragSources.length} RAG vectors
                          </span>
                        )}
                      </div>
                      {isTraceExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isTraceExpanded && (
                      <div className="p-3.5 bg-zinc-950 border-t border-white/[0.06] space-y-2 text-[11px] font-mono">
                        {msg.adkTrace.map((step, idx) => (
                          <div
                            key={step.id || idx}
                            className="p-2.5 rounded-xl bg-zinc-900/90 border border-white/[0.06] text-zinc-300"
                          >
                            <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                              <span className="flex items-center gap-1.5">
                                <span className="text-zinc-500 text-[10px]">#{idx + 1}</span>
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 text-[9px] uppercase border border-amber-500/20">
                                  {step.stage}
                                </span>
                                <span>{step.title}</span>
                              </span>
                              <span className="text-zinc-500 text-[10px]">
                                {step.latencyMs ? `${step.latencyMs}ms` : ''}
                              </span>
                            </div>
                            <p className="text-zinc-400 font-sans text-xs mt-1">{step.description}</p>
                          </div>
                        ))}
                        <div className="pt-1 flex justify-end">
                          <button
                            onClick={onViewTrace}
                            className="text-amber-400 hover:text-amber-300 text-[11px] font-medium flex items-center gap-1 transition"
                          >
                            <span>Inspect Full ADK Diagnostic Studio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommended Drink Cards */}
                {!isUser && msg.recommendedItems && msg.recommendedItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {msg.recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-zinc-900/95 border border-white/[0.08] hover:border-amber-500/40 rounded-2xl p-3.5 text-zinc-100 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl group"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/[0.06] group-hover:scale-105 transition duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-300 transition truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">
                              ${item.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1">
                              <span className="flex items-center gap-0.5">
                                <Flame className="w-3 h-3 text-orange-400" />
                                {item.calories} kcal
                              </span>
                              <span className="text-zinc-600">•</span>
                              <span className="flex items-center gap-0.5">
                                <Zap className="w-3 h-3 text-amber-400" />
                                {item.caffeineMg}mg
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Dietary Tags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {item.dietaryTags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-300 border border-white/[0.06]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/[0.06]">
                          <button
                            onClick={() =>
                              onAddToCartDirect(
                                item,
                                msg.actionSuggestion?.customization
                              )
                            }
                            className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Quick Add</span>
                          </button>
                          <button
                            onClick={() =>
                              onOpenCustomizer(
                                item,
                                msg.actionSuggestion?.customization
                              )
                            }
                            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/[0.08] transition"
                            title="Customize ingredients & recipe"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-white/[0.1] text-zinc-300 flex items-center justify-center shrink-0 mt-1 overflow-hidden shadow-sm">
                  <img
                    src={activeProfile.avatar}
                    alt={activeProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Barista Thinking Animation */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl rounded-tl-none p-3.5 text-xs text-amber-300 flex items-center gap-2.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-[11px]">
                ADK Agent: Querying RAG Vector Index & Personalizing for {activeProfile.name.split(' ')[0]}...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-zinc-950/70 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 shrink-0">Ask:</span>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-200 border border-white/[0.08] transition shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-zinc-950 border-t border-white/[0.08] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask Sage anything (e.g., "Recommend a refreshing cold drink" or "What pairs with pour-over?")...`}
          disabled={isLoading}
          className="flex-1 bg-zinc-900 border border-white/[0.1] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition disabled:opacity-50"
          id="chat-input-barista"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:hover:bg-amber-500 transition shadow-lg shadow-amber-500/20"
          id="btn-send-message"
        >
          <Send className="w-4 h-4 stroke-[2.2]" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};

