
import axios from 'axios';
import { ArticlesResponse, LanguageOption, SourcesResponse } from './types';
import { languageMap } from './languageMap';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';


export const fetchNews = async (query: string, language: string): Promise<ArticlesResponse> => {
  const response = await axios.get<ArticlesResponse>(`${BASE_URL}/everything`, {
    params: {
      q: query || 'breaking-news',
      language,
      apiKey: API_KEY,
    },
  });
  return response.data;
};


export const fetchLanguages = async (): Promise<LanguageOption[]> => {
    const response = await axios.get<SourcesResponse>(`${BASE_URL}/top-headlines/sources`, {
      params: { apiKey: API_KEY },
    });
    const languageCodes = [...new Set(response.data.sources.map(source => source.language))];
    return languageCodes.map(code => ({
      code,
      name: languageMap[code] || code 
    }));
  };