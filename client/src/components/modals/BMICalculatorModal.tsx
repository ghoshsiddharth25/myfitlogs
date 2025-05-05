import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { calcBMI, getBMICategory, getBMICategoryColor } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BMI_CATEGORIES = [
  { category: 'Underweight', min: 0, max: 18.5, color: 'bg-secondary' },
  { category: 'Normal', min: 18.5, max: 25, color: 'bg-success' },
  { category: 'Overweight', min: 25, max: 30, color: 'bg-warning' },
  { category: 'Obese', min: 30, max: 100, color: 'bg-destructive' }
];

export default function BMICalculatorModal({ isOpen, onClose }: BMICalculatorModalProps) {
  const { healthData, updateSettings } = useHealthData();
  const { settings, weights } = healthData;
  
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  
  // Initialize with user's data if available
  useEffect(() => {
    if (isOpen) {
      setHeight(settings.height.toString());
      if (weights.length > 0) {
        setWeight(weights[0].weight.toString());
      } else {
        setWeight('');
      }
    }
  }, [isOpen, settings.height, weights]);
  
  // Calculate BMI when inputs change
  useEffect(() => {
    if (height && weight) {
      const calculatedBMI = calcBMI(
        parseFloat(weight), 
        parseFloat(height), 
        settings.heightUnit as 'cm' | 'in' | 'm',
        settings.weightUnit as 'kg' | 'lb'
      );
      setBmi(calculatedBMI);
      setCategory(getBMICategory(calculatedBMI));
    } else {
      setBmi(null);
      setCategory('');
    }
  }, [height, weight, settings.heightUnit, settings.weightUnit]);
  
  // Save height to settings when changed
  const handleHeightChange = (value: string) => {
    setHeight(value);
    
    // Update the user settings with new height
    if (value && !isNaN(parseFloat(value))) {
      const newSettings = { ...settings, height: parseFloat(value) };
      updateSettings(newSettings);
    }
  };
  
  // Calculate position of BMI marker on the scale
  const getMarkerPosition = () => {
    if (bmi === null) return '0%';
    
    // Scale positions
    if (bmi < 18.5) {
      return `${(bmi / 18.5) * 25}%`;
    } else if (bmi < 25) {
      return `${25 + ((bmi - 18.5) / 6.5) * 25}%`;
    } else if (bmi < 30) {
      return `${50 + ((bmi - 25) / 5) * 25}%`;
    } else {
      return '75%';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md mx-4 rounded-lg">
        <DialogHeader className="flex justify-between items-center px-0">
          <DialogTitle className="text-lg font-medium">BMI Calculator</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="height" className="text-muted-foreground text-sm mb-1">Height ({settings.heightUnit})</Label>
              <Input 
                type="number" 
                id="height" 
                value={height} 
                onChange={e => handleHeightChange(e.target.value)}
                min={
                  settings.heightUnit === 'cm' ? 100 : 
                  settings.heightUnit === 'in' ? 40 : 
                  1.0 // for meters
                } 
                max={
                  settings.heightUnit === 'cm' ? 250 : 
                  settings.heightUnit === 'in' ? 100 : 
                  2.5 // for meters
                } 
                step={settings.heightUnit === 'm' ? "0.01" : "0.1"}
                placeholder={
                  settings.heightUnit === 'cm' ? "175" : 
                  settings.heightUnit === 'in' ? "69" : 
                  "1.75" // for meters
                }
                className="focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <Label htmlFor="bmiWeight" className="text-muted-foreground text-sm mb-1">Weight ({settings.weightUnit})</Label>
              <Input 
                type="number" 
                id="bmiWeight" 
                value={weight} 
                onChange={e => setWeight(e.target.value)}
                step="0.1"
                min={settings.weightUnit === 'kg' ? 20 : 44} 
                max={settings.weightUnit === 'kg' ? 300 : 660}
                placeholder={settings.weightUnit === 'kg' ? "75" : "165"}
                className="focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-background rounded-lg">
            <div className="text-center mb-2">Your BMI</div>
            <div className="text-3xl font-medium text-center mb-2">
              {bmi !== null ? bmi.toFixed(1) : '-'}
            </div>
            {category && (
              <div className={`text-center font-medium ${getBMICategoryColor(category as any)}`}>
                {category}
              </div>
            )}
            
            <div className="mt-4 relative h-3 bg-gray-200 rounded-full">
              {/* BMI Categories */}
              <div className="absolute h-3 bg-secondary rounded-l-full" style={{ width: '25%', left: '0%' }}></div>
              <div className="absolute h-3 bg-success" style={{ width: '25%', left: '25%' }}></div>
              <div className="absolute h-3 bg-warning" style={{ width: '25%', left: '50%' }}></div>
              <div className="absolute h-3 bg-destructive rounded-r-full" style={{ width: '25%', left: '75%' }}></div>
              
              {/* BMI Marker */}
              {bmi !== null && (
                <div 
                  className="absolute w-3 h-6 bg-foreground rounded-full -top-1.5"
                  style={{ left: getMarkerPosition() }}
                ></div>
              )}
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4 text-sm text-muted-foreground">
            <p>BMI Categories:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Underweight: Below 18.5</li>
              <li>Normal weight: 18.5 - 24.9</li>
              <li>Overweight: 25 - 29.9</li>
              <li>Obesity: 30 or higher</li>
            </ul>
          </div>
          
          <DialogFooter className="flex justify-end">
            <Button className="bg-primary text-white" onClick={onClose}>Done</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
