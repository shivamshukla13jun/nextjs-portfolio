import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { BlogClient } from '@/components/views/clients';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const blogs = await PortfolioRepository.getBlogs(true);
  return <BlogClient blogs={blogs || []} />;
}
