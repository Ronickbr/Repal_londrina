import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Clock, Star } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import WhatsAppButton from '../components/WhatsAppButton';

const About: React.FC = () => {
  const { siteName, siteDescription } = useSiteSettings();


  const stats = [
    { number: '60+', label: 'Anos de Experiência' },
    { number: '5000+', label: 'Clientes Satisfeitos' },
    { number: '10000+', label: 'Equipamentos Vendidos' },
    { number: '24/7', label: 'Suporte Técnico' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Oferecemos apenas equipamentos de alta qualidade, testados e aprovados por profissionais da área.'
    },
    {
      icon: Users,
      title: 'Atendimento',
      description: 'Nossa equipe especializada está sempre pronta para oferecer o melhor atendimento e suporte técnico.'
    },
    {
      icon: Clock,
      title: 'Agilidade',
      description: 'Processos otimizados para garantir entregas rápidas e instalações eficientes.'
    },
    {
      icon: Star,
      title: 'Excelência',
      description: 'Buscamos constantemente a excelência em todos os nossos serviços e produtos oferecidos.'
    }
  ];



  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <div className="bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary/20 text-red-200 text-sm font-semibold px-3 py-1 rounded-full border border-primary/30">
                  Desde 1962
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Repal Equipamentos <br />
                <span className="text-primary">Tradição e Qualidade</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                {siteDescription || 'Líder no fornecimento de equipamentos profissionais para cozinhas industriais, transformando ambientes gastronômicos com tecnologia e durabilidade.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/categorias"
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/contato"
                  className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
                >
                  <span>Fale Conosco</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-2xl rotate-3 opacity-20 transform translate-x-4 translate-y-4"></div>
              <img
                src="https://www.nutrimixassessoria.com.br/wp-content/uploads/2024/05/ar-condicionado-cozinha-industrial.png"
                alt="Cozinha Industrial Moderna"
                className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px] border-4 border-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-gray-100">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-gray-600 font-medium uppercase tracking-wide text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 relative inline-block">
                Nossa História
                <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-primary rounded-full"></span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
                <p>
                  Fundada em <strong className="text-secondary font-semibold">1962</strong>, a Repal Equipamentos nasceu da visão de fornecer
                  equipamentos de alta qualidade para o setor gastronômico brasileiro.
                  Começamos como uma pequena empresa familiar e hoje somos referência
                  nacional no segmento.
                </p>
                <p>
                  Ao longo dos anos, construímos relacionamentos sólidos com os principais
                  fabricantes mundiais, garantindo que nossos clientes tenham acesso às
                  mais modernas tecnologias em equipamentos para cozinha industrial.
                </p>
                <p className="border-l-4 border-primary pl-4 italic bg-white p-4 rounded-r-lg shadow-sm">
                  "Nossa missão é <strong>transformar cozinhas em verdadeiras potências
                    gastronômicas</strong>, oferecendo soluções completas que incluem consultoria, instalação e suporte técnico."
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-secondary rounded-2xl -rotate-2 opacity-10 transition-transform group-hover:rotate-0 duration-300"></div>
              <img
                src="https://i.imgur.com/F36V7tA.png"
                alt="Loja Física da Repal Equipamentos"
                className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover transition-transform group-hover:scale-[1.01] duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Os princípios que guiam nossa empresa e garantem a satisfação de nossos clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
                  <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-secondary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar sua Cozinha?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            Entre em contato conosco e descubra como podemos ajudar você a criar
            uma verdadeira potência gastronômica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppButton
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              message={`Olá! Gostaria de saber mais sobre os equipamentos da ${siteName || 'Repal'}.`}
            >
              <span>WhatsApp</span>
              <ArrowRight className="h-5 w-5" />
            </WhatsAppButton>
            <Link
              to="/contato"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-secondary text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
            >
              <span>Formulário de Contato</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
