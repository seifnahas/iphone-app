declare module 'expo-sqlite' {
  export type SQLiteRunResult = {
    lastInsertRowId: number;
    changes: number;
  };

  export type SQLiteDatabase = {
    execAsync: (sql: string) => Promise<void>;
    runAsync: (sql: string, params?: unknown[]) => Promise<SQLiteRunResult | void>;
    getAllAsync: <T = unknown>(sql: string, params?: unknown[]) => Promise<T[]>;
    getFirstAsync: <T = unknown>(sql: string, params?: unknown[]) => Promise<T | undefined>;
  };

  export function openDatabaseAsync(name: string): Promise<SQLiteDatabase>;
}

declare module 'zustand' {
  type SetState<T> = (
    partial: Partial<T> | ((state: T) => Partial<T>),
    replace?: boolean,
  ) => void;
  type GetState<T> = () => T;

  type StoreApi<T> = {
    getState: GetState<T>;
    setState: SetState<T>;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  };

  export function create<T>(
    initializer: (set: SetState<T>, get: GetState<T>, api: StoreApi<T>) => T,
  ): (<U>(selector: (state: T) => U) => U) & StoreApi<T>;
}

declare module 'expo-av' {
  export namespace Audio {
    type AVPlaybackSource = { uri: string };
    type AVPlaybackStatus = {
      isLoaded: boolean;
      didJustFinish?: boolean;
    };

    type AVPlaybackStatusSuccess = AVPlaybackStatus & {
      isLoaded: true;
    };

    type AVPlaybackStatusToSet = {
      shouldPlay?: boolean;
    };

    class Sound {
      static createAsync(
        source: AVPlaybackSource,
        initialStatus?: AVPlaybackStatusToSet,
      ): Promise<{ sound: Sound; status: AVPlaybackStatusSuccess }>;
      unloadAsync(): Promise<void>;
      pauseAsync(): Promise<void>;
      setOnPlaybackStatusUpdate(callback?: (status: AVPlaybackStatus) => void): void;
    }
  }
}
