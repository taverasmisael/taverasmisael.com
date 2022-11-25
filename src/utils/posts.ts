import { basename } from 'path'
import type { AstroComponent } from 'astro/dist/runtime/server/render/astro'
import { pipe, filter, sort } from 'rambda'

type PostSlug = string
type PostURL = string
type PostPath = string
type Markdown = string
type CompiledMD = string
type DataSlug = string
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingInfo {
  depth: HeadingLevel
  slug: DataSlug
  text: string
}

interface BasePostFile {
  frontmatter: PostFrontmatter
  file: PostPath
  url: PostURL
  compiledContent: () => CompiledMD
  getHeadings: () => HeadingInfo[]
  Content: AstroComponent
}

interface MDXPostFile extends BasePostFile {
  rawContent: never
}

interface MarkdownPostFile extends BasePostFile {
  rawContent: () => Markdown
}

type PostFile = MarkdownPostFile | MDXPostFile

interface PostFrontmatter {
  title: string
  date: string
  draft?: boolean
  description: string
  author: string
  tags: string[]
  banner: string
}

export interface BasicPost {
  slug: PostSlug
  author: string
  banner: string
  excerpt: string
  isMDX: boolean
  tags: string[]
  title: string
  publishDate: Date
}

export async function getPosts() {
  const files: Record<string, PostFile> = import.meta.glob(
    ['../../content/posts/**/*.md', '../../content/posts/**/*.mdx'],
    { eager: true }
  )

  const preparePostFiles: (posts: Record<string, PostFile>) => BasicPost[] =
    pipe(
      Object.values,
      filter((f) => !f.frontmatter.draft),
      normalizePostFiles,
      sort((a, b) => a.publishDate.valueOf() - b.publishDate.valueOf())
    )

  return preparePostFiles(files)
}

const isMDXFile = (file: PostFile): file is MDXPostFile =>
  file.file.includes('.mdx')

function normalizePostFiles(files: PostFile[]): BasicPost[] {
  return files.map((file) => ({
    slug: basename(file.file).split('.')[0],
    author: file.frontmatter.author,
    banner: file.frontmatter.banner,
    excerpt: file.frontmatter.description,
    isMDX: isMDXFile(file),
    tags: file.frontmatter.tags,
    title: file.frontmatter.title,
    publishDate: new Date(file.frontmatter.date),
  }))
}
