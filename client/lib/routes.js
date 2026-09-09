export const routes = {
  home: "/",
  auth: {
    root: "/auth",
    login: "/auth",
    register: "/auth",
    forgotPassword: "/auth/forgot-password",
  },

  roadmap: {
    root: "/roadmap",
    level: (level) => `/roadmap/${level.toLowerCase()}`,
    topic: (level, topic) =>
      `/roadmap/${level.toLowerCase()}/${topic.toLowerCase()}`,
  },

  vocabulary: {
    root: "/vocabulary",
    textbook: (name) => `/vocabulary/${name.toLowerCase()}`,
    topic: (name, topic) =>
      `/vocabulary/${name.toLowerCase()}/${topic.toLowerCase()}`,
  },

  flashcards: {
    root: "/flashcards",
    level: (level) => `/flashcards/${level.toLowerCase()}`,
    topic: (level, topic) =>
      `/flashcards/${level.toLowerCase()}/${topic.toLowerCase()}`,
  },

  practice: {
    root: "/practice",
    mode: (mode) => `/practice/${mode.toLowerCase()}`,
  },

  account: {
    root: "/account",
    profile: "/account/profile",
    settings: "/account/settings",
    progress: "/account/progress",
  },
};
