import React from 'react';
import { Settings, Download } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenExportImport: () => void;
}

export default function Header({ onOpenSettings, onOpenExportImport }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm py-4 px-4 flex justify-between items-center">
      <h1 className="text-xl font-medium text-foreground">HealthTrack</h1>
      <div className="flex items-center space-x-3">
        <button onClick={onOpenSettings} className="text-muted-foreground">
          <Settings className="h-5 w-5" />
        </button>
        <button onClick={onOpenExportImport} className="text-muted-foreground">
          <Download className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
