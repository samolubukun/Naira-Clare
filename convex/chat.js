import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { CREDIT_LIMITS } from "./creditLimits";
import { decrementCredits } from "./users";

export const createChatSession = mutation({
    args: { uid: v.id('users'), topic: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.insert("chatSessions", { uid: args.uid, topic: args.topic });
    }
});

export const addChatMessage = mutation({
    args: { 
        sessionId: v.id('chatSessions'), 
        role: v.string(), 
        content: v.string() 
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("chatMessages", { ...args, timestamp: Date.now() });
        
        // Decrement credits for AI assistant messages
        if (args.role === 'assistant') {
            const session = await ctx.db.get(args.sessionId);
            if (session) {
                await decrementCredits(ctx, { id: session.uid, amount: CREDIT_LIMITS.FREE_PLAN.AI_CHAT_COST });
            }
        }
        
        return messageId;
    }
});

export const getChatSessions = query({
    args: { uid: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chatSessions")
            .withIndex("by_user", (q) => q.eq("uid", args.uid))
            .order("desc")
            .collect();
    }
});

export const getChatMessages = query({
    args: { sessionId: v.id('chatSessions') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .order("asc")
            .collect();
    }
});

export const deleteChatSession = mutation({
    args: { id: v.id('chatSessions') },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) => q.eq("sessionId", args.id))
            .collect();
        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
        await ctx.db.delete(args.id);
    }
});
