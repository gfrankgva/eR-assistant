# Guide d'intégration pour le chatbot eRegulations dans Lovable

Ce guide détaille les étapes nécessaires pour intégrer les améliorations du backend dans votre projet Lovable existant. Il est conçu pour les développeurs qui maintiennent le prototype Lovable et souhaitent y incorporer les fonctionnalités améliorées tout en conservant l'interface utilisateur existante.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Structure des fichiers](#structure-des-fichiers)
4. [Intégration des services](#intégration-des-services)
5. [Configuration multi-sites](#configuration-multi-sites)
6. [Support multilingue](#support-multilingue)
7. [Gestion des clés API](#gestion-des-clés-api)
8. [Tests et débogage](#tests-et-débogage)
9. [Maintenance et mises à jour](#maintenance-et-mises-à-jour)

## Vue d'ensemble

L'intégration consiste à remplacer ou améliorer certains services backend de votre prototype Lovable tout en conservant l'interface utilisateur existante. Les principales améliorations concernent :

1. **Abstraction API** : Une couche d'adaptation pour différentes structures d'API eRegulations
2. **Support multilingue** : Gestion améliorée des traductions et du contenu multilingue
3. **Base de connaissances** : Stockage et récupération efficaces des informations sur les procédures
4. **Gestion du contexte** : Suivi amélioré du contexte des conversations
5. **Intégration LLM** : Configuration flexible pour différents modèles de langage

## Prérequis

- Accès au code source du projet Lovable
- Node.js 14+ et npm
- Connaissance de TypeScript et React
- Clés API pour les services LLM (Claude, OpenAI, etc.)
- Accès aux API eRegulations (Tanzania Trade Portal ou autres)

## Structure des fichiers

Voici les fichiers principaux à intégrer dans votre projet Lovable :

```
src/
├── services/
│   ├── apiKeyService.ts       # Gestion sécurisée des clés API
│   ├── chatbotService.ts      # Service principal du chatbot
│   ├── knowledgeBaseService.ts # Gestion de la base de connaissances
│   ├── languageService.ts     # Support multilingue
│   └── anthropic/
│       └── anthropicService.ts # Service d'intégration Claude
├── utils/
│   └── api/
│       ├── apiAdapter.ts      # Couche d'abstraction API
│       ├── fetchUtils.ts      # Utilitaires pour les requêtes API
│       └── swaggerUtils.ts    # Utilitaires pour l'analyse Swagger
```

## Intégration des services

### 1. Service API Adapter

Le fichier `apiAdapter.ts` est le cœur de l'intégration multi-sites. Il fournit une interface unifiée pour interagir avec différentes API eRegulations.

Intégrez ce fichier dans votre projet :

```typescript
// src/utils/api/apiAdapter.ts

import { fetchWithTimeout } from './fetchUtils';

export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    searchProcedures: string;
    getProcedureDetails: string;
    getRequirements: string;
    // Autres endpoints spécifiques au site
  };
  headers?: Record<string, string>;
  timeout?: number;
}

export class ApiAdapter {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async searchProcedures(keyword: string, language?: string): Promise<any> {
    const url = `${this.config.baseUrl}${this.config.endpoints.searchProcedures}`;
    const params = { keyword, language };
    
    return this.makeRequest(url, 'POST', params);
  }

  async getProcedureDetails(id: string, language?: string): Promise<any> {
    const url = `${this.config.baseUrl}${this.config.endpoints.getProcedureDetails.replace('{id}', id)}`;
    const params = { language };
    
    return this.makeRequest(url, 'GET', params);
  }

  async getRequirements(type: string, language?: string): Promise<any> {
    const url = `${this.config.baseUrl}${this.config.endpoints.getRequirements}`;
    const params = { type, language };
    
    return this.makeRequest(url, 'GET', params);
  }

  private async makeRequest(url: string, method: string, params: any): Promise<any> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...this.config.headers
        },
        timeout: this.config.timeout || 10000
      };

      if (method === 'POST') {
        options.body = JSON.stringify(params);
      } else if (method === 'GET' && params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
        url = `${url}?${queryParams.toString()}`;
      }

      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// Configurations prédéfinies pour différents sites eRegulations
export const apiConfigs: Record<string, ApiConfig> = {
  tanzania: {
    baseUrl: 'https://api-tanzania.tradeportal.org',
    endpoints: {
      searchProcedures: '/Objectives/Search',
      getProcedureDetails: '/Procedures/{id}',
      getRequirements: '/Requirements'
    },
    timeout: 15000
  },
  // Ajoutez d'autres configurations de site ici
};

// Fonction utilitaire pour créer un adaptateur API pour un site spécifique
export function createApiAdapter(site: string): ApiAdapter {
  const config = apiConfigs[site];
  if (!config) {
    throw new Error(`No API configuration found for site: ${site}`);
  }
  return new ApiAdapter(config);
}
```

### 2. Service de support multilingue

Intégrez le service de gestion des langues :

```typescript
// src/services/languageService.ts

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'ar';

interface TranslationTemplates {
  [key: string]: {
    [language in SupportedLanguage]?: string;
  };
}

export class LanguageService {
  private currentLanguage: SupportedLanguage = 'en';
  private templates: TranslationTemplates = {};
  private externalTranslationEnabled: boolean = false;
  private translationApiKey: string | null = null;

  constructor(initialLanguage: SupportedLanguage = 'en') {
    this.currentLanguage = initialLanguage;
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Templates de base pour les messages courants
    this.templates = {
      welcome: {
        en: 'Welcome to the eRegulations Assistant! How can I help you today?',
        fr: 'Bienvenue sur l\'Assistant eRegulations ! Comment puis-je vous aider aujourd\'hui ?',
        es: '¡Bienvenido al Asistente de eRegulations! ¿Cómo puedo ayudarte hoy?',
        ar: 'مرحبًا بك في مساعد eRegulations! كيف يمكنني مساعدتك اليوم؟'
      },
      procedure_found: {
        en: 'I found {count} procedures related to "{keyword}":',
        fr: 'J\'ai trouvé {count} procédures liées à "{keyword}" :',
        es: 'Encontré {count} procedimientos relacionados con "{keyword}":',
        ar: 'وجدت {count} إجراءات متعلقة بـ "{keyword}":'
      },
      // Ajoutez d'autres templates selon les besoins
    };
  }

  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public getTemplate(key: string, params: Record<string, string | number> = {}): string {
    const template = this.templates[key]?.[this.currentLanguage] || key;
    
    // Remplacer les paramètres
    return template.replace(/\{(\w+)\}/g, (_, paramName) => {
      return String(params[paramName] ?? `{${paramName}}`);
    });
  }

  public async translateText(text: string, targetLanguage?: SupportedLanguage): Promise<string> {
    const language = targetLanguage || this.currentLanguage;
    
    // Si la langue cible est l'anglais ou si la traduction externe n'est pas activée, retourner le texte tel quel
    if (language === 'en' || !this.externalTranslationEnabled || !this.translationApiKey) {
      return text;
    }
    
    try {
      // Implémentez ici l'intégration avec un service de traduction externe
      // Exemple avec un service de traduction fictif
      const response = await fetch('https://api.translation-service.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.translationApiKey}`
        },
        body: JSON.stringify({
          text,
          source_language: 'en',
          target_language: language
        })
      });
      
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.translated_text;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // En cas d'échec, retourner le texte original
    }
  }

  public enableExternalTranslation(apiKey: string): void {
    this.externalTranslationEnabled = true;
    this.translationApiKey = apiKey;
  }

  public disableExternalTranslation(): void {
    this.externalTranslationEnabled = false;
    this.translationApiKey = null;
  }

  public addTemplate(key: string, translations: Partial<Record<SupportedLanguage, string>>): void {
    if (!this.templates[key]) {
      this.templates[key] = {};
    }
    
    Object.entries(translations).forEach(([lang, text]) => {
      const language = lang as SupportedLanguage;
      this.templates[key][language] = text;
    });
  }
}

// Singleton pour un accès facile au service
export const languageService = new LanguageService();
```

### 3. Service de base de connaissances

Intégrez le service de gestion de la base de connaissances :

```typescript
// src/services/knowledgeBaseService.ts

import { ApiAdapter } from '../utils/api/apiAdapter';
import { languageService, SupportedLanguage } from './languageService';

interface KnowledgeItem {
  id: string;
  type: 'procedure' | 'requirement' | 'topic';
  title: string;
  content: string;
  metadata: Record<string, any>;
  lastUpdated: Date;
  language: SupportedLanguage;
}

export class KnowledgeBaseService {
  private items: KnowledgeItem[] = [];
  private apiAdapter: ApiAdapter | null = null;
  private storageKey = 'eregulations_knowledge_base';

  constructor(apiAdapter?: ApiAdapter) {
    this.apiAdapter = apiAdapter || null;
    this.loadFromLocalStorage();
  }

  public setApiAdapter(apiAdapter: ApiAdapter): void {
    this.apiAdapter = apiAdapter;
  }

  private loadFromLocalStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.items = parsedData.map((item: any) => ({
          ...item,
          lastUpdated: new Date(item.lastUpdated)
        }));
      }
    } catch (error) {
      console.error('Failed to load knowledge base from local storage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Failed to save knowledge base to local storage:', error);
    }
  }

  public addItem(item: Omit<KnowledgeItem, 'lastUpdated'>): string {
    const newItem: KnowledgeItem = {
      ...item,
      lastUpdated: new Date()
    };
    
    this.items.push(newItem);
    this.saveToLocalStorage();
    
    return newItem.id;
  }

  public getItem(id: string, language?: SupportedLanguage): KnowledgeItem | null {
    const currentLanguage = language || languageService.getCurrentLanguage();
    
    // Rechercher d'abord dans la langue spécifiée
    let item = this.items.find(item => item.id === id && item.language === currentLanguage);
    
    // Si non trouvé, chercher en anglais comme fallback
    if (!item && currentLanguage !== 'en') {
      item = this.items.find(item => item.id === id && item.language === 'en');
    }
    
    return item || null;
  }

  public async searchItems(query: string, type?: string, language?: SupportedLanguage): Promise<KnowledgeItem[]> {
    const currentLanguage = language || languageService.getCurrentLanguage();
    const searchTerms = query.toLowerCase().split(' ');
    
    // Rechercher dans la base de connaissances locale
    const localResults = this.items.filter(item => {
      // Filtrer par type si spécifié
      if (type && item.type !== type) {
        return false;
      }
      
      // Filtrer par langue
      if (item.language !== currentLanguage && item.language !== 'en') {
        return false;
      }
      
      // Rechercher les termes dans le titre et le contenu
      return searchTerms.some(term => 
        item.title.toLowerCase().includes(term) || 
        item.content.toLowerCase().includes(term)
      );
    });
    
    // Si l'adaptateur API est disponible et qu'il n'y a pas assez de résultats locaux,
    // essayer de récupérer des données supplémentaires de l'API
    if (this.apiAdapter && localResults.length < 3) {
      try {
        // Rechercher des procédures via l'API
        const apiResults = await this.apiAdapter.searchProcedures(query, currentLanguage);
        
        if (apiResults && Array.isArray(apiResults)) {
          // Convertir les résultats de l'API en éléments de connaissance et les ajouter à la base locale
          for (const result of apiResults) {
            const newItem: Omit<KnowledgeItem, 'lastUpdated'> = {
              id: `procedure-${result.id}`,
              type: 'procedure',
              title: result.title || 'Unknown Procedure',
              content: result.description || '',
              metadata: result,
              language: currentLanguage
            };
            
            // Ajouter à la base de connaissances locale pour une utilisation future
            this.addItem(newItem);
          }
          
          // Refaire la recherche locale pour inclure les nouveaux éléments
          return this.searchItems(query, type, language);
        }
      } catch (error) {
        console.error('Failed to fetch additional knowledge from API:', error);
      }
    }
    
    return localResults;
  }

  public updateItem(id: string, updates: Partial<Omit<KnowledgeItem, 'id' | 'lastUpdated'>>): boolean {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.items[index] = {
      ...this.items[index],
      ...updates,
      lastUpdated: new Date()
    };
    
    this.saveToLocalStorage();
    return true;
  }

  public deleteItem(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    
    if (this.items.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }

  public async fetchAndStoreDetails(id: string, language?: SupportedLanguage): Promise<KnowledgeItem | null> {
    if (!this.apiAdapter) {
      return null;
    }
    
    const currentLanguage = language || languageService.getCurrentLanguage();
    
    try {
      // Récupérer les détails de la procédure via l'API
      const details = await this.apiAdapter.getProcedureDetails(id, currentLanguage);
      
      if (details) {
        const newItem: Omit<KnowledgeItem, 'lastUpdated'> = {
          id: `procedure-${id}`,
          type: 'procedure',
          title: details.title || 'Unknown Procedure',
          content: details.description || '',
          metadata: details,
          language: currentLanguage
        };
        
        // Ajouter à la base de connaissances locale
        this.addItem(newItem);
        
        return this.getItem(`procedure-${id}`, currentLanguage);
      }
    } catch (error) {
      console.error(`Failed to fetch details for 
(Content truncated due to size limit. Use line ranges to read in chunks)