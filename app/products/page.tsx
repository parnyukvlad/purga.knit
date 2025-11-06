import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createServerClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product-card'
import Link from 'next/link'

export const metadata = {
  title: 'Products',
  description: 'Browse our collection of handmade knitted items',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = await createServerClient()
  
  let query = supabase
    .from('purgaknit_items')
    .select(`
      *,
      purgaknit_categories(name, slug),
      purgaknit_sizes(name)
    `)
    .order('created_at', { ascending: false })

  if (searchParams.category) {
    query = query.eq('purgaknit_categories.slug', searchParams.category)
  }

  const { data: items } = await query
  const { data: categories } = await supabase
    .from('purgaknit_categories')
    .select('*')
    .order('name')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
          
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !searchParams.category
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </Link>
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchParams.category === category.slug
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Products Grid - Optimized for vertical images */}
          {items && items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item: any) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

