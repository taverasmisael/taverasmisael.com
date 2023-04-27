import type {AstroBuiltinAttributes} from 'astro'
export interface DefaultLayoutProps {
  title: string;
  lang?: string;
  description: string;
  class?: string;
  "class:list"?: AstroBuiltinAttributes['class:list'];
  fullHeight?: boolean;
}
