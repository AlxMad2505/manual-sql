import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/blog';
import BlogContent from '@/components/BlogContent';
import Header from '@/components/Header';

export default async function Home() {
  
  const slug = "JOINs y GROUPS";
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      
      <div className="flex-grow">
        <BlogContent 
          markdownContent={post.content} 
          title=""
          description="" 
        />
      </div>
      
      {/* Footer solicitado */}
      <footer className="bg-blue-900 border-t border-blue-999 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center uppercase tracking-widest gap-4 text-sm font-medium text-white">
            <div className="md:w-1/3 text-left">
              Escrito por Alejandro Madrigal Urencio
            </div>
            <div className="md:w-1/3 text-center uppercase tracking-widest border-x border-blue-999 px-4">
              Bases de Datos 1
            </div>
            <div className="md:w-1/3 text-right">
              Profesor Omar Mendoza González
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
