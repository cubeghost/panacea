export { };
declare global {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    SESSION_SECRET: string;
    MAGIC_LINK_SECRET: string;
    AUTH_EMAIL_FROM: string;
    SENDGRID_API_KEY: string;
  }
  interface Process {
    env: ProcessEnv;
  }
}