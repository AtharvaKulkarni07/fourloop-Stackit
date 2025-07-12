'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question, User } from '@/types';
import { Shield, Users, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    pendingQuestions: 0,
    todayQuestions: 0
  });
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      // Fetch admin data
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    // This would fetch real admin data from your API
    // For now, using mock data
    setStats({
      totalUsers: 152,
      totalQuestions: 1247,
      pendingQuestions: 3,
      todayQuestions: 24
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access the admin dashboard.
        </p>
        <Button asChild>
          <Link href="/">Browse Questions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage users, content, and platform settings
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Administrator
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              +24 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuestions}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayQuestions}</div>
            <p className="text-xs text-muted-foreground">
              Questions asked today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>
              Review and moderate questions and answers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Questions</span>
                <Badge variant="destructive">{stats.pendingQuestions}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reported Content</span>
                <Badge variant="secondary">0</Badge>
              </div>
            </div>
            <Button className="w-full">Review Content</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users</span>
                <Badge variant="secondary">{stats.totalUsers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Guest Users</span>
                <Badge variant="outline">15</Badge>
              </div>
            </div>
            <Button className="w-full" variant="outline">Manage Users</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest questions and user activity on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Recent activity will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}