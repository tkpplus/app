declare module 'plyr' {
  export interface PlyrOptions {
    controls?: string[] | ((options: PlyrOptions) => string[]);
    settings?: string[];
    autoplay?: boolean;
    seekTime?: number;
    volume?: number;
    muted?: boolean;
    speed?: { selected: number; options: number[] };
    youtube?: {
      noCookie?: boolean;
      rel?: number;
      showinfo?: number;
      iv_load_policy?: number;
      modestbranding?: number;
      playsinline?: number;
      controls?: number;
      disablekb?: number;
      customControls?: boolean;
      [key: string]: any;
    };
    tooltips?: {
      controls?: boolean;
      seek?: boolean;
    };
    keyboard?: {
      focused?: boolean;
      global?: boolean;
    };
    fullscreen?: {
      enabled?: boolean;
      fallback?: boolean;
      iosNative?: boolean;
    };
    storage?: {
      enabled?: boolean;
      key?: string;
    };
    i18n?: Record<string, string>;
    [key: string]: any;
  }

  export interface PlyrSource {
    type: 'video' | 'audio';
    sources: Array<{
      src: string;
      provider?: 'youtube' | 'vimeo' | 'html5';
      size?: number;
    }>;
    poster?: string;
    tracks?: any[];
  }

  export default class Plyr {
    constructor(target: HTMLElement | string, options?: PlyrOptions);
    source: PlyrSource;
    play(): Promise<void>;
    pause(): void;
    togglePlay(toggle?: boolean): boolean;
    stop(): void;
    restart(): void;
    rewind(seekTime?: number): void;
    forward(seekTime?: number): void;
    seek(time: number): void;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
    speed: number;
    playing: boolean;
    paused: boolean;
    stopped: boolean;
    ended: boolean;
    elements: {
      container: HTMLElement;
      wrapper: HTMLElement;
      inputs: Record<string, HTMLInputElement>;
      buttons: Record<string, HTMLButtonElement>;
      progress?: HTMLElement;
      controls?: HTMLElement;
      [key: string]: any;
    };
    captions?: any;
    [key: string]: any;
    on(event: string, callback: (event: any) => void): void;
    once(event: string, callback: (event: any) => void): void;
    off(event: string, callback: (event: any) => void): void;
    destroy(): void;
  }
}
