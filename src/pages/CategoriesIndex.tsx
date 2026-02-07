import React from 'react'
import { Link } from 'react-router-dom'
import { useSubcategories } from '../hooks/useSubcategories'
import type { CategoryWithSubcategories } from '../hooks/useSubcategories'
import { ChevronRight, Beef, Snowflake, ChefHat, Utensils, Package, Wrench, UtensilsCrossed } from 'lucide-react'

const CategoriesIndex: React.FC = () => {
  const { data, isLoading, isError, error } = useSubcategories()

  const categories: CategoryWithSubcategories[] = (data || []) as CategoryWithSubcategories[]

  const getIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('açougue')) return Beef
    if (n.includes('refrigeração')) return Snowflake
    if (n.includes('padaria') || n.includes('confeitaria')) return ChefHat
    if (n.includes('bar') || n.includes('restaurante')) return Utensils
    if (n.includes('mobiliário')) return Package
    if (n.includes('peças')) return Wrench
    return UtensilsCrossed
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8B0000' }} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar categorias</h1>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'Tente novamente mais tarde.'}</p>
          <Link to="/" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">Voltar para início</Link>
        </div>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Link to="/" className="hover:text-red-700">Início</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-800 font-medium">Categorias</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
              <p className="text-gray-600">Nenhuma categoria disponível no momento.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">Voltar para início</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <div className="bg-secondary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="flex items-center justify-center space-x-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">Categorias</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nossas <span className="text-primary">Categorias</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Explore nossa linha completa de equipamentos profissionais organizados por setor.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = getIcon(category.name)
            return (
              <Link
                to={`/categorias/${category.slug}`}
                key={category.id}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/20 flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon className="w-24 h-24 text-primary transform group-hover:rotate-12 transition-transform duration-500" />
                </div>

                <div className="p-8 flex-1 flex flex-col relative z-10">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h2 className="text-2xl font-bold text-secondary group-hover:text-primary transition-colors mb-3">
                    {category.name}
                  </h2>

                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full group-hover:bg-red-50 group-hover:text-primary transition-colors">
                      {category.subcategories?.length || 0} Subcategorias
                    </span>
                  </div>

                  <div className="space-y-2 mb-8 flex-1">
                    {category.subcategories?.slice(0, 4).map((sub) => (
                      <div key={sub.id} className="flex items-center text-gray-500 text-sm group-hover:text-gray-700 transition-colors">
                        <ChevronRight className="w-4 h-4 text-primary/50 mr-2" />
                        {sub.name}
                      </div>
                    ))}
                    {category.subcategories && category.subcategories.length > 4 && (
                      <div className="text-sm text-primary font-medium pl-6 pt-1">
                        + {category.subcategories.length - 4} outros...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform duration-300">
                    Ver Produtos <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoriesIndex
