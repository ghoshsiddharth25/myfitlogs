import React, { ReactNode, useState } from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import AddWeightEntryModal from './modals/AddWeightEntryModal';
import AddSleepEntryModal from './modals/AddSleepEntryModal';
import BMICalculatorModal from './modals/BMICalculatorModal';
import AddWaterCustomModal from './modals/AddWaterCustomModal';
import SettingsModal from './modals/SettingsModal';
import ExportImportModal from './modals/ExportImportModal';
import { useLocation } from 'wouter';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onOpenSettings={() => openModal('settings')} 
        onOpenExportImport={() => openModal('exportImport')} 
      />
      
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      <BottomNavigation 
        active={location === '/' ? 'dashboard' : location.substring(1)} 
        onOpenBMI={() => openModal('bmi')}
      />
      
      {/* Floating Action Button */}
      <button 
        className="fixed right-4 bottom-20 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10"
        onClick={() => {
          if (location === '/water') {
            openModal('waterCustom');
          } else if (location === '/sleep') {
            openModal('sleep');
          } else {
            openModal('weight');
          }
        }}
      >
        <span className="material-icons text-2xl">add</span>
      </button>
      
      {/* Modals */}
      <AddWeightEntryModal 
        isOpen={activeModal === 'weight'} 
        onClose={closeModal} 
      />
      
      <AddSleepEntryModal 
        isOpen={activeModal === 'sleep'} 
        onClose={closeModal} 
      />
      
      <BMICalculatorModal 
        isOpen={activeModal === 'bmi'} 
        onClose={closeModal} 
      />
      
      <AddWaterCustomModal 
        isOpen={activeModal === 'waterCustom'} 
        onClose={closeModal} 
      />
      
      <SettingsModal 
        isOpen={activeModal === 'settings'} 
        onClose={closeModal} 
      />
      
      <ExportImportModal 
        isOpen={activeModal === 'exportImport'} 
        onClose={closeModal} 
      />
    </div>
  );
}
