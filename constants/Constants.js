const RoleType = {
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  EDITOR: "editor",
  AUTHOR: "author",
  FREELANCER: "freelancer",
  AFFILIATE: "affiliate",
  SEO: "seo",
};

const TagType = {
  PLAYER: "player",
  TEAM: "team",
};

const RegisterStep = {
  CREATED: "created",
  PROFILEUPADETD: "profileupdated",
  COMPLETED: "completed",
};

const SocialType = {
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
  INSTAGRAM: "instagram",
  DISCORD: "discord",
  THREAD: "thread",
  PINTREST: "pinterest",
  YOUTUBE: "youtube",
};

const Badges = {};

const Stamps = {};

const BlogStatus = {
  DRAFT: 0,
  PUBLISHED: 1,
};

const BlogFilterType = {
  Total: 0,
  Mine: 1,
  Deleted: 2,
};

const CommentStatus = {
  APPROVED: 0,
  DELETED: 1,
};

const TopicTypes = {
  TAG: "tag",
  PLAYER: "player",
  OTHER: "other",
};

module.exports = {
  RoleType,
  TagType,
  RegisterStep,
  SocialType,
  Badges,
  Stamps,
  BlogStatus,
  CommentStatus,
  TopicTypes,
  BlogFilterType,
};
