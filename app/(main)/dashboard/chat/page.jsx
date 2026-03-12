"use client"
import React, { useState, useContext, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, Loader2, Sparkles, Trash2, User, Bot, ArrowLeft, Plus, History, ShieldCheck, X } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { UserContext } from '@/app/_context/UserContext'
import { toast } from 'sonner'
import Link from 'next/link'
import moment from 'moment'
import ReactMarkdown from 'react-markdown'

function TaxAssistant() {
    const { userData } = useContext(UserContext)
    const createChatSession = useMutation(api.chat.createChatSession)
    const addMessage = useMutation(api.chat.addChatMessage)
    const updateTopic = useMutation(api.chat.updateChatSessionTopic)
    const deleteSession = useMutation(api.chat.deleteChatSession)
    
    const sessions = useQuery(api.chat.getChatSessions, userData ? { uid: userData._id } : "skip")
    
    const [currentSessionId, setCurrentSessionId] = useState(null)
    const messages = useQuery(api.chat.getChatMessages, currentSessionId ? { sessionId: currentSessionId } : "skip")
    
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (messages) scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const startNewChat = async () => {
        if (!userData) return
        try {
            const id = await createChatSession({ uid: userData._id, topic: "New Consultation" })
            setCurrentSessionId(id)
            setShowHistory(false)
        } catch (err) {
            toast.error("Failed to start new chat")
        }
    }

    const sendMessage = async () => {
        if (!input.trim() || !currentSessionId || isLoading) return

        const userContent = input.trim()
        setInput('')
        setIsLoading(true)

        try {
            // Update topic if it's the first message
            if (!messages || messages.length === 0) {
                const newTopic = userContent.length > 30 ? userContent.substring(0, 30) + "..." : userContent;
                await updateTopic({ id: currentSessionId, topic: newTopic });
            }

            // Save user message
            await addMessage({ sessionId: currentSessionId, role: "user", content: userContent })

            // Get AI response
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...(messages || []), { role: "user", content: userContent }],
                    userType: userData?.onboardingType,
                    state: userData?.stateOfResidence
                })
            })
            
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            // Save assistant message
            await addMessage({ sessionId: currentSessionId, role: "assistant", content: data.content })
        } catch (err) {
            toast.error("Failed to get response")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteSession = async (id, e) => {
        e.stopPropagation()
        try {
            await deleteSession({ id })
            if (currentSessionId === id) setCurrentSessionId(null)
            toast.success("Consultation deleted")
        } catch (err) {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className='max-w-7xl mx-auto md:h-[calc(100vh-90px)] h-[calc(100vh-80px)] flex gap-8 md:pb-1 pb-0'>
            {/* Sidebar */}
            <div className={`
                ${showHistory ? 'w-72 border-r' : 'w-0 overflow-hidden'} 
                transition-all duration-300 ease-in-out bg-white border-gray-100 hidden lg:block overflow-x-hidden
            `}>
                <div className="p-6 flex flex-col h-full w-72">
                    <Button onClick={startNewChat} className="w-full rounded-2xl bg-[#2D5A27] text-white font-black mb-8 shadow-lg shadow-[#2D5A27]/10 hover:scale-105 transition-all">
                        <Plus className="w-4 h-4 mr-2" /> New Consultation
                    </Button>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 no-scrollbar">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <History className="w-3 h-3" /> Recent Consultations
                        </p>
                        {sessions?.map(s => (
                            <div 
                                key={s._id} 
                                onClick={() => {setCurrentSessionId(s._id); setShowHistory(false)}}
                                className={`p-4 rounded-2xl cursor-pointer transition-all border group relative ${currentSessionId === s._id ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-transparent hover:border-emerald-100'}`}
                            >
                                <p className={`text-sm font-bold truncate pr-6 ${currentSessionId === s._id ? 'text-[#2D5A27]' : 'text-gray-600'}`}>{s.topic}</p>
                                <p className="text-[10px] font-medium text-gray-400 mt-1">{moment(s._creationTime).fromNow()}</p>
                                <button onClick={(e) => handleDeleteSession(s._id, e)} className="absolute right-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3 h-3 text-rose-400 hover:text-rose-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile History Sidebar (Overlay) */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform lg:hidden ${showHistory ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full relative">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowHistory(false)} 
                        className="absolute right-4 top-4 rounded-xl text-gray-400 hover:text-rose-500"
                    >
                        <X className="w-5 h-5" strokeWidth={3} />
                    </Button>
                    <Button onClick={startNewChat} className="md:w-full w-auto px-6 self-start rounded-2xl bg-[#2D5A27] text-white font-black mb-8 shadow-lg shadow-[#2D5A27]/10 hover:scale-105 transition-all">
                        <Plus className="w-4 h-4 mr-2" /> New Consultation
                    </Button>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <History className="w-3 h-3" /> Recent Consultations
                        </p>
                        {sessions?.map(s => (
                            <div 
                                key={s._id} 
                                onClick={() => {setCurrentSessionId(s._id); setShowHistory(false)}}
                                className={`p-4 rounded-2xl cursor-pointer transition-all border group relative ${currentSessionId === s._id ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-transparent hover:border-emerald-100'}`}
                            >
                                <p className={`text-sm font-bold truncate pr-6 ${currentSessionId === s._id ? 'text-[#2D5A27]' : 'text-gray-600'}`}>{s.topic}</p>
                                <p className="text-[10px] font-medium text-gray-400 mt-1">{moment(s._creationTime).fromNow()}</p>
                                <button onClick={(e) => handleDeleteSession(s._id, e)} className="absolute right-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3 h-3 text-rose-400 hover:text-rose-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white md:rounded-[2.5rem] rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden mb-4 md:mb-0">
                <div className="md:p-8 p-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-[#2D5A27]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Clare</h2>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> NTA 2025 Expert
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={() => setShowHistory(!showHistory)} className="rounded-xl flex items-center gap-2 font-bold text-gray-500 hover:text-[#2D5A27]">
                        <History className="w-5 h-5" />
                        <span className="hidden md:inline text-xs uppercase tracking-widest">History</span>
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto md:p-8 p-5 md:space-y-8 space-y-5 no-scrollbar">
                    {!currentSessionId ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
                            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-[#2D5A27]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#0f172a] tracking-tight mb-2">Hello! I'm Clare.</h3>
                                <p className="text-sm text-gray-400 font-medium">I can help you navigate Nigerian tax laws, calculate liabilities, and maximize your deductions. Pick a consultation to start.</p>
                            </div>
                            <Button onClick={startNewChat} className="rounded-2xl px-8 bg-[#2D5A27] text-white font-black">
                                Start Consult
                            </Button>
                        </div>
                    ) : (
                        <>
                            {messages?.map((msg, i) => (
                                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#2D5A27] text-white' : 'bg-gray-100 text-[#0f172a]'}`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#2D5A27] text-white rounded-tr-none' : 'bg-gray-50 text-[#0f172a] rounded-tl-none font-medium'}`}>
                                        <ReactMarkdown 
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                                strong: ({node, ...props}) => <strong className="font-extrabold" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#0f172a]">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="bg-gray-50 p-5 rounded-[1.5rem] rounded-tl-none">
                                        <Loader2 className="w-5 h-5 animate-spin text-[#2D5A27]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {currentSessionId && (
                    <div className="md:p-8 p-4 border-t border-gray-50 bg-white">
                        <div className="relative flex items-center">
                            <Textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                                placeholder="Ask Clare..."
                                className="w-full rounded-2xl md:rounded-[1.5rem] pr-14 pl-6 md:py-4 py-3 border-gray-100 focus:border-[#2D5A27] focus:ring-[#2D5A27] resize-none md:h-14 h-12 font-medium"
                            />
                            <Button 
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1.5 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#2D5A27] text-white p-0 hover:scale-105 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 text-center">Clare provides guidance, not legal tax advice.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaxAssistant
