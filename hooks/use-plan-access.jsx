import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

export function usePlanAccess() {
  const { has, isLoaded, isSignedIn } = useAuth();

  const isPro = has?.({ plan: "pro" }) || false;
  const isFree = !isPro;

  // Only fetch user data if authenticated and loaded
  const shouldFetchUser = isLoaded && isSignedIn;

  // Use conditional hook pattern
  const userQuery = useConvexQuery(api.users.getCurrentUser);
  const user = shouldFetchUser ? userQuery.data : undefined;

  // mutation to update plan
  const { mutate: updatePlan } = useConvexMutation(api.users.updatePlan);

  // auto-sync plan between Clerk and Convex
  useEffect(() => {
    if (!isSignedIn || !user) return;

    // if mismatch, update Convex
    const targetPlan = isPro ? "pro" : "free";
    if (user.plan !== targetPlan) {
      updatePlan({ plan: targetPlan }).catch((err) => {
        console.error("Failed to sync plan:", err);
      });
    }
  }, [isSignedIn, isPro, user?.plan, updatePlan]);

  // Define which tools are available for each plan
  const planAccess = {
    resize: true,
    crop: true,
    adjust: true,
    text: true,

    // Pro-only tools
    background: isPro,
    ai_extender: isPro,
    ai_edit: isPro,
  };

  const hasAccess = (toolId) => planAccess[toolId] === true;

  const getRestrictedTools = () => {
    return Object.entries(planAccess)
      .filter(([_, hasAccess]) => !hasAccess)
      .map(([toolId]) => toolId);
  };

  const canCreateProject = (currentProjectCount) =>
    isPro ? true : currentProjectCount < 3;

  const canExport = (currentExportsThisMonth) =>
    isPro ? true : currentExportsThisMonth < 20;

  return {
    userPlan: isPro ? "pro" : "free_user",
    isPro,
    isFree,
    hasAccess,
    planAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
    user,
  };
}
