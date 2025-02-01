import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'ubd1ox',
  env: {
    MAILOSAUR_API_KEY: "nV9gfL6B4paj20cNuNc2pS5h8qBNJt05",
    MAILOSAUR_SERVER_ID: "p8ywunhp",
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
     
    },
  },
});