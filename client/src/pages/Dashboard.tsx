import React, { useState } from 'react';
import SummaryCard from '@/components/cards/SummaryCard';
import WeightTrendsCard from '@/components/cards/WeightTrendsCard';
import WaterIntakeCard from '@/components/cards/WaterIntakeCard';
import SleepLogCard from '@/components/cards/SleepLogCard';
import AddWeightEntryModal from '@/components/modals/AddWeightEntryModal';
import AddSleepEntryModal from '@/components/modals/AddSleepEntryModal';
import AddWaterCustomModal from '@/components/modals/AddWaterCustomModal';
import { useHealthData } from '@/contexts/HealthDataContext';

export default function Dashboard() {
  const { healthData } = useHealthData();
  const [editingSleepEntry, setEditingSleepEntry] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    waterCustom: boolean;
    sleep: boolean;
  }>({
    waterCustom: false,
    sleep: false
  });
  
  const handleAddWater = () => {
    setModalState(prev => ({ ...prev, waterCustom: true }));
  };
  
  const handleAddSleep = () => {
    setEditingSleepEntry(null);
    setModalState(prev => ({ ...prev, sleep: true }));
  };
  
  const handleEditSleep = (id: string) => {
    setEditingSleepEntry(id);
    setModalState(prev => ({ ...prev, sleep: true }));
  };
  
  const handleCloseModal = (modal: 'waterCustom' | 'sleep') => {
    setModalState(prev => ({ ...prev, [modal]: false }));
    if (modal === 'sleep') {
      setEditingSleepEntry(null);
    }
  };
  
  // Find the sleep entry being edited
  const sleepEntryToEdit = editingSleepEntry 
    ? healthData.sleepEntries.find(entry => entry.id === editingSleepEntry) 
    : undefined;
  
  return (
    <div className="container mx-auto px-4 py-4">
      <SummaryCard />
      <WeightTrendsCard />
      <WaterIntakeCard onOpenCustomModal={handleAddWater} />
      <SleepLogCard 
        onAddEntry={handleAddSleep} 
        onEditEntry={handleEditSleep}
      />
      
      {/* Modals */}
      <AddWaterCustomModal
        isOpen={modalState.waterCustom}
        onClose={() => handleCloseModal('waterCustom')}
      />
      
      <AddSleepEntryModal
        isOpen={modalState.sleep}
        onClose={() => handleCloseModal('sleep')}
        editEntry={sleepEntryToEdit}
      />
    </div>
  );
}
