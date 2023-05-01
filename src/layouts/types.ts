import type { Language } from '@/i18n';
import type {AstroBuiltinAttributes} from 'astro'
export interface DefaultLayoutProps {
  title: string;
  canonical: string;
  lang?: Language;
  description: string;
  class?: string;
  "class:list"?: AstroBuiltinAttributes['class:list'];
  fullHeight?: boolean;
}
