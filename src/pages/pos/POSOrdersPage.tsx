import React from 'react';
import OrdersManager from '@/components/pos/OrdersManager';

const POSOrdersPage: React.FC = () => {
  return (
    <div className="h-full"> {/* Ensure page takes full height if layout is flex */}
      <OrdersManager />
    </div>
  );
};

export default POSOrdersPage;
