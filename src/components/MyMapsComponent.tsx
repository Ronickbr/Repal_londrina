import React from 'react';

interface MyMapsComponentProps {
  className?: string;
}

const MyMapsComponent: React.FC<MyMapsComponentProps> = ({ className = '' }) => {
  // URL do Google My Maps configurada
  // URL do Google Maps Embed para Repal Londrina
  const mapEmbedUrl = 'https://maps.google.com/maps?width=100%25&height=600&hl=pt-br&q=R.+Minas+Gerais,+164+-+Centro,+Londrina+-+PR,+86010-170+(Repal%20Londrina)&t=&z=16&ie=UTF8&iwloc=B&output=embed';



  return (
    <div className={`w-full h-96 ${className}`}>
      {/* Iframe do Google My Maps */}
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização das Lojas Repal"
          className="rounded-2xl"
          onError={() => {
            // Em caso de erro, mostra o fallback
            // Erro já tratado pelo fallback
          }}
        />
      </div>


    </div>
  );
};

export default MyMapsComponent;