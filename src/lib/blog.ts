import fs from 'fs';
import path from 'path';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date?: string;
  description?: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Simple extraction of title from the first # header if no frontmatter
      const titleMatch = fileContents.match(/^#\s+(.*)/m);
      const title = titleMatch ? titleMatch[1] : slug;

      return {
        slug,
        title,
        content: fileContents,
      };
    });

  return allPostsData;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(blogDirectory, `${decodedSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const titleMatch = fileContents.match(/^#\s+(.*)/m);
  const title = titleMatch ? titleMatch[1] : decodedSlug;

  return {
    slug: decodedSlug,
    title,
    content: fileContents,
  };
}
