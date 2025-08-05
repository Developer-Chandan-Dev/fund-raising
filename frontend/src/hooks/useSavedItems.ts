// hooks/useSavedItems.ts
import { useContext } from 'react';
import { SavedItemsContext } from '@/context/SavedItemsContext';
import { type SavedItemsContextType } from '@/types/savedItems';

export const useSavedItems = (): SavedItemsContextType => {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};