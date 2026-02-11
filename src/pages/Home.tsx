import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Truck,
  Shield,
  MessageCircle,
  Utensils,
  Zap,
  Flame,
  Snowflake,
  Coffee,
  ListChecks,
  ChevronRight,
  CheckCircle,
  Star
} from 'lucide-react';

import BannerCarousel from '../components/BannerCarousel';
import { supabase } from '../lib/supabase';
import { table } from '../lib/schema';
import { useLatestProducts } from '../hooks/useProducts';
import WhatsAppButton from '../components/WhatsAppButton';
import { useSiteSettings } from '../hooks/useSiteSettings';
import ProductCard from '../components/ProductCard';
import { ProductWithCategory } from '../types/product';

interface FeaturedProduct extends ProductWithCategory { }

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: latestProducts, isLoading: loadingLatest } = useLatestProducts(8);
  const { canonicalBaseUrl, metaTitle, metaDescription, metaKeywords } = useSiteSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data: productsData, error: productsError } = await supabase
          .from(table('products'))
          .select(`
            *,
            category:categories(id, name, slug),
            product_images(id, image_url:url, sort_order)
          `)
          .eq('featured', true)
          .eq('active', true)
          .limit(8);

        if (!productsData || productsData.length === 0) {
          const { data: recentData, error: recentError } = await supabase
            .from(table('products'))
            .select(`
               *,
              category:categories(id, name, slug),
              product_images(id, image_url:url, sort_order)
            `)
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(8);

          productsData = recentData;
          productsError = recentError;
        }

        if (productsError) throw productsError;

        if (productsData) {
          // Transform if necessary, but ProductWithCategory should match
          setFeaturedProducts(productsData as FeaturedProduct[]);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>{metaTitle || 'Repal Londrina - Equipamentos Gastronômicos Profissionais'}</title>
        <meta name="description" content={metaDescription || 'Loja especializada em equipamentos para cozinha industrial, restaurantes, padarias e açougues. Solicite seu orçamento online.'} />
        <meta name="keywords" content={metaKeywords || 'equipamentos cozinha industrial, fogão industrial, gastronomia, londrina'} />
        {canonicalBaseUrl && (
          <link rel="canonical" href={`${(canonicalBaseUrl || '').trim().replace(/\/+$/, '')}/`} />
        )}
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-white">
        <BannerCarousel className="h-[300px] sm:h-[400px] lg:h-[500px] w-full object-cover" />
      </section>

      {/* Trust Bar (New) */}
      <section className="bg-white border-b border-gray-100 py-4 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="bg-red-50 p-2 rounded-full text-primary">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Certificação ISO</p>
                <p className="text-xs text-gray-500">Qualidade Garantida</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="bg-red-50 p-2 rounded-full text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Entrega Nacional</p>
                <p className="text-xs text-gray-500">Logística Rápida</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="bg-red-50 p-2 rounded-full text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Compra Segura</p>
                <p className="text-xs text-gray-500">Proteção de Dados</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="bg-red-50 p-2 rounded-full text-primary">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Suporte Técnico</p>
                <p className="text-xs text-gray-500">Especialistas Disponíveis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Access */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar pb-2">
            {[
              { name: 'Restaurantes', icon: Utensils, color: 'text-red-600 bg-red-50', link: '/categorias/bar-restaurante' },
              { name: 'Padarias', icon: Coffee, color: 'text-orange-600 bg-orange-50', link: '/categorias/padaria-confeitaria' },
              { name: 'Açougues', icon: Flame, color: 'text-rose-600 bg-rose-50', link: '/categorias/acougue' },
              { name: 'Refrigeração', icon: Snowflake, color: 'text-blue-600 bg-blue-50', link: '/categorias/refrigeracao-comercial' },
              { name: 'Equipamentos', icon: Zap, color: 'text-yellow-600 bg-yellow-50', link: '/categorias/equipamentos' },
              { name: 'Ver Tudo', icon: ListChecks, color: 'text-gray-600 bg-gray-50', link: '/categorias' },
            ].map((cat, i) => (
              <Link
                key={i}
                to={cat.link}
                className="group flex flex-col items-center min-w-[100px] transition-transform hover:-translate-y-1"
              >
                <div className={`p-4 rounded-xl ${cat.color} mb-3 shadow-sm group-hover:shadow-md transition-all`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Destaques da Loja</h2>
              <p className="text-gray-500 mt-1">Equipamentos selecionados para alta performance</p>
            </div>
            <Link to="/categorias" className="text-primary font-bold hover:text-primary-hover flex items-center transition-colors">
              Ver Catálogo <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                Carregando produtos...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Grid (Visual) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Navegue por Indústria</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Soluções completas para cada tipo de negócio gastronômico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Bar e Restaurante', img: '/images/restaurante.png', link: '/categorias/bar-restaurante', count: '120+ Itens' },
              { title: 'Açougues', img: '/images/açougue.png', link: '/categorias/acougue', count: '85+ Itens' },
              { title: 'Padarias', img: '/images/padarias.png', link: '/categorias/padaria-confeitaria', count: '90+ Itens' },
              { title: 'Refrigeração', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', link: '/categorias/refrigeracao-comercial', count: '50+ Itens' },
            ].map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/30 transition-colors z-10" />
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
                  <span className="text-sm text-gray-200 bg-white/20 px-2 py-1 rounded backdrop-blur-sm">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Novidades</h2>
            <Link to="/categorias?sort=created_at" className="text-primary font-bold hover:text-primary-hover flex items-center transition-colors">
              Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {!loadingLatest && latestProducts && latestProducts.map((product) => (
              <ProductCard key={product.id} product={product as FeaturedProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* About Tabs (Simplificado) */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Por que escolher a Repal Londrina?</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                      <Star className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Experiência de Mercado</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Mais de 60 anos de tradição fornecendo os melhores equipamentos.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                      <CheckCircle className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Produtos Certificados</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Trabalhamos apenas com as melhores marcas e produtos com garantia.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/sobre" className="text-primary font-bold hover:text-primary-hover flex items-center">
                  Saiba mais sobre nós <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://i.imgur.com/LLQU0vJ.png"
                alt="Repal Londrina Showroom"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Pronto para modernizar sua operação?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Fale com nossos consultores e receba um orçamento personalizado para sua necessidade.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <WhatsAppButton
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg"
              message="Olá, gostaria de um orçamento para minha cozinha."
            >
              Falar com Especialista
            </WhatsAppButton>
            <Link
              to="/contato"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-secondary text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Solicitar Cotação Online
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
