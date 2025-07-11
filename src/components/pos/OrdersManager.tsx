import React from 'react';

// Minimal props for now, just to match what POSOrdersPage might pass
interface OrdersManagerProps {
  posUserId?: string; // Optional for this simplified version
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ posUserId }) => {
  console.log("Simplified OrdersManager rendered. posUserId:", posUserId);

  return (
    <div style={{
      backgroundColor: 'lightgreen',
      padding: '20px',
      border: '3px solid darkgreen',
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', color: 'darkgreen', fontWeight: 'bold', marginBottom: '1rem' }}>
        SIMPLIFIED OrdersManager Component RENDERED
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'black' }}>
        If you see this, the basic component is rendering inside POSOrdersPage.
      </p>
      <p style={{ fontSize: '1rem', color: 'black', marginTop: '0.5rem' }}>
        (Received posUserId: {posUserId || 'Not provided'})
      </p>
      <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: 'white', border: '1px solid grey' }}>
        This is a test box within the simplified OrdersManager.
      </div>
    </div>
  );
};

export default OrdersManager;
