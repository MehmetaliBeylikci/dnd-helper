// Inventory Item Types

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number; // in pounds
  description?: string;
  value?: {
    amount: number;
    currency: 'cp' | 'sp' | 'gp' | 'pp'; // copper, silver, gold, platinum
  };
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

export interface InventoryFormData {
  name: string;
  quantity: number;
  weight: number;
  description?: string;
}
