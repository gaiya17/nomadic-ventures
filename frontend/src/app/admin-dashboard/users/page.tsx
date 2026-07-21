"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, Plus, Edit2, Trash2, X, Shield, Mail, Lock, User, Calendar
} from "lucide-react";
import { PageLoader } from "@/components/PageLoader";

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user: any = null) => {
    if (user) {
      setEditingId(user.id);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role || "admin");
      setPassword(""); // Don't show password on edit
    } else {
      setEditingId(null);
      setName("");
      setEmail("");
      setRole("admin");
      setPassword("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingId) {
        const payload: any = { name, email, role };
        if (password) payload.password = password; // Only send password if updated

        await axios.put(`/api/admin/users/${editingId}`, payload);
        toast.success("User updated successfully!");
      } else {
        if (!name || !email || !password) {
          toast.error("Name, email and password are required.");
          setIsSaving(false);
          return;
        }
        await axios.post("/api/admin/users", { name, email, password, role });
        toast.success("User created successfully!");
      }
      closeModal();
      fetchUsers();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || "Failed to save user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        toast.success("User deleted successfully.");
        fetchUsers();
      } catch (e) {
        console.error(e);
        toast.error("Failed to delete user.");
      }
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#030213] tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1">Manage system administrators and their permissions.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#F4B942] hover:bg-[#F4B942]/90 text-black px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#F4B942]/20"
        >
          <Plus size={18} />
          Add New Admin
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#030213] text-white flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[#030213]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <Shield size={12} />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => openModal(u)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === currentUser?.id}
                        className={`p-2 rounded-lg transition-colors ${
                          u.id === currentUser?.id 
                            ? "text-gray-300 cursor-not-allowed" 
                            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title={u.id === currentUser?.id ? "Cannot delete yourself" : "Delete User"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No administrators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#030213]">
                {editingId ? "Edit Administrator" : "Add Administrator"}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#030213]">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4B942] focus:border-[#F4B942] outline-none transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#030213]">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4B942] focus:border-[#F4B942] outline-none transition-all text-sm"
                    placeholder="admin@nomadicventures.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#030213]">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Shield size={16} />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4B942] focus:border-[#F4B942] outline-none transition-all text-sm appearance-none"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Administrator</option>
                    <option value="editor">Content Editor</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#030213]">
                  {editingId ? "New Password (Optional)" : "Password"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!editingId}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4B942] focus:border-[#F4B942] outline-none transition-all text-sm"
                    placeholder={editingId ? "Leave blank to keep current password" : "••••••••"}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#030213] rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 px-4 bg-[#F4B942] hover:bg-[#F4B942]/90 text-black rounded-xl font-semibold transition-all shadow-lg shadow-[#F4B942]/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Save Admin"
                  )}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
