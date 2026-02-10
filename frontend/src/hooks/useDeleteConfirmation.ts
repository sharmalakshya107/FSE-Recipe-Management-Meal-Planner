import { useState, useCallback } from "react";

export const useDeleteConfirmation = <T = string>() => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const requestDelete = useCallback((item: T) => {
    setItemToDelete(item);
    setIsDeleting(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setIsDeleting(false);
    setItemToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    const item = itemToDelete;
    cancelDelete();
    return item;
  }, [itemToDelete, cancelDelete]);

  return {
    isDeleting,
    itemToDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
