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
  onViewDetails,
  className = ''
}) => {

  const { state, addItem } = useBudget();
  const { isAuthenticated } = useAuth();
  const [isAddedToBudget, setIsAddedToBudget] = useState(false);

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
    return product.image_url;
  };

  const getProductInitial = () => {
    return (product.name || 'P').charAt(0).toUpperCase();
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleViewDetails}
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer group border border-gray-100 hover:border-primary/20 flex flex-col sm:flex-row gap-6 ${className}`}
      >
        <div className="relative w-full sm:w-48 h-48 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-4">
          {getProductImage() ? (
            <OptimizedImage
              src={getProductImage()!}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              width={192}
              height={192}
            />
          ) : (
            <div className="text-gray-300 text-4xl font-bold">
              {getProductInitial()}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg sm:text-xl group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
              {product.description || 'Equipamento de alta performance para sua cozinha industrial.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
            {isAuthenticated && product.price !== undefined ? (
              <div className="font-bold text-primary text-xl">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </div>
            ) : (
              <div className="text-sm text-gray-400 italic">Preço sob consulta</div>
            )}

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 border border-primary text-primary font-bold rounded-lg text-sm hover:bg-red-50 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Detalhes</span>
              </button>

              <button
                onClick={handleAddToBudget}
                disabled={isAddedToBudget}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 font-bold rounded-lg text-sm shadow-sm transition-all ${isAddedToBudget
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
    <div
      onClick={handleViewDetails}
      className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full border border-gray-100 hover:border-primary/20 ${className}`}
    >
      {/* Imagem do Produto */}
      <div className="relative aspect-square bg-gray-50 p-6 overflow-hidden flex items-center justify-center">
        {getProductImage() ? (
          <OptimizedImage
            src={getProductImage()!}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            width={300}
            height={300}
          />
        ) : (
          <div className="text-gray-300 text-4xl font-bold">
            {getProductInitial()}
          </div>
        )}

        {/* Badge de Destaque/Novo se aplicável (mock) */}
        {product.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Destaque
          </div>
        )}

        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1 font-medium">{product.category?.name || 'Equipamentos'}</div>
          <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>

          {isAuthenticated && product.price !== undefined ? (
            <div className="font-bold text-primary mb-4 text-xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </div>
          ) : (
            <div className="mb-4 h-7"></div> // Spacer
          )}
        </div>

        <div className="space-y-2 mt-auto">
          <button
            onClick={handleAddToBudget}
            disabled={isAddedToBudget}
            className={`w-full py-3 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${isAddedToBudget
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]'
              }`}
          >
            {isAddedToBudget ? (
              <>
                <Check className="w-4 h-4" />
                <span>Adicionado ao Orçamento</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Orçamento</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="w-full text-center border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
