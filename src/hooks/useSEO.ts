import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOData {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots_directives?: string;
}

export const useSEO = (pagePath: string) => {
  useEffect(() => {
    const loadSEOSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page_path', pagePath)
          .eq('is_active', true)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading SEO settings:', error);
          return;
        }

        if (data) {
          updateSEOTags(data);
        }
      } catch (error) {
        console.error('Error in loadSEOSettings:', error);
      }
    };

    loadSEOSettings();
  }, [pagePath]);
};

const updateSEOTags = (seoData: SEOData) => {
  // Update document title
  if (seoData.meta_title) {
    document.title = seoData.meta_title;
  }

  // Update meta description
  updateMetaTag('description', seoData.meta_description);
  
  // Update meta keywords
  updateMetaTag('keywords', seoData.meta_keywords);
  
  // Update robots directives
  updateMetaTag('robots', seoData.robots_directives);
  
  // Update Open Graph tags
  updateMetaProperty('og:title', seoData.og_title);
  updateMetaProperty('og:description', seoData.og_description);
  updateMetaProperty('og:image', seoData.og_image);
  
  // Update canonical URL
  updateCanonicalLink(seoData.canonical_url);

  // Update Schema Markup
  updateSchemaMarkup(seoData.schema_markup);
};

const updateMetaTag = (name: string, content?: string) => {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaProperty = (property: string, content?: string) => {
  if (!content) return;
  
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateCanonicalLink = (href?: string) => {
  if (!href) return;
  
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
};

const updateSchemaMarkup = (schemaMarkup?: any) => {
  if (!schemaMarkup) {
    // If schemaMarkup is explicitly null or undefined, remove any existing schema script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }
    return;
  }

  let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  try {
    if (typeof schemaMarkup === 'string') {
      // Validate if it's a JSON string by parsing
      JSON.parse(schemaMarkup); // This will throw an error if invalid JSON
      script.textContent = schemaMarkup;
    } else if (typeof schemaMarkup === 'object') {
      script.textContent = JSON.stringify(schemaMarkup);
    } else {
      console.error('Schema markup is not a valid type (string or object).');
      if (script.parentNode) { // Clean up by removing the script if type is invalid
        script.parentNode.removeChild(script);
      }
    }
  } catch (error) {
    console.error('Error processing schema markup:', error);
    // Clean up by removing the script if JSON is invalid
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  }
};