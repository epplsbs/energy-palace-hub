import React from 'react';
// import OrdersManager from '@/components/pos/OrdersManager'; // Keep this commented for now for extreme simplification

const POSOrdersPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'lightblue', padding: '20px', border: '2px solid blue', height: '300px' }}>
      <h1 className="text-3xl font-bold text-black">POS ORDERS PAGE RENDERED</h1>
      <p className="text-black">If you see this, the orders route is working.</p>
      {/* <OrdersManager /> */} {/* Commented out to ensure this page itself renders first */}
    </div>
  );
};

export default POSOrdersPage;
