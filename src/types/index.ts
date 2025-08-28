import 'express-session';
import 'express';
import 'socket.io';

import type { Types } from '@/mongodb';

declare module 'express-session' {
  export interface SessionData {
    userDetails: {
      _id?: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      password?: string;
    };
    invoiceDetails: {
      userId: string;
      email: string;
      amount: number;
      currency: string;
      name?: string;
    };
  }
}

export type Role = 'user' | 'host' | 'admin';
export type Status = 'active' | 'inactive';

export interface Media {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  fieldname: string;
}

declare module 'express' {
  export interface Request {
    user?: Types.IUser;
    file?: Express.Multer.File;
    media?: Media[];
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

declare module 'socket.io' {
  export interface Socket {
    user?: Types.IUser;
    clientIp?: string;
    proxy: string[];
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

export type DaysInWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';
