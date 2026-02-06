import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Truck, Shield, MessageCircle, Utensils, Zap, Flame, Snowflake, Coffee, ListChecks, Plus, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

import BannerCarousel from '../components/BannerCarousel';
import { supabase } from '../lib/supabase';
import { table } from '../lib/schema';
import { useBudget } from '../contexts/BudgetContext';
import { useLatestProducts } from '../hooks/useProducts';

import WhatsAppButton from '../components/WhatsAppButton';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface FeaturedProduct {
  id: number;
  name: string;
  image_url: string | null;
  slug: string;
  category_id?: number;
  featured_on_homepage?: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

const Home: React.FC = () => {

  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');
  const { addItem } = useBudget();
  const { data: latestProducts, isLoading: loadingLatest } = useLatestProducts(6);
  const { siteName, canonicalBaseUrl, metaTitle, metaDescription, metaKeywords } = useSiteSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Primeiro tenta buscar produtos em destaque na homepage
        let { data: productsData, error: productsError } = await supabase
          .from(table('products'))
          .select(`
            id,
            name,
            description,
            image,
            slug,
            featured,
            category_id,
            featured_on_homepage,
            created_at
          `)
          .eq('featured', true)
          .eq('active', true)
          .limit(8);

        // Se não houver produtos em destaque na homepage, tenta apenas featured
        if (!productsData || productsData.length === 0) {
          const { data: featuredData, error: featuredError } = await supabase
            .from(table('products'))
            .select(`
              id,
              name,
              description,
              image,
              slug,
              featured,
              category_id,
              featured_on_homepage,
              created_at
            `)
            .eq('featured', false)
            .eq('featured_on_homepage', true)
            .eq('active', true)
            .limit(8);

          productsData = featuredData;
          productsError = featuredError;
        }

        // Se ainda não houver produtos, busca os mais recentes ativos
        if (!productsData || productsData.length === 0) {
          const { data: recentData, error: recentError } = await supabase
            .from(table('products'))
            .select(`
              id,
              name,
              description,
              image,
              slug,
              featured,
              category_id,
              featured_on_homepage,
              created_at
            `)
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(8);

          productsData = recentData;
          productsError = recentError;
        }

        if (productsError) {
          console.error('Erro ao buscar produtos em destaque:', productsError);
          return;
        }

        if (productsData) {
          const transformedProducts = productsData.map((product: any) => ({
            id: product.id,
            name: product.name,
            image_url: product.image,
            slug: product.slug,
            category_id: product.category_id,
            featured_on_homepage: product.featured_on_homepage,
            active: true,
            created_at: product.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
          setFeaturedProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);





  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#8B0000' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{metaTitle || 'Os Melhores Equipamentos e Peças para o seu Negócio gastronômico'}</title>
        <meta name="description" content={metaDescription || 'A Repal oferece equipamentos gastronômicos profissionais e peças originais para cozinhas industriais, restaurantes, padarias e bares. Soluções completas com atendimento especializado e entrega rápida.'} />
        <meta name="keywords" content={metaKeywords || 'equipamentos gastronômicos, Fogão Industrial, Fritadeira Elétrica, Geladeira Industrial, equipamentos profissionais, restaurante, padaria, bar, Refrigeração Comercial'} />
        {canonicalBaseUrl && (
          <link rel="canonical" href={`${(canonicalBaseUrl || '').trim().replace(/\/+$/, '')}/`} />
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteName || 'Repal Equipamentos Gastronômicos',
            url: (canonicalBaseUrl || '').trim() || undefined,
            logo: (canonicalBaseUrl || '').trim() ? `${(canonicalBaseUrl || '').trim().replace(/\/+$/, '')}/logo.png` : undefined,
            sameAs: [],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName || 'Repal Equipamentos Gastronômicos',
            url: (canonicalBaseUrl || '').trim() || undefined,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${(canonicalBaseUrl || '').trim().replace(/\/+$/, '')}/buscar?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          })}
        </script>
      </Helmet>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Quick Category Access - Modern Card Design */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: 'Restaurantes', icon: Utensils, gradient: 'from-red-50 to-red-100', iconColor: 'text-red-600', link: '/categorias/bar-restaurante' },
              { name: 'Padarias', icon: Coffee, gradient: 'from-orange-50 to-orange-100', iconColor: 'text-orange-600', link: '/categorias/padaria-confeitaria' },
              { name: 'Açougues', icon: Flame, gradient: 'from-rose-50 to-rose-100', iconColor: 'text-rose-600', link: '/categorias/acougue' },
              { name: 'Refrigeração', icon: Snowflake, gradient: 'from-blue-50 to-blue-100', iconColor: 'text-blue-600', link: '/categorias/refrigeracao-comercial' },
              { name: 'Equipamentos', icon: Zap, gradient: 'from-amber-50 to-amber-100', iconColor: 'text-amber-600', link: '/categorias/equipamentos' },
              { name: 'Ver Tudo', icon: ListChecks, gradient: 'from-gray-50 to-gray-100', iconColor: 'text-gray-700', link: '/categorias' },
            ].map((cat, i) => (
              <Link
                key={i}
                to={cat.link}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative p-4 sm:p-5 flex flex-col items-center gap-3">
                  <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${cat.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${cat.iconColor}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800 text-center leading-tight">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 bg-white" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Os Melhores Equipamentos e Peças para o seu Negócio gastronômico
          </h1>
          <p className="mt-3 text-gray-700 max-w-3xl">
            Com soluções completas em equipamentos gastronômicos profissionais e peças originais, a Repal apoia restaurantes, padarias, açougues e cozinhas industriais na conquista de desempenho, segurança e qualidade.
          </p>
        </div>
      </section>

      {/* Nossos Produtos */}
      <section className="py-16 bg-gray-50" aria-labelledby="heading-nossos-produtos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-full" />
                <Sparkles className="w-5 h-5 text-red-600" />
              </div>
              <h2 id="heading-nossos-produtos" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Equipamentos em Destaque
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Os equipamentos mais procurados pelos profissionais
              </p>
            </div>
            <Link
              to="/categorias"
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <span>Ver Todos</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="marketplace-card rounded shadow-sm hover:shadow-md h-full flex flex-col group"
                >
                  <div className="relative aspect-square overflow-hidden bg-white p-4">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/400x400?text=Produto'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="badge-repal">Destaque</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-5 flex-1 flex flex-col">
                    <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <div className="mt-auto space-y-2">
                      <Link
                        to={product.slug ? `/produto/${product.slug}` : '#'}
                        className="w-full text-center border border-primary text-primary px-2 py-1.5 rounded text-xs sm:text-sm font-bold hover:bg-red-50 transition-colors block"
                      >
                        Detalhes
                      </Link>
                      <button
                        onClick={() => addItem({
                          id: product.id.toString(),
                          name: product.name,
                          image: product.image_url || undefined
                        })}
                        className="w-full bg-primary text-white px-3 py-1.5 rounded text-xs sm:text-sm font-bold hover:bg-primary-hover shadow-sm transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Orçamento
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 7l-2 2 2 2 2 2 2-2 2-2 2 2 2 2-2 2-2 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto disponível</h3>
                  <p className="text-gray-600 mb-4">Em breve teremos produtos incríveis para você!</p>
                  <Link
                    to="/contato"
                    className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Entre em contato
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categorias Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">Categorias em Destaque</h2>
              <p className="text-gray-500 pl-4">Tudo o que sua cozinha industrial precisa</p>
            </div>
          </div>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { title: 'Bar e Restaurante', img: '/images/restaurante.png', link: '/categorias/bar-restaurante', desc: 'Equipamentos que trazem agilidade.' },
              { title: 'Açougues', img: '/images/açougue.png', link: '/categorias/acougue', desc: 'Máquinas robustas para cortes perfeitos.' },
              { title: 'Padarias', img: '/images/padarias.png', link: '/categorias/padaria-confeitaria', desc: 'Forno e masseiras de alto desempenho.' },
              { title: 'Refrigeração Comercial', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', link: '/categorias/refrigeracao-comercial', desc: 'Soluções para conservação.' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="group marketplace-card rounded-lg overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-4 bg-white flex-1 flex flex-col">
                  <p className="text-xs text-gray-600 mb-4 flex-1">{item.desc}</p>
                  <span className="text-primary text-sm font-bold flex items-center group-hover:underline">
                    Ver produtos <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>


        </div>
      </section>

      {/* Seção Novidades */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full" />
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div className="h-1 w-12 bg-gradient-to-l from-orange-500 to-red-600 rounded-full" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Novidades</h2>
            <p className="text-sm sm:text-base text-gray-600">Conheça nossos últimos lançamentos</p>
          </div>

          {/* Loading State */}
          {loadingLatest && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8B0000' }}></div>
            </div>
          )}

          {/* Grid de Novidades */}
          {!loadingLatest && latestProducts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {latestProducts.map((product, index) => (
                <div key={product.id} className="marketplace-card rounded shadow-sm hover:shadow-md h-full flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-white p-4">
                    <img
                      src={product.product_images?.[0]?.image_url || product.image_url || 'https://via.placeholder.com/400x300?text=Produto'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="badge-repal">
                        {index === 0 ? 'NOVO' : index === 1 ? 'LANÇAMENTO' : 'RECENTE'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-4 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-auto space-y-2">
                      <Link
                        to={product.slug ? `/produto/${product.slug}` : '#'}
                        className="w-full text-center border border-primary text-primary px-2 py-1.5 rounded text-xs sm:text-sm font-bold hover:bg-red-50 transition-colors block"
                      >
                        Ver Detalhes
                      </Link>
                      <button
                        onClick={() => addItem({
                          id: product.id.toString(),
                          name: product.name,
                          image: product.product_images?.[0]?.image_url || product.image_url || undefined
                        })}
                        className="w-full bg-primary text-white px-3 py-1.5 rounded text-xs sm:text-sm font-bold hover:bg-primary-hover shadow-sm transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Orçamento
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}


        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" aria-labelledby="heading-refrigeracao-comercial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 id="heading-refrigeracao-comercial" className="text-3xl sm:text-5xl font-extrabold mb-3 sm:mb-4">Refrigeração Comercial</h2>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-4">Potência e eficiência na sua cozinha</h2>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Soluções de refrigeração comercial para restaurantes, padarias, açougues e cozinhas industriais.
                Equipamentos projetados para alta demanda com controle de temperatura preciso, eficiência energética e durabilidade.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gray-800/60 rounded-lg p-3 border border-white/10">
                  <div className="text-sm sm:text-base font-semibold">Eficiência energética</div>
                  <div className="text-xs sm:text-sm text-gray-300">Reduza custos mantendo performance e segurança alimentar.</div>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3 border border-white/10">
                  <div className="text-sm sm:text-base font-semibold">Controle de temperatura</div>
                  <div className="text-xs sm:text-sm text-gray-300">Estabilidade térmica para diferentes tipos de alimentos.</div>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3 border border-white/10">
                  <div className="text-sm sm:text-base font-semibold">Construção robusta</div>
                  <div className="text-xs sm:text-sm text-gray-300">Materiais resistentes para uso contínuo e fácil higienização.</div>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3 border border-white/10">
                  <div className="text-sm sm:text-base font-semibold">Pós-venda e peças</div>
                  <div className="text-xs sm:text-sm text-gray-300">Peças originais e suporte técnico especializado.</div>
                </div>
              </div>
              <Link
                to="/contato"
                className="bg-yellow-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-yellow-400 transition-colors inline-block"
              >
                Solicite Orçamento
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <figure className="group relative">
                <Link to="/categorias/acougue?sort=name&view=grid&sub=62" aria-label="Ver Balcões Refrigerados na categoria Refrigeração Comercial" className="block">
                  <img
                    src="https://i.imgur.com/DUOAYqg.png"
                    alt="Balcões Refrigerados"
                    className="mx-auto max-h-36 sm:max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <figcaption className="mt-3 text-center font-bold text-sm sm:text-base text-white">Balcões Refrigerados</figcaption>
                </Link>
              </figure>

              <figure className="group relative">
                <Link to="/categorias/refrigeracao-comercial?sort=name&view=grid&sub=16" aria-label="Ver Câmaras Frias na categoria Refrigeração Comercial" className="block">
                  <img
                    src="https://i.imgur.com/p9Q5GIT.png"
                    alt="Câmaras Frias"
                    className="mx-auto max-h-36 sm:max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <figcaption className="mt-3 text-center font-bold text-sm sm:text-base text-white">Câmaras Frias</figcaption>
                </Link>
              </figure>

              <figure className="group relative">
                <Link to="/categorias/refrigeracao-comercial?sort=name&view=grid&sub=18" aria-label="Ver Expositores Refrigerados na categoria Refrigeração Comercial" className="block">
                  <img
                    src="https://i.imgur.com/EvjHmLJ.png"
                    alt="Expositores Refrigerados"
                    className="mx-auto max-h-36 sm:max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <figcaption className="mt-3 text-center font-bold text-sm sm:text-base text-white">Expositores Refrigerados</figcaption>
                </Link>
              </figure>

              <figure className="group relative">
                <Link to="/categorias/refrigeracao-comercial?sort=name&view=grid&sub=19" aria-label="Ver Freezers Comerciais na categoria Refrigeração Comercial" className="block">
                  <img
                    src="https://i.imgur.com/TQmaGUI.png"
                    alt="Freezers Comerciais"
                    className="mx-auto max-h-36 sm:max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <figcaption className="mt-3 text-center font-bold text-sm sm:text-base text-white">Freezers Comerciais</figcaption>
                </Link>
              </figure>
            </div>
          </div>
        </div>
        {/* Information Tabs Section */}
        <section className="mt-[10px] py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('sobre')}
                className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base transition-colors border-b-2 ${activeTab === 'sobre'
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                Sobre a Repal
              </button>
              <button
                onClick={() => setActiveTab('atuacao')}
                className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base transition-colors border-b-2 ${activeTab === 'atuacao'
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                Área de Atuação
              </button>
              <button
                onClick={() => setActiveTab('diferenciais')}
                className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base transition-colors border-b-2 ${activeTab === 'diferenciais'
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                Diferenciais
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              {activeTab === 'sobre' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Sobre a Repal</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      A Repal nasceu com a missão de simplificar a operação de negócios gastronômicos por meio de equipamentos profissionais confiáveis e peças originais que asseguram alto desempenho. Valorizamos ética, transparência e compromisso com resultados. Nosso histórico é marcado por parcerias duradouras com restaurantes, padarias, açougues, bares, hotéis e cozinhas industriais que exigem produtividade, segurança e qualidade de acabamento em cada preparo.
                    </p>
                    <p>
                      Investimos continuamente em curadoria de marcas reconhecidas, em suporte técnico especializado e em uma experiência de compra consultiva. Assim, entregamos soluções adequadas ao porte da operação, ao fluxo de clientes e ao perfil dos cardápios. Do dimensionamento de frota térmica ao detalhamento de instalação, cada projeto considera eficiência energética, durabilidade e conformidade com normas sanitárias e de segurança.
                    </p>
                    <p>
                      Atuamos com foco regional e nacional, oferecendo atendimento ágil, logística otimizada e acompanhamento pós-venda. Nossa equipe orienta a escolha de equipamentos, organiza cronogramas de implantação e indica práticas de manutenção preventiva, reduzindo paradas e custos operacionais.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'atuacao' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Área de atuação e localização</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Atendemos operações gastronômicas em todo o Brasil com ênfase no Sul e Sudeste, mantendo estoques estratégicos para entregas rápidas. Nossa base operacional facilita coletas e envios, e o suporte remoto orienta instalação, configuração e cuidados diários.
                    </p>
                    <p>
                      Em projetos maiores, alinhamos visitas técnicas e integração com fornecedores para garantir que a cozinha opere dentro dos requisitos de fluxo, ergonomia e segurança, respeitando as particularidades de cada nicho, como produção de panificação, corte e processamento de carnes, confeitaria e serviço à la carte.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'diferenciais' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Diferenciais competitivos</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Seleção de equipamentos gastronômicos com garantia de procedência, peças originais e orientação técnica dedicada. Priorizamos eficiência energética, facilidade de higienização, ergonomia e segurança operacional. A consultoria ajuda a prever capacidade instalada e expansão, evitando gargalos.
                    </p>
                    <p>
                      Oferecemos peças e acessórios compatíveis para manutenção ágil e redução de downtime, incluindo componentes de refrigeração, elementos de aquecimento, conjuntos de corte e itens de reposição. O catálogo é atualizado conforme demanda e novas tecnologias.
                    </p>
                    <p>
                      Nosso atendimento integra comunicação clara, prazos realistas e acompanhamento pós-venda, criando uma relação confiável e duradoura.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

      </section>

      {/* Stats Section - Redesigned */}
      <section className="py-8 sm:py-12 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B0000' }}>
                  <Truck className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Frete Rápido e Seguro</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">Chega até você sem demora.</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B0000' }}>
                  <Award className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Padrão Profissional</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">Tecnologia de nível industrial.</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B0000' }}>
                  <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Proteção Total</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">Embalagens resistentes contra danos.</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B0000' }}>
                  <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Atendimento 24/7</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">Suporte para qualquer situação.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section - Modern Design */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: 'Qualidade Garantida',
                description: 'Equipamentos de marcas líderes do mercado',
                gradient: 'from-red-500 to-orange-500'
              },
              {
                icon: Truck,
                title: 'Entrega Rápida',
                description: 'Logística eficiente para todo o Brasil',
                gradient: 'from-orange-500 to-amber-500'
              },
              {
                icon: MessageCircle,
                title: 'Suporte Técnico',
                description: 'Equipe especializada pronta para ajudar',
                gradient: 'from-amber-500 to-yellow-500'
              },
              {
                icon: Shield,
                title: 'Compra Segura',
                description: 'Proteção total em todas as transações',
                gradient: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners/Suppliers Carousel Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Nossos Parceiros de Confiança
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Trabalhamos com as melhores marcas do mercado para oferecer equipamentos de alta qualidade
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-12 items-center">
              {/* First set of logos */}
              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://gelopar.vtexassets.com/arquivos/logo.png"
                  alt="GELOPAR"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://d8vlg9z1oftyc.cloudfront.net/siemsen/image/media/5e3b022ac50ab-logo.jpg"
                  alt="SKYMSEN"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://www.simecan.com.br/fotos/1/136/Design%20sem%20nome.png"
                  alt="DAK"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://www.sulpack.com.br/img/logo.png"
                  alt="SULPACK"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://static.wixstatic.com/media/223c21_034535d90b1a4d09843eb98155a1a564~mv2.png/v1/crop/x_0,y_57,w_2282,h_869/fill/w_200,h_76,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logoRGB_tita-03.png"
                  alt="TITA"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://i.imgur.com/ofWD079.png"
                  alt="PRATICA"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://i.imgur.com/VGxeoMm.png"
                  alt="LAYR"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://www.urano.com.br/wp-content/uploads/2024/06/logo_URANO-1024x239.png"
                  alt="URANO"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://www.cafmaquinas.com.br/public/images/logo-black.png"
                  alt="CAF"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://www.venanciometal.com.br/settings/1785113355577647.webp"
                  alt="VENANCIO"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src="https://images.seeklogo.com/logo-png/26/1/gastromaq-logo-png_seeklogo-267299.png"
                  alt="GASTROMAQ"
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Design */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-800 to-red-900" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Pronto para revolucionar sua cozinha?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-100 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Entre em contato conosco e descubra como nossos equipamentos podem
            transformar seu negócio gastronômico em um verdadeiro sucesso.
          </p>
          <div className="flex justify-center">
            <WhatsAppButton
              className="group relative bg-white text-red-700 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-2 sm:space-x-3 overflow-hidden"
              message="Olá! Gostaria de saber mais sobre os equipamentos da Repal."
            >
              <span className="relative z-10">Falar no WhatsApp</span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 relative z-10 group-hover:translate-x-1 transition-transform" />

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </WhatsAppButton>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
