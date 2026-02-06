import React, { memo, useState, useEffect } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { ProductWithCategory } from '../types/product';
import { useBudget } from '../contexts/BudgetContext';
import { useAuth } from '../hooks/useAuth';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: ProductWithCategory;
  viewMode?: 'grid' | 'list';
  onAddToCart?: (product: ProductWithCategory) => void;
  onViewDetails?: (product: ProductWithCategory) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  viewMode = 'grid',
  // onAddToCart, // removido pois não está sendo usado
  onViewDetails,
  className = ''
}) => {

  const { state, addItem } = useBudget();
  const { isAuthenticated } = useAuth();
  const [isAddedToBudget, setIsAddedToBudget] = useState(false);

  // Verifica se o produto já está na lista
  useEffect(() => {
    const isInBudget = state.items && Array.isArray(state.items) && state.items.some(item => item.id === product.id);
    setIsAddedToBudget(!!isInBudget);
  }, [state.items, product.id]);

  const handleAddToBudget = (e: React.MouseEvent) => {
    e.stopPropagation();



    addItem({
      id: product.id.toString(),
      name: product.name,
      image: product.product_images?.[0]?.image_url || product.image_url || '/placeholder-product.png'
    });



    setIsAddedToBudget(true);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };



  const getProductImage = () => {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].image_url;
    }
    return null;
  };

  const getProductInitial = () => {
    return (product.name || 'P').charAt(0).toUpperCase();
  };

  if (viewMode === 'list') {
    return (
      <div className={`marketplace-card rounded shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer group ${className}`}>
        <div className="flex items-center gap-6">
          {/* Imagem do Produto em alta resolução */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white rounded flex-shrink-0 overflow-hidden p-2">
            {getProductImage() ? (
              <OptimizedImage
                src={getProductImage()!}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                width={160}
                height={160}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.png';
                  target.alt = 'Imagem indisponível';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <div className="text-gray-300 text-2xl font-bold">
                  {getProductInitial()}
                </div>
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="flex-1 min-w-0 p-2 sm:p-3 md:p-5">
            {/* Nome/título em destaque com tamanho responsivo */}
            <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight text-base sm:text-lg md:text-xl">
              {product.name}
            </h3>

            {isAuthenticated && product.price !== undefined && (
              <div className="font-bold text-[#D0021B] mb-2 sm:mb-3 text-base sm:text-lg">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </div>
            )}

            {/* Container dos botões */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                className="flex items-center justify-center gap-2 px-6 py-2 border border-primary text-primary font-bold rounded text-sm hover:bg-red-50 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Ver Detalhes</span>
              </button>

              <button
                onClick={handleAddToBudget}
                disabled={isAddedToBudget}
                className={`flex items-center justify-center gap-2 px-6 py-2 font-bold rounded text-sm shadow-sm transition-all ${isAddedToBudget
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
                  }`}
              >
                {isAddedToBudget ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Orçamento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`marketplace-card rounded shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full ${className}`}>
      {/* Imagem do Produto */}
      <div className="relative aspect-square bg-white flex items-center justify-center p-4 overflow-hidden">
        {getProductImage() ? (
          <OptimizedImage
            src={getProductImage()!}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            width={300}
            height={300}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
              target.alt = 'Imagem indisponível';
            }}
          />
        ) : (
          <div className="text-gray-300 text-3xl font-bold">
            {getProductInitial()}
          </div>
        )}

        {/* Overlay com detalhes (opcional em marketplace mas mantido para UX) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
      </div>

      {/* Informações do Produto */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {isAuthenticated && product.price !== undefined && (
          <div className="font-bold text-primary mb-3 text-lg">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </div>
        )}

        {/* Botão Orçamento - Estilo Marketplace */}
        <div className="mt-auto space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="w-full text-center border border-primary text-primary px-3 py-1.5 rounded text-sm font-bold hover:bg-red-50 transition-colors block"
          >
            Ver Detalhes
          </button>

          <button
            onClick={handleAddToBudget}
            disabled={isAddedToBudget}
            className={`w-full px-3 py-2 rounded text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${isAddedToBudget
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
              }`}
          >
            {isAddedToBudget ? (
              <>
                <Check className="w-4 h-4" />
                <span>Adicionado</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Orçamento</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
