import React, { Suspense } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Package,
  X,
  BarChart3,
  Tag,
  Image,
  Settings,
  LogOut,
  Menu,
  Home,
  Users,
  Flag,
  MessageSquare,
  Shield,
  ChevronRight,
  User,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { table } from '../lib/schema';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [newLeadsCount, setNewLeadsCount] = React.useState(0);

  React.useEffect(() => {
    const fetchNewLeadsCount = async () => {
      // Use RPC to avoid 'leads' keyword in URL (AdBlock workaround)
      const { data, error } = await supabase.rpc('get_new_contacts_count');

      if (!error && typeof data === 'number') {
        setNewLeadsCount(data);
      } else {
        // Fallback to direct query if RPC fails (or for development)
        const { count, error: countError } = await supabase
          .from(table('leads'))
          .select('*', { count: 'exact', head: true })
          .eq('status', 'novo');

        if (!countError && count !== null) {
          setNewLeadsCount(count);
        }
      }
    };

    fetchNewLeadsCount();

    // Subscribe to changes
    const subscription = supabase
      .channel('leads_count_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: table('leads') },
        () => {
          fetchNewLeadsCount();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/admin',
      description: 'Visão geral do sistema',
      badge: null
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: Package,
      path: '/admin/products',
      description: 'Gerenciar produtos',
      badge: null
    },
    {
      id: 'adjustments',
      label: 'Reajustes',
      icon: DollarSign,
      path: '/admin/products/adjustments',
      description: 'Reajuste em massa',
      badge: null
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: Tag,
      path: '/admin/categories',
      description: 'Organizar categorias',
      badge: null
    },
    {
      id: 'brands',
      label: 'Marcas',
      icon: Flag,
      path: '/admin/brands',
      description: 'Gerenciar marcas',
      badge: null
    },
    {
      id: 'banners',
      label: 'Banners',
      icon: Image,
      path: '/admin/banners',
      description: 'Controle de banners',
      badge: null
    },
    {
      id: 'promotions',
      label: 'Promoções',
      icon: Tag,
      path: '/admin/promotions',
      description: 'Gerenciar promoções',
      badge: null
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: MessageSquare,
      path: '/admin/leads',
      description: 'Gerenciar leads',
      badge: newLeadsCount > 0 ? newLeadsCount.toString() : null
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      path: '/admin/users',
      description: 'Controle de acesso',
      badge: null
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      path: '/admin/settings',
      description: 'Configurações do sistema',
      badge: null
    }
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/admin') return 'dashboard';
    const segments = path.split('/');
    return segments[segments.length - 1] || 'dashboard';
  };

  const activeTab = getActiveTab();

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentPage = navigationItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}>

        {/* Header da Sidebar - Modern Design */}
        <div className="relative flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6 border-b border-gray-200/50 bg-gradient-to-br from-red-700 via-red-800 to-red-900 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl" />

          <Link to="/admin" className="relative flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-700" />
            </div>
            <div>
              <span className="text-white font-bold text-base sm:text-lg block">Admin Panel</span>
              <span className="text-red-100 text-xs hidden sm:block">Painel de Controle</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="relative lg:hidden p-2 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Container Principal da Sidebar - Altura Automática */}
        <div className="flex flex-col h-auto max-h-screen w-64">
          {/* Navegação com Scroll */}
          <nav className="mt-6 px-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`relative w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                        ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 shadow-md border border-red-200/50'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                      }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-600 to-orange-500 rounded-r-full" />
                    )}

                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive
                          ? 'bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-red-600 group-hover:shadow-md'
                        }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold truncate">{item.label}</p>
                        <p className="text-xs opacity-70 truncate">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`h-4 w-4 transition-all duration-300 ${isActive ? 'transform rotate-90 text-red-600' : 'text-gray-400 group-hover:text-red-600 group-hover:translate-x-1'
                        }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer da Sidebar */}
          <div className="border-t border-gray-200 p-4 mt-auto space-y-3">
            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200/50 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.email || 'Administrador'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Administrador</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:shadow-md transition-all duration-300 group"
            >
              <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Voltar ao Site
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-red-700 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl hover:from-red-100 hover:to-orange-100 hover:shadow-md transition-all duration-300 group"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Sair do Sistema
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="bg-gradient-to-r from-white to-gray-50 shadow-md border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Lado Esquerdo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-110"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Modern Breadcrumb */}
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50">
                <Home className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">/</span>
                <span className="text-gray-700 font-medium text-sm">Admin</span>
                <span className="text-gray-400">/</span>
                <span className="text-red-700 font-bold text-sm">
                  {currentPage?.label || 'Dashboard'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            {/* Título da Página */}
            {currentPage && (
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-full" />
                  <div className="p-2.5 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl shadow-lg">
                    <currentPage.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="h-1 w-12 bg-gradient-to-l from-red-600 to-orange-500 rounded-full" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {currentPage.label}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{currentPage.description}</p>
              </div>
            )}

            {/* Conteúdo com Suspense */}
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            }>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;