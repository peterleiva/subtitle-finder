import { ElementHandle } from 'puppeteer';
import type { Subtitle, Scraper } from '../types';

export default function createScraper(): Scraper<Subtitle> {
  return async function scraper(handle: ElementHandle): Promise<Subtitle> {
    const titleNode = await handle.$('a[href^="/download"]');
    const uploaderNode = await handle.$('a[href^="/usuario"]');
    const dataNode = await handle.$('.data');

    const title = await titleNode?.evaluate(node => node.innerHTML);
    const uploader = await uploaderNode?.evaluate(node => node.innerHTML);
    const source = await titleNode?.evaluate(
      node => (node as HTMLAnchorElement).href
    );

    const data = await dataNode?.evaluate(node => {
      const downloadNode = node.firstChild?.textContent?.match(/^\d+/);
      const dateNode = node.lastChild?.textContent?.match(
        /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})/
      );

      const downloads = Number(downloadNode?.[0]);
      let date: Date | undefined;

      if (dateNode) {
        const [, day, month, year, hour, minutes] = dateNode;

        // the extracted zone is in Brasilia Standard Time, that's why the -03
        date = new Date(`${year}-${month}-${day}T${hour}:${minutes}-03:00`);
      }

      const releasedAt = date?.toISOString();

      return {
        releasedAt,
        downloads,
      };
    });

    const match = source?.match(/(.*)\/download\/(\w+)\//);

    if (!source || !match || match.length === 0) {
      throw new Error(`Failed to get subtitle source: ${handle}`);
    }

    const [, base, id] = match;
    const fileUrl = '' + new URL(`downloadarquivo/${id}`, base);

    let releasedAt: Date | undefined;
    const downloads = data?.downloads;

    if (data?.releasedAt && data.releasedAt !== '') {
      releasedAt = new Date(data.releasedAt);
    }

    if (!(title && source)) {
      throw new Error(
        `Coulnd't parse title or source from subtitle: ${handle}`
      );
    }

    return {
      id,
      title,
      source,
      uploader,
      downloads,
      language: 'Português Brasileiro',
      releasedAt,
      provider: 'legendas.tv',
    };
  };
}
