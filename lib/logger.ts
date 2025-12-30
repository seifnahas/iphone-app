const LOG_PREFIX = '[MapMemories]';

export function info(...messages: unknown[]) {
  console.info(LOG_PREFIX, ...messages);
}

export function warn(...messages: unknown[]) {
  console.warn(LOG_PREFIX, ...messages);
}

export function error(...messages: unknown[]) {
  console.error(LOG_PREFIX, ...messages);
}
