import React from 'react';
import { useLocation } from 'wouter';
import { LayoutDashboard, Weight, Droplets, Moon, Calculator } from 'lucide-react';

interface BottomNavigationProps {
  active: string;
  onOpenBMI: () => void;
}

export default function BottomNavigation({ active, onOpenBMI }: BottomNavigationProps) {
  const [_, setLocation] = useLocation();

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      setLocation('/');
    } else {
      setLocation(`/${view}`);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10">
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === 'dashboard' ? 'bottom-nav-active' : 'text-muted-foreground'}`}
        onClick={() => handleNavigate('dashboard')}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span className="text-xs mt-1">Dashboard</span>
      </button>
      
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === 'weight' ? 'bottom-nav-active' : 'text-muted-foreground'}`}
        onClick={() => handleNavigate('weight')}
      >
        <Weight className="h-5 w-5" />
        <span className="text-xs mt-1">Weight</span>
      </button>
      
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === 'water' ? 'bottom-nav-active' : 'text-muted-foreground'}`}
        onClick={() => handleNavigate('water')}
      >
        <Droplets className="h-5 w-5" />
        <span className="text-xs mt-1">Water</span>
      </button>
      
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === 'sleep' ? 'bottom-nav-active' : 'text-muted-foreground'}`}
        onClick={() => handleNavigate('sleep')}
      >
        <Moon className="h-5 w-5" />
        <span className="text-xs mt-1">Sleep</span>
      </button>
      
      <button 
        className="flex flex-col items-center py-1 px-3 text-muted-foreground"
        onClick={onOpenBMI}
      >
        <Calculator className="h-5 w-5" />
        <span className="text-xs mt-1">BMI</span>
      </button>
    </nav>
  );
}
