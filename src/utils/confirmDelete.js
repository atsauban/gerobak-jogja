/**
 * Confirm Delete Utility
 * Helper function to show confirmation dialog
 */

export const confirmDelete = (itemName, itemType = 'item') => {
  return window.confirm(`Yakin ingin menghapus ${itemType} "${itemName}"?`);
};

