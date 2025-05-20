'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface SettingsContextType {
  currency: string;
  monthlyBudget: number;
  darkMode: boolean;
  useBudgetRule: boolean;
  necessitiesPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
  setCurrency: (currency: string) => void;
  setMonthlyBudget: (budget: number) => void;
  setDarkMode: (enabled: boolean) => void;
  setUseBudgetRule: (enabled: boolean) => void;
  setNecessitiesPercentage: (percentage: number) => void;
  setWantsPercentage: (percentage: number) => void;
  setSavingsPercentage: (percentage: number) => void;
  saveSettings: () => void;
  resetSettings: () => void;
  getBudgetAllocations: () => { necessities: number; wants: number; savings: number };
}

const defaultSettings = {
  currency: 'PHP',
  monthlyBudget: 2000,
  darkMode: false,
  useBudgetRule: true,
  necessitiesPercentage: 70,
  wantsPercentage: 20,
  savingsPercentage: 10,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [currency, setCurrency] = useState(defaultSettings.currency);
  const [monthlyBudget, setMonthlyBudget] = useState(defaultSettings.monthlyBudget);
  const [darkMode, setDarkMode] = useState(defaultSettings.darkMode);
  const [useBudgetRule, setUseBudgetRule] = useState(defaultSettings.useBudgetRule);
  const [necessitiesPercentage, setNecessitiesPercentage] = useState(defaultSettings.necessitiesPercentage);
  const [wantsPercentage, setWantsPercentage] = useState(defaultSettings.wantsPercentage);
  const [savingsPercentage, setSavingsPercentage] = useState(defaultSettings.savingsPercentage);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('expense-tracker-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCurrency(settings.currency);
      setMonthlyBudget(settings.monthlyBudget);
      setDarkMode(settings.darkMode);
      setUseBudgetRule(settings.useBudgetRule !== undefined ? settings.useBudgetRule : defaultSettings.useBudgetRule);
      setNecessitiesPercentage(settings.necessitiesPercentage || defaultSettings.necessitiesPercentage);
      setWantsPercentage(settings.wantsPercentage || defaultSettings.wantsPercentage);
      setSavingsPercentage(settings.savingsPercentage || defaultSettings.savingsPercentage);
      setTheme(settings.darkMode ? 'dark' : 'light');
    }
  }, [setTheme]);

  const getBudgetAllocations = () => {
    if (!useBudgetRule) {
      return { necessities: monthlyBudget, wants: 0, savings: 0 };
    }
    
    return {
      necessities: (monthlyBudget * necessitiesPercentage) / 100,
      wants: (monthlyBudget * wantsPercentage) / 100,
      savings: (monthlyBudget * savingsPercentage) / 100
    };
  };

  const saveSettings = () => {
    const settings = {
      currency,
      monthlyBudget,
      darkMode,
      useBudgetRule,
      necessitiesPercentage,
      wantsPercentage,
      savingsPercentage,
    };
    localStorage.setItem('expense-tracker-settings', JSON.stringify(settings));
    setTheme(darkMode ? 'dark' : 'light');
  };

  const resetSettings = () => {
    setCurrency(defaultSettings.currency);
    setMonthlyBudget(defaultSettings.monthlyBudget);
    setDarkMode(defaultSettings.darkMode);
    setUseBudgetRule(defaultSettings.useBudgetRule);
    setNecessitiesPercentage(defaultSettings.necessitiesPercentage);
    setWantsPercentage(defaultSettings.wantsPercentage);
    setSavingsPercentage(defaultSettings.savingsPercentage);
    setTheme(defaultSettings.darkMode ? 'dark' : 'light');
    localStorage.removeItem('expense-tracker-settings');
  };

  return (
    <SettingsContext.Provider
      value={{
        currency,
        monthlyBudget,
        darkMode,
        useBudgetRule,
        necessitiesPercentage,
        wantsPercentage,
        savingsPercentage,
        setCurrency,
        setMonthlyBudget,
        setDarkMode,
        setUseBudgetRule,
        setNecessitiesPercentage,
        setWantsPercentage,
        setSavingsPercentage,
        saveSettings,
        resetSettings,
        getBudgetAllocations,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 