'use client';

import { useSettings } from '@/context/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const {
    currency,
    monthlyBudget,
    setCurrency,
    setMonthlyBudget,
    saveSettings,
    resetSettings,
  } = useSettings();
  const { toast } = useToast();

  const handleSave = () => {
    saveSettings();
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const handleReset = () => {
    resetSettings();
    toast({
      title: 'Settings reset',
      description: 'Your preferences have been reset to default values.',
    });
  };

  return (
    <div className="container max-w-2xl mt-24 flex flex-col min-h-[80vh] justify-center">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">
        Customize your expense tracking experience
      </p>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Application Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your preferences for the expense tracker
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHP">PHP - Philippine Peso</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose the currency for displaying amounts
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Budget</label>
              <Input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                placeholder="Enter your monthly budget"
              />
              <p className="text-sm text-muted-foreground">
                Set your monthly budget limit for expense tracking
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
} 