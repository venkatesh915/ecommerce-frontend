import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi, loginSchema, type LoginFormData } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { useForm as useReactHookForm } from 'react-hook-form';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useReactHookForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Assuming data returns access_token
      try {
        setAuth({ id: 0, email: '', full_name: '', role: 'user' }, data.access_token);
        // Await the fetchUser call to ensure profile is loaded before navigating
        await useAuthStore.getState().fetchUser();
        toast.success('Logged in successfully!');
        navigate('/');
      } catch (err) {
        toast.error('Failed to fetch user profile.');
      }
    },
    onError: () => {
      toast.error('Invalid email or password');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-orange-600 font-medium hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
