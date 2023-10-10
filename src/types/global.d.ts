declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string;
        DB_HOST: string;
        DB_PORT: string;
        DB_USER: string; 
        DB_PASSWORD: string;
        DB_NAME: string;
        BASE_DIR: string;
        JWT_SECRET: string;
        PASSWD_HASH_SECRET: string;
        MULTER_PATH: string;
        [key: string]: string;
      }
    }
  }
}
