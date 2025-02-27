
export interface Article {
    urlToImage?: string;
    title: string;
    description: string;
    url: string;
  }
  

  export interface ArticlesResponse {
    articles: Article[];
  }

  export interface SourcesResponse {
    sources: Array<{
      language: string;
     
    }>;
  }
  
  export interface LanguageOption {
    code: string;
    name: string;
  }
  