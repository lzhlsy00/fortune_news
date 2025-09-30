import type { Locale } from './config';
import { getMessages } from './messages';

export const formatWithCount = (template: string, count: number): string => {
  return template.replace('{count}', String(count));
};

export const formatWithError = (template: string, error: string): string => {
  return template.replace('{error}', error);
};

export { getMessages };
export type { Locale };
