// Simple script to run the updateAllUserCredits mutation
// This will be executed via: npx convex run run_update_credits.js

import { api } from "./convex/_generated/api.js";

export default async function runUpdate(ctx) {
    const result = await ctx.runMutation(api.users.updateAllUserCredits, {});
    console.log("✅ Update completed!");
    console.log(result);
    return result;
}
