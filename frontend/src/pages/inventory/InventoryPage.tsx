import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInventory } from "../../hooks/useInventory";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Package,
  Calendar,
  Tag,
  ChefHat,
  ChevronRight,
  Calculator,
  AlertCircle,
} from "lucide-react";
import { InventoryItem, Unit, InventoryCategory } from "@recipe-planner/shared";
import { useToast } from "../../components/feedback/Toast";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

const COMMON_UNITS: Unit[] = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "pcs",
  "oz",
  "lb",
];

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

  const [formData, setFormData] = useState({
    name: "",
    amount: 1,
    unit: "pcs" as Unit,
    category: InventoryCategory.Other,
    expiryDate: "",
  });

  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  const stats = {
    total: inventory.length,
    expired: inventory.filter(
      (i) => i.expiryDate && new Date(i.expiryDate) < now,
    ).length,
    expiringSoon: inventory.filter((i) => {
      if (!i.expiryDate) return false;
      const d = new Date(i.expiryDate);
      return d >= now && d <= threeDaysFromNow;
    }).length,
  };

  const filteredItems = inventory
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
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      addToast("Please enter an item name", "error");
      return;
    }

    try {
      if (editingItem) {
        await updateInventoryItem({
          id: editingItem.id,
          updates: formData,
        }).unwrap();
        addToast("Item updated successfully", "success");
      } else {
        await addInventoryItem(formData).unwrap();
        addToast("Item added successfully", "success");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        name: "",
        amount: 1,
        unit: "pcs",
        category: InventoryCategory.Other,
        expiryDate: "",
      });
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
    setFormData({
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
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
            Pantry Manager
          </h1>
          <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">
            {inventory.length} Essentials in Stock
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              name: "",
              amount: 1,
              unit: "pcs",
              category: InventoryCategory.Other,
              expiryDate: "",
            });
            setIsModalOpen(true);
          }}
          className="btn-primary shadow-lg shadow-indigo-100 flex items-center gap-2 h-14 px-8 rounded-2xl"
        >
          <Plus size={24} strokeWidth={3} />
          <span className="font-black">Add New Stock</span>
        </Button>
      </div>

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

      {/* Smart Summary Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Total Essentials
            </p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
              Expiring Soon
            </p>
            <p className="text-3xl font-black text-gray-900">
              {stats.expiringSoon}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
              Stale / Expired
            </p>
            <p className="text-3xl font-black text-gray-900">{stats.expired}</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[72px] z-30 py-2 bg-gray-50/80 backdrop-blur-md">
        {/* Modern Search */}
        <div className="relative group w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-indigo-500 transition-colors group-focus-within:text-indigo-600">
            <Search size={18} strokeWidth={3} />
          </div>
          <input
            type="text"
            placeholder="Search stock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-transparent rounded-[20px] shadow-sm outline-none focus:border-indigo-600/10 focus:ring-4 focus:ring-indigo-600/5 transition-all font-bold text-sm text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 gap-1 w-full md:w-auto">
          {[
            { id: "all", label: "All Items" },
            { id: "soon", label: "Expiring Soon" },
            { id: "expired", label: "Expired" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as "all" | "expired" | "soon")}
              className={`
                flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${
                  filter === t.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-900 leading-tight tracking-tight capitalize">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-indigo-600 font-black text-sm">
                        {item.amount}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <div className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 flex items-center gap-1.5">
                  <Tag
                    size={12}
                    strokeWidth={2.5}
                    className="text-indigo-400"
                  />
                  {item.category || "Other"}
                </div>
                {item.expiryDate && (
                  <div
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
                      new Date(item.expiryDate) < new Date()
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    <Calendar size={12} strokeWidth={2.5} />
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-50">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
                >
                  <Edit2 size={16} strokeWidth={2.5} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-gray-100 rounded-[40px]">
            <Package size={48} className="text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-900 mb-2 italic">
              Nothing here yet
            </h3>
            <p className="text-gray-400 font-bold max-w-xs mx-auto">
              Your pantry is looking a bit empty. Start tracking your
              ingredients!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Update Essentials" : "Add to Pantry"}
        size="md"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-12 rounded-2xl font-bold border-gray-100"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isAdding}
              className="flex-1 btn-primary h-12 rounded-2xl font-black shadow-lg shadow-indigo-100"
            >
              {editingItem ? "Update Stock" : "Add Stock"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Ingredient Name
            </label>
            <div className="relative">
              <ChefHat
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="e.g. Organic Milk"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Amount
              </label>
              <div className="relative">
                <Calculator
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  step="any"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Measurement
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value as Unit })
                }
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all cursor-pointer"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as InventoryCategory,
                })
              }
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all cursor-pointer"
            >
              {Object.values(InventoryCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Expiry Warning
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600/10 transition-all"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
