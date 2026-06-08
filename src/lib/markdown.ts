import fs from 'fs';
import path from 'path';

export function getPostBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent;
}