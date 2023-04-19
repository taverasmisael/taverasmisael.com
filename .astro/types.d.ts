declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S | ((context: SchemaContext) => S);
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	const entryMap: {
		"posts": {
"es/10-consejos-que-yo-debería-seguir.mdx": {
  id: "es/10-consejos-que-yo-debería-seguir.mdx",
  slug: "es/10-consejos-que-yo-deberia-seguir",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/8-extensiones-esenciales-para-vscode.md": {
  id: "es/8-extensiones-esenciales-para-vscode.md",
  slug: "es/8-extensiones-esenciales-para-vscode",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/anunciando-mi-podcast.md": {
  id: "es/anunciando-mi-podcast.md",
  slug: "es/anunciando-mi-podcast",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/aprendiendo-a-aprender.mdx": {
  id: "es/aprendiendo-a-aprender.mdx",
  slug: "es/aprendiendo-a-aprender",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/caso-de-uso-nuevo-landing.mdx": {
  id: "es/caso-de-uso-nuevo-landing.mdx",
  slug: "es/caso-de-uso-nuevo-landing",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/domina-todos-los-bucles-for-en-que-hay-en-java-script.md": {
  id: "es/domina-todos-los-bucles-for-en-que-hay-en-java-script.md",
  slug: "es/domina-todos-los-bucles-for-en-que-hay-en-java-script",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/entendiendo-los-snapshots-de-jest.mdx": {
  id: "es/entendiendo-los-snapshots-de-jest.mdx",
  slug: "es/entendiendo-los-snapshots-de-jest",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/extensiones-y-temas-para-personalizar-vscode.md": {
  id: "es/extensiones-y-temas-para-personalizar-vscode.md",
  slug: "es/extensiones-y-temas-para-personalizar-vscode",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/github-no-es-suficiente-portafolio.md": {
  id: "es/github-no-es-suficiente-portafolio.md",
  slug: "es/github-no-es-suficiente-portafolio",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/hacktoberfest-ya-esta-aqui.md": {
  id: "es/hacktoberfest-ya-esta-aqui.md",
  slug: "es/hacktoberfest-ya-esta-aqui",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/introduccion-a-la-programacion-funcional.mdx": {
  id: "es/introduccion-a-la-programacion-funcional.mdx",
  slug: "es/introduccion-a-la-programacion-funcional",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/javascript-todo-lo-nuevo-desde-es6-hasta-hoy-parte-1.md": {
  id: "es/javascript-todo-lo-nuevo-desde-es6-hasta-hoy-parte-1.md",
  slug: "es/javascript-todo-lo-nuevo-desde-es6-hasta-hoy-parte-1",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/javascript-todo-lo-nuevo-desde-es6-hasta-hoy-parte-2.md": {
  id: "es/javascript-todo-lo-nuevo-desde-es6-hasta-hoy-parte-2.md",
  slug: "es/javascript-todo-lo-nuevo-desde-es6-hasta-hoy-parte-2",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/la-historia-detras-del-blog.mdx": {
  id: "es/la-historia-detras-del-blog.mdx",
  slug: "es/la-historia-detras-del-blog",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/lanzando-mi-pagina-hoy.md": {
  id: "es/lanzando-mi-pagina-hoy.md",
  slug: "es/lanzando-mi-pagina-hoy",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/lo-que-trae-es2020.mdx": {
  id: "es/lo-que-trae-es2020.mdx",
  slug: "es/lo-que-trae-es2020",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/mejorando-la-comunicacion.md": {
  id: "es/mejorando-la-comunicacion.md",
  slug: "es/mejorando-la-comunicacion",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/porque-utilizo-brave-como-mi-navegador.mdx": {
  id: "es/porque-utilizo-brave-como-mi-navegador.mdx",
  slug: "es/porque-utilizo-brave-como-mi-navegador",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/usar-map-filter-y-reduce-para-olvidarnos-de-los-bucles-for.mdx": {
  id: "es/usar-map-filter-y-reduce-para-olvidarnos-de-los-bucles-for.mdx",
  slug: "es/usar-map-filter-y-reduce-para-olvidarnos-de-los-bucles-for",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] },
"es/vence-el-sindrome-de-impostor.md": {
  id: "es/vence-el-sindrome-de-impostor.md",
  slug: "es/vence-el-sindrome-de-impostor",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
"es/viviendo-con-el-enemigo-en-cuarentena.md": {
  id: "es/viviendo-con-el-enemigo-en-cuarentena.md",
  slug: "es/viviendo-con-el-enemigo-en-cuarentena",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] },
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
