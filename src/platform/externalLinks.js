import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const LINKS = {
  privacy: 'https://www.taskbuddies.app/privacy',
  support: 'https://www.taskbuddies.app/support',
  lovou: 'https://www.lovou.app/?utm_source=taskbuddies&utm_medium=app',
  instagram: 'https://www.instagram.com/lovou.app/',
  tiktok: 'https://www.tiktok.com/@lovou.app',
};

const ALLOWED_HOSTS = new Set([
  'taskbuddies.app',
  'www.taskbuddies.app',
  'lovou.app',
  'www.lovou.app',
  'www.instagram.com',
  'www.tiktok.com',
  'buymeacoffee.com',
]);

export async function openExternalUrl(url) {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    throw new Error('External URL is not allowlisted');
  }

  if (Capacitor.isNativePlatform()) {
    await Browser.open({
      url: parsedUrl.toString(),
      presentationStyle: 'popover',
    });
    return;
  }

  window.open(parsedUrl.toString(), '_blank', 'noopener,noreferrer');
}
