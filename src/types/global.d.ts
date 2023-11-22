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
        SFTP_HOST: string;
        SFTP_PORT: string;
        SFTP_AUTH_TYPE: 'password' | 'privateKey';
        SFTP_USERNAME: string;
        SFTP_PASSWORD: string;
        SFTP_KEY_PATH: string;
        SFTP_BASE_DIR: string;
        REDIS_URL: string;
        REDIS_USERNAME: string;
        REDIS_PASSWORD: string;
        [key: string]: string;
      }
    }
  }
}
