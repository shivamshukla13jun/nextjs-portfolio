import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { BlogDetailClient } from '@/components/views/clients';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await PortfolioRepository.getBlogBySlug(slug);
  return { title: blog ? `${blog.title} — Shivam Shukla` : 'Article — Shivam Shukla' };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await PortfolioRepository.getBlogBySlug(slug);
  if (!blog) notFound();
  return <BlogDetailClient blog={blog} />;
}
