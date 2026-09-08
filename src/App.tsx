import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CartPanel } from './components/CartPanel';
import { ReceiptModal } from './components/ReceiptModal';
import { EndShiftModal } from './components/EndShiftModal';
import { MobileCartDrawer } from './components/MobileCartDrawer';
import { ManualPaymentModal } from './components/ManualPaymentModal';

// Screens
import { PosScreen } from './screens/PosScreen';
import { OverviewScreen } from './screens/OverviewScreen';
import { OrderQueueScreen } from './screens/OrderQueueScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { PricingEngineScreen } from './screens/PricingEngineScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { RevenueDeskScreen } from './screens/RevenueDeskScreen';
import { PayoutsScreen } from './screens/PayoutsScreen';
import { TaxEngineScreen } from './screens/TaxEngineScreen';
import { MarketplaceScreen } from './screens/MarketplaceScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LiveMonitorScreen } from './screens/LiveMonitorScreen';
import { AlertsScreen } from './screens/AlertsScreen';

const MainAppLayout: React.FC = () => {
  const {
    currentScreen,
    mobileMenuOpen,
    setMobileMenuOpen,
    lastOrderReceipt,
    setLastOrderReceipt,
    selectedOrderForModal,
    setSelectedOrderForModal
  } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'pos':
        return <PosScreen />;
      case 'overview':
        return <OverviewScreen />;
      case 'orders':
        return <OrderQueueScreen />;
      case 'catalog':
        return <CatalogScreen />;
      case 'pricing':
        return <PricingEngineScreen />;
      case 'customers':
        return <CustomersScreen />;
      case 'reviews':
        return <ReviewsScreen />;
      case 'revenue':
        return <RevenueDeskScreen />;
      case 'payouts':
        return <PayoutsScreen />;
      case 'tax':
        return <TaxEngineScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'live-monitor':
        return <LiveMonitorScreen />;
      case 'alerts':
        return <AlertsScreen />;
      default:
        return <PosScreen />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-zinc-900 font-sans antialiased">
      {/* 1. Desktop Left Sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[260px] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar forceExpanded />
          </div>
        </div>
      )}

      {/* 2. Main Center Content Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden flex flex-col">
          {renderActiveScreen()}
        </main>
      </div>

      {/* 3. Desktop Right Cart Panel (Always present on POS screen, matching 3-column layout) */}
      {currentScreen === 'pos' && (
        <div className="hidden lg:flex h-full shrink-0">
          <CartPanel />
        </div>
      )}

      {/* Modals & Mobile Sheets */}
      {lastOrderReceipt && (
        <ReceiptModal
          order={lastOrderReceipt}
          onClose={() => setLastOrderReceipt(null)}
        />
      )}

      {selectedOrderForModal && (
        <ReceiptModal
          order={selectedOrderForModal}
          onClose={() => setSelectedOrderForModal(null)}
        />
      )}

      <EndShiftModal />
      <MobileCartDrawer />
      <ManualPaymentModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
