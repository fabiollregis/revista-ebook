
// This file re-exports from the separate modules
// to maintain backward compatibility
export {
  getPages,
  getPageById,
  getPageBySlug,
  savePage,
  deletePage,
  incrementPageView
} from "./supabase/page-api";

export {
  getSiteSettings,
  saveSiteSettings
} from "./supabase/settings-api";

export {
  getUserProfiles,
  updateUserAdminStatus
} from "./supabase/user-api";
