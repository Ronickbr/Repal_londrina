import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, Grid2x2, List } from 'lucide-react'
import { useCategories, useSubcategoriesByCategory } from '../hooks/useCategories'
import { useProductsByCategory } from '../hooks/useProducts'
import type { ProductWithCategory } from '../types/product'
import ProductCard from '../components/ProductCard'
import { useAccessibility } from '../hooks/useAccessibility'

type ViewMode = 'grid' | 'list'

const CategoryProducts: React.FC = () => {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [viewMode, setViewMode] = useState<ViewMode>((searchParams.get('view') as ViewMode) || 'grid')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(12)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(() => {
    const fromQuery = searchParams.get('sub')
    return fromQuery ? fromQuery.split(',').filter(Boolean) : []
  })
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(categorySlug || '')

  const { trapFocus } = useAccessibility()
  const modalRef = useRef<HTMLDivElement | null>(null)

  const { data: categories } = useCategories()

  const { data: categoryProducts = [], isLoading } = useProductsByCategory(selectedCategorySlug || '')

  const { data: subcategories = [] } = useSubcategoriesByCategory(
    useMemo(() => {
      const found = categories?.find(c => c.slug === (selectedCategorySlug || ''))
      return found?.id || ''
    }, [categories, selectedCategorySlug])
  )

  useEffect(() => {
    if (isFilterModalOpen && modalRef.current) trapFocus(modalRef.current)
  }, [isFilterModalOpen, trapFocus])

  useEffect(() => {
    setSelectedCategorySlug(categorySlug || '')
  }, [categorySlug])

  useEffect(() => {
    const params: Record<string, string> = {}
    if (searchTerm) params.q = searchTerm
    if (sortBy) params.sort = sortBy
    if (viewMode) params.view = viewMode
    if (selectedSubcategories.length > 0) params.sub = selectedSubcategories.join(',')
    setSearchParams(params, { replace: true })
  }, [searchTerm, sortBy, viewMode, selectedSubcategories, setSearchParams])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedSubcategories, sortBy, pageSize])

  useEffect(() => {
    const fromQuery = searchParams.get('sub')
    const next = fromQuery ? fromQuery.split(',').filter(Boolean) : []
    setSelectedSubcategories(next)
    setCurrentPage(1)
  }, [searchParams])



  const subcategoryCounts = useMemo(() => {
    const map = new Map<string, number>()
    categoryProducts.forEach(p => {
      const id = String(p.subcategory?.id || p.subcategory_id || '')
      if (!id) return
      map.set(id, (map.get(id) || 0) + 1)
    })
    return map
  }, [categoryProducts])

  const filteredProducts: ProductWithCategory[] = useMemo(() => {
    let base = categoryProducts
    if (selectedSubcategories.length > 0) {
      const setVals = new Set(selectedSubcategories.map(s => String(s).trim()))
      base = base.filter(p => {
        const sid = String(p.subcategory?.id || p.subcategory_id || '')
        const sslug = String(p.subcategory?.slug || '')
        return (sid && setVals.has(sid)) || (sslug && setVals.has(sslug))
      })
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      base = base.filter(p => (p.name || '').toLowerCase().includes(q))
    }
    if (sortBy === 'name') {
      base = [...base].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortBy === 'recent') {
      base = [...base].sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
    }
    return base
  }, [categoryProducts, selectedSubcategories, searchTerm, sortBy])

  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const currentCategory = useMemo(() => categories?.find(c => c.slug === (selectedCategorySlug || '')) || null, [categories, selectedCategorySlug])
  const currentSubcategory = useMemo(() => {
    if (selectedSubcategories.length === 0) return null
    const first = selectedSubcategories[0]
    return subcategories.find(s => String(s.id) === String(first) || String(s.slug) === String(first)) || null
  }, [subcategories, selectedSubcategories])

  const handleCategoryChange = (slug: string) => {
    if (!slug) return
    setSelectedCategorySlug(slug)
    setSelectedSubcategories([])
    navigate(`/categorias/${slug}`)
    setCurrentPage(1)
  }

  const handleSubcategoryToggle = (id: string) => {
    setSelectedSubcategories(prev => {
      const sub = subcategories.find(s => String(s.id) === String(id))
      const slug = sub?.slug ? String(sub.slug) : ''
      const set = new Set(prev)
      const isChecked = set.has(id) || (slug ? set.has(slug) : false)
      if (isChecked) {
        set.delete(id)
        if (slug) set.delete(slug)
      } else {
        if (slug) {
          set.add(slug)
          set.delete(id)
        } else {
          set.add(id)
        }
      }
      return Array.from(set)
    })
  }

  const applyFilters = () => {
    setIsFilterModalOpen(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSubcategories([])
    setSortBy('name')
    setViewMode('grid')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* breadcrumb mockup */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2 sm:pb-0" aria-label="breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors duration-200">Início</Link>
            <span className="text-gray-300">/</span>
            <Link to="/categorias" className="hover:text-primary transition-colors duration-200">Categorias</Link>
            {currentCategory && (
              <>
                <span className="text-gray-300">/</span>
                <Link to={`/categorias/${currentCategory.slug}`} className={`hover:text-primary transition-colors duration-200 ${!currentSubcategory ? 'font-bold text-gray-900' : ''}`}>
                  {currentCategory.name}
                </Link>
              </>
            )}
            {currentSubcategory && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-primary font-bold">{currentSubcategory.name}</span>
              </>
            )}
            {searchTerm && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-800">Busca: "{searchTerm}"</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">
              {currentSubcategory ? currentSubcategory.name : (currentCategory ? currentCategory.name : 'Produtos')}
            </h1>
            <p className="text-gray-500">
              {totalItems} {totalItems === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                aria-label="Visualização em grade"
              >
                <Grid2x2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                aria-label="Visualização em lista"
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm"
            >
              <option value="name">Ordem Alfabética (A-Z)</option>
              <option value="recent">Mais Recentes</option>
            </select>

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="lg:col-span-1 hidden lg:block space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-gray-900 text-lg">Filtros</h3>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Nome do produto..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        x
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Categoria Principal</label>
                  <select
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    value={selectedCategorySlug}
                    onChange={e => handleCategoryChange(e.target.value)}
                  >
                    <option value="">Todas as Categorias</option>
                    {categories?.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategories */}
                {subcategories.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Subcategorias</label>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {subcategories.map(sub => {
                        const id = String(sub.id)
                        const isChecked = selectedSubcategories.includes(id) || selectedSubcategories.includes(String(sub.slug))
                        const count = subcategoryCounts.get(String(sub.id)) || 0
                        return (
                          <label key={sub.id} className="flex items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                              checked={isChecked}
                              onChange={() => handleSubcategoryToggle(id)}
                            />
                            <span className={`ml-3 text-sm flex-1 ${isChecked ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                              {sub.name}
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <button
                    onClick={applyFilters}
                    className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition-all"
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 hover:text-gray-800 transition-all"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* Pagination Top & Page Size - Optional */}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: pageSize }).map((_, i) => (
                  <div key={i} className="h-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse p-4">
                    <div className="bg-gray-200 h-48 w-full rounded-xl mb-4"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
                    <div className="bg-gray-200 h-10 w-full rounded mt-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} onViewDetails={(p) => navigate(`/produto/${p.slug || p.id}`)} />
                  ))}
                </div>

                {paginatedProducts.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                    <p className="text-gray-500 mb-6">Tente ajustar seus filtros ou buscar por outro termo.</p>
                    <button onClick={clearFilters} className="text-primary font-bold hover:underline">
                      Limpar todos os filtros
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Pagination Bottom */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-primary'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Simple logic for showing pages around current
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (currentPage > 3) pageNum = currentPage - 2 + i;
                        if (currentPage > totalPages - 2) pageNum = totalPages - 4 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-primary'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
            <div ref={modalRef} className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">Filtros</span>
                </div>
                <button onClick={() => setIsFilterModalOpen(false)} className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">Fechar</button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="m-category-select" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select id="m-category-select" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={categorySlug || ''} onChange={e => handleCategoryChange(e.target.value)}>
                    <option value="">Selecione</option>
                    {categories?.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div role="group" aria-labelledby="m-subcat-label">
                  <div id="m-subcat-label" className="text-sm font-medium text-gray-700 mb-2">Subcategorias</div>
                  <div className="space-y-2 max-h-64 overflow-auto pr-1">
                    {subcategories.map(sub => {
                      const id = String(sub.id)
                      const isChecked = selectedSubcategories.includes(id) || selectedSubcategories.includes(sub.slug)
                      const count = subcategoryCounts.get(String(sub.id)) || 0
                      return (
                        <label key={sub.id} className="flex items-center justify-between gap-2 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={isChecked} onChange={() => handleSubcategoryToggle(id)} />
                            <span className="text-sm text-gray-700">{sub.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{count}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label htmlFor="m-search" className="block text-sm font-medium text-gray-700 mb-1">Busca</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input id="m-search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar produto" className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Limpar</button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={applyFilters} className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Aplicar Filtros</button>
                  <button onClick={clearFilters} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Limpar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryProducts

