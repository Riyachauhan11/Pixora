import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),

    // usage tracking for free plan limits
    projectsUsed: v.number(), // current projects made
    exportsThisMonth: v.number(), // monthly export limit

    // timestamps
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_email", { searchField: "email" }),

  projects: defineTable({
    // basic project info
    title: v.string(),
    userId: v.id("users"), // foreign key from users table

    // canvas dimensions and state
    canvasState: v.any(), // Fabric.js canvas JSON (objects, layers, etc)
    width: v.number(), // Canvas width in pixels
    height: v.number(), // Canvas ht in pixels

    // image pipeline - tracks img transformations (optional as initially it can be empty)
    originalImageUrl: v.optional(v.string()), // initial img
    currentImageUrl: v.optional(v.string()), // current updated img
    thumbnailUrl: v.optional(v.string()), // preview for dashboard

    // ImageKiy transformation state
    activeTransformations: v.optional(v.string()), // Current ImageKit URL params

    // AI features state - tracks what AI processing has been applied
    backgroundRemoved: v.optional(v.boolean()), // has bg been removed or not

    // Organization
    folderId: v.optional(v.id("folders")), // foreign key from folders table

    // timestamps
    createdAt: v.number(),
    updatedAt: v.number(), // Last edit time
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .index("by_folder", ["folderId"]),

  folders: defineTable({
    name: v.string(), // folder name
    userId: v.id("users"), // owner
    createdAt: v.number(),
  }).index("by_user", ["userId"]), // user's folders
});

/* 
PLAN LIMITS EXAMPLE:
- Free: 3 projects, 20 exports/month, basic features only
- Pro: Unlimited projects/exports, all AI features
*/
