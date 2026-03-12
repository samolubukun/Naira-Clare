import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { DEFAULT_CREDITS } from "./creditLimits";

export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
    },
});

export const CreateUser = mutation({
    args: {
        name: v.optional(v.string()),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db.query('users')
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!existingUser) {
            const userName = args.name || args.email.split('@')[0] || 'User';
            const userId = await ctx.db.insert('users', {
                name: userName,
                email: args.email,
                profileCompleted: false,
                credits: DEFAULT_CREDITS,
            });
            return await ctx.db.get(userId);
        }
        
        // Ensure existing users have credits initialized if missing
        if (existingUser.credits === undefined) {
            await ctx.db.patch(existingUser._id, { credits: DEFAULT_CREDITS });
        }
        
        return existingUser;
    }
});

export const UpdateUserProfile = mutation({
    args: {
        id: v.id('users'),
        onboardingType: v.string(), // "solo", "employee", "business"
        stateOfResidence: v.string(),
        salaryProfile: v.optional(v.object({
            basic: v.number(),
            housing: v.number(),
            transport: v.number(),
            otherAllowances: v.number(),
            pensionEnabled: v.boolean(),
            nhfEnabled: v.boolean(),
            nhisEnabled: v.boolean(),
        })),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) throw new Error('User not found');

        await ctx.db.patch(args.id, {
            onboardingType: args.onboardingType,
            stateOfResidence: args.stateOfResidence,
            salaryProfile: args.salaryProfile,
            profileCompleted: true,
        });

        return await ctx.db.get(args.id);
    }
});

export const decrementCredits = mutation({
    args: { id: v.id('users'), amount: v.number() },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) throw new Error("User not found");
        
        const currentCredits = user.credits ?? 0;
        const newCredits = Math.max(0, currentCredits - args.amount);
        
        await ctx.db.patch(args.id, { credits: newCredits });
        return { success: true, newCredits };
    }
});

export const updateAllUserCredits = mutation({
    args: { amount: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        const amount = args.amount ?? DEFAULT_CREDITS;
        
        for (const user of users) {
            await ctx.db.patch(user._id, { credits: amount });
        }
        return `Updated ${users.length} users with ${amount} credits.`;
    }
});