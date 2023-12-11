import cheerio from'cheerio'
import {IHtmlParsingResult, IHtmlParsServices} from './htmlPars.type'
import puppeteer from 'puppeteer';

class HtmlParsServices implements IHtmlParsServices{
  async fetchHtml(url: string): Promise<string> {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url);

      // Get the HTML content after the page is loaded
      const htmlContent = await page.content();

      // Close the browser
      await browser.close();

      return htmlContent;
    } catch (error) {
      throw new Error('Error fetching HTML');
    }
  }

  parseHtml(html: string, customDescription?: string, customImageUrl?: string): IHtmlParsingResult {
    const $ = cheerio.load(html);

    const title = $('title').text();
    let description = $('meta[name="description"]').attr('content');
    let imageUrl = $('meta[property="og:image"]').attr('content');

    description = customDescription || description;
    imageUrl = customImageUrl || imageUrl;

    return { title, description, imageUrl };
  }
}

export default new HtmlParsServices();
