import { request } from 'http';
import type { URL } from 'url';
import cookie, { CookieParseOptions } from 'cookie';
import formUrlEncoded from 'form-urlencoded';
import flatCache from 'flat-cache';

const CACHE_ID = 'legendas.tv-auth';
const CACHE_PATH = '/tmp/subtitle-finder/cache';

export interface Cookie extends Omit<CookieParseOptions, 'encode'> {
  name: string;
  value: string;
}

export default async function authenticate(
  url: URL,
  username: string,
  password: string
): Promise<Cookie[]> {
  const cache = flatCache.load(CACHE_ID, CACHE_PATH);
  const cookies = cache.getKey('cookies');

  if (cookies) return cookies;

  return new Promise((resolve, reject) => {
    const req = request(
      {
        method: 'POST',
        protocol: 'http:',
        host: url.host,
        path: '/login',
        port: '80',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      async res => {
        const cookies = res.headers['set-cookie']?.map(raw => {
          const parsedCookie = cookie.parse(raw);

          const {
            url,
            domain,
            path,
            expires,
            httpOnly,
            secure,
            sameSite,
            ...session
          } = parsedCookie;

          const name = Object.getOwnPropertyNames(session)[0];
          const value = session[name];

          return {
            name,
            value,
            url,
            secure,
            domain,
            path,
            expires,
            httpOnly,
            sameSite,
          };
        });

        if (!cookies) return reject();

        cache.setKey('cookies', cookies);
        resolve(cookies);
      }
    );

    const body = {
      _method: 'POST',
      'data[User][username]': username,
      'data[User][password]': password,
    };
    const postData = formUrlEncoded(body);
    req.on('error', reject);
    req.end(postData);
  });
}
