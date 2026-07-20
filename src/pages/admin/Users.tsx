import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

const Users = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(state => state.user);
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number, role: string }) => adminApi.updateUserRole(userId, role),
    onSuccess: (data) => {
      toast.success(data.message || 'User role updated');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: () => {
      toast.error('Failed to update user role');
    }
  });

  if (isLoading) return <div className="p-8">Loading users...</div>;

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">{user.full_name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'} capitalize inline-block mb-2`}>
                    {user.role}
                  </span>
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updateRoleMutation.isPending || user.id === currentUser?.id || user.id === 1}
                    className="block w-full text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-orange-600 text-sm font-medium transition cursor-not-allowed" disabled>Edit Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
