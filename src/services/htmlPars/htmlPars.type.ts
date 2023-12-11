
export interface IHtmlParsingResult {
  title: string;
  description: string | undefined;
  imageUrl: string | undefined;
}

export interface IHtmlParsServices {
  fetchHtml(url: string): Promise<string>;
  parseHtml(html: string, customDescription?: string, customImageUrl?: string): IHtmlParsingResult;
}