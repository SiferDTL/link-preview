import HtmlParsServices from '../services/htmlPars/htmlPars.services'
import axios from 'axios'
import { Request, Response } from 'express';

export const PrevLinkCtr = {
  getPrevLink: async (req: Request, res: Response) => {
    const { urls } = req.query;

    const arrayUrls = JSON.parse(urls as string);
    const promises = arrayUrls.map(async (url: string) => {
      try {
      const html = await HtmlParsServices.fetchHtml(url);
      const previewData = HtmlParsServices.parseHtml(html);
        return previewData;
      } catch (error:any) {
        console.error('Error fetching link preview:', error.message);
        throw new Error('Error fetching link preview');
      }
    });

    try {
      const previewDataArray = await Promise.all(promises);
      return res.status(200).json({
        status: 'success',
        code: 200,
        previewData: previewDataArray,
      });
    } catch (error:any) {
      console.error('Error fetching link preview:', error.message);
      return res.status(500).send('Error fetching link preview');
    }
  },

  getMedia: async (req: Request, res: Response) => {
    const imageUrl = req.query.url;

    try {
      const response = await axios.get(imageUrl as string, { responseType: 'stream' });
      res.setHeader('Content-Type', response.headers['content-type']);
      return response.data.pipe(res);
    } catch (error:any) {
      console.error('Error fetching image:', error.message);
      res.status(500).send('Error fetching image');
    }
  },
};
