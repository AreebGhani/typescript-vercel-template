declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
  namespace Express {
    interface Request {
      clientIp?: string;
      device?: {
        type?: 'mobile' | 'tablet' | 'console' | 'smarttv' | 'wearable' | 'xr' | 'embedded';
        vendor?: string;
        model?: string;
      };
      browser?: {
        name?: string;
        version?: string;
        major?: string;
        type?: 'crawler' | 'cli' | 'email' | 'fetcher' | 'inapp' | 'mediaplayer' | 'library';
      };
      os?: {
        name?: string;
        version?: string;
      };
    }
  }
}

export {};
