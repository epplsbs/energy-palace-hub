import React from 'react';
import OrdersManager from '@/components/pos/OrdersManager';

// Define the expected POSUser prop structure, mirroring what POSLayout provides
interface POSUser {
  id: string; // This is the id from pos_users table (PK)
  auth_user_id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface POSOrdersPageProps {
  posUser?: POSUser | null; // Make it optional as it might not be passed if not careful
}

const POSOrdersPage: React.FC<POSOrdersPageProps> = ({ posUser }) => {
  if (!posUser) {
    // This case should ideally be handled by POSLayout not rendering this page
    // if posUser isn't available, but as a fallback:
    return <div className="p-4">Error: POS User data not available.</div>;
  }
  return (
    <div className="h-full"> {/* Ensure page takes full height if layout is flex */}
      <OrdersManager posUserId={posUser.id} /> {/* Pass the actual ID from pos_users table */}
    </div>
  );
};

export default POSOrdersPage;
