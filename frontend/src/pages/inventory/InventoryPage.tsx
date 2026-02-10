import React, { useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import {
  InventoryItem,
  Unit,
  InventoryCategory,
  createInventoryItemSchema,
  CreateInventoryInput,
} from "@recipe-planner/shared";
import { useToast } from "../../components/feedback/Toast";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useAppForm } from "../../hooks/useAppForm";
import { InventoryStats } from "../../components/inventory/InventoryStats";
import { InventoryFilters } from "../../components/inventory/InventoryFilters";
import { InventoryItemCard } from "../../components/inventory/InventoryItemCard";
import { InventoryHeader } from "../../components/inventory/InventoryHeader";
import { InventoryEmptyState } from "../../components/inventory/InventoryEmptyState";
import { InventoryFormModal } from "../../components/inventory/InventoryFormModal";

const InventoryPage = () => {
  const { addToast } = useToast();
  const {
    inventory,
    isLoading,
    isError,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    isAdding,
    error,
  } = useInventory();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "expired" | "soon">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useAppForm({
    schema: createInventoryItemSchema,
    defaultValues: {
      name: "",
      amount: 1,
      unit: "pcs" as Unit,
      category: InventoryCategory.Other,
      expiryDate: "",
    },
  });

  const { now, threeDaysFromNow } = React.useMemo(() => {
    const n = new Date();
    const t = new Date(n);
    t.setDate(n.getDate() + 3);
    return { now: n, threeDaysFromNow: t };
  }, []);

  const stats = React.useMemo(
    () => ({
      total: inventory.length,
      expired: inventory.filter(
        (i) => i.expiryDate && new Date(i.expiryDate) < now,
      ).length,
      expiringSoon: inventory.filter((i) => {
        if (!i.expiryDate) return false;
        const d = new Date(i.expiryDate);
        return d >= now && d <= threeDaysFromNow;
      }).length,
    }),
    [inventory, now, threeDaysFromNow],
  );

  const filteredItems = React.useMemo(
    () =>
      inventory
        .filter((item) => {
          const matchesSearch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());
          if (!matchesSearch) return false;

          if (filter === "expired")
            return item.expiryDate && new Date(item.expiryDate) < now;
          if (filter === "soon") {
            if (!item.expiryDate) return false;
            const d = new Date(item.expiryDate);
            return d >= now && d <= threeDaysFromNow;
          }
          return true;
        })
        .sort((a, b) => {
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return (
            new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
          );
        }),
    [inventory, search, filter, now, threeDaysFromNow],
  );

  const onSubmit = async (data: CreateInventoryInput) => {
    try {
      if (editingItem) {
        await updateInventoryItem({
          id: editingItem.id,
          updates: data,
        }).unwrap();
        addToast("Item updated successfully", "success");
      } else {
        await addInventoryItem(data).unwrap();
        addToast("Item added successfully", "success");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      reset();
    } catch (err) {
      addToast(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to save item",
        "error",
      );
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    reset({
      name: item.name,
      amount: item.amount,
      unit: item.unit as Unit,
      category: (item.category as InventoryCategory) || InventoryCategory.Other,
      expiryDate: item.expiryDate
        ? new Date(item.expiryDate).toISOString().split("T")[0]
        : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteInventoryItem(itemToDelete).unwrap();
      addToast("Item deleted", "success");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      addToast("Failed to delete item", "error");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <Alert variant="error">
          {(error as { data?: { message?: string } })?.data?.message ||
            "Failed to load inventory. Please check your connection."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <InventoryHeader
        itemCount={inventory.length}
        onAddClick={() => {
          setEditingItem(null);
          reset();
          setIsModalOpen(true);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remove Item"
        message="Are you sure you want to remove this item from your pantry? This cannot be undone."
        confirmLabel="Remove"
      />

      <InventoryStats stats={stats} />

      <InventoryFilters
        search={search}
        onSearchChange={setSearch}
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {filteredItems.length === 0 && <InventoryEmptyState />}
      </div>

      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmit}
        isEditing={!!editingItem}
        isSubmitting={isAdding}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    </div>
  );
};

export default InventoryPage;
