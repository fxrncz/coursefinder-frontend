'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { localGeorama } from '../../fonts';
import { ShieldCheck, LogOut, Users, TrendingUp, Award, BookOpen, Briefcase, UserCheck, Calendar } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiUrl } from '../../../lib/api';

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const storedAdminData = localStorage.getItem('adminData');
    if (!storedAdminData) {
      router.push('/admin/login');
      return;
    }

    try {
      const admin = JSON.parse(storedAdminData);
      setAdminData(admin);
      
      // Fetch dashboard statistics
      fetchDashboardStatistics();
    } catch (error) {
      console.error('Error parsing admin data:', error);
      localStorage.removeItem('adminData');
      router.push('/admin/login');
    }
  }, [router]);

  const fetchDashboardStatistics = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/dashboard/statistics'));
      const data = await response.json();

      if (data.success) {
        setStatistics(data.data);
        console.log('Dashboard statistics:', data.data);
      } else {
        setError(data.message || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002A3C] mx-auto mb-4"></div>
          <p className={`${localGeorama.className} text-[#002A3C] text-lg`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
        <div className="text-center">
          <p className={`${localGeorama.className} text-red-600 text-lg mb-4`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`${localGeorama.className} bg-[#002A3C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#004E70] transition-colors`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const mbtiChartData = statistics?.topMbtiTypes?.map((item: any) => ({
    name: item.type,
    count: item.count
  })) || [];

  const riasecChartData = statistics?.topRiasecCodes?.map((item: any) => ({
    name: item.code,
    count: item.count
  })) || [];

  const coursesChartData = statistics?.topCourses?.slice(0, 8).map((item: any) => ({
    name: item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name,
    count: item.count
  })) || [];

  const careersChartData = statistics?.topCareers?.slice(0, 8).map((item: any) => ({
    name: item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name,
    count: item.count
  })) || [];

  const plmarData = [
    { name: 'From PLMar', value: statistics?.plmarStudents || 0, color: '#002A3C' },
    { name: 'Not from PLMar', value: statistics?.nonPlmarStudents || 0, color: '#FFA726' }
  ];

  // Age distribution chart data
  const ageChartData = statistics?.ageDistributionChart?.map((item: any) => ({
    name: item.ageGroup,
    count: item.count
  })) || [];

  // Gender distribution chart data
  const genderChartData = statistics?.genderDistributionChart?.map((item: any) => ({
    name: item.gender,
    count: item.count
  })) || [];

  const COLORS = ['#002A3C', '#004E70', '#0077B6', '#00B4D8', '#90E0EF', '#ADE8F4', '#CAF0F8', '#E0F7FA'];
  const GENDER_COLORS = ['#0077B6', '#FFA726', '#90E0EF', '#FF6B9D'];

  return (
    <div className="min-h-screen bg-[#FFF4E6]">
      {/* Header */}
      <header className="bg-[#002A3C] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            {/* Logo and Title Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <div>
                <h1 className={`${localGeorama.className} text-lg sm:text-2xl font-bold`}>
                  Admin Dashboard
                </h1>
                <p className={`${localGeorama.className} text-xs sm:text-sm opacity-75`}>
                  CourseFinder Analytics
                </p>
              </div>
            </div>
            
            {/* Admin Info and Logout Section */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 sm:space-x-4">
              {/* Admin Info - Hidden on very small screens, visible on larger */}
              <div className="text-left sm:text-right max-w-[180px] sm:max-w-none truncate">
                <p className={`${localGeorama.className} text-xs sm:text-sm font-semibold truncate`}>
                  {adminData?.fullName || adminData?.username || 'Administrator'}
                </p>
                <p className={`${localGeorama.className} text-[10px] sm:text-xs opacity-75 truncate hidden sm:block`}>
                  {adminData?.email}
                </p>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`${localGeorama.className} flex items-center space-x-1 sm:space-x-2 bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex-shrink-0`}
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">Logout</span>
                <span className="xs:hidden sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Results Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-[#002A3C]">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${localGeorama.className} text-gray-600 text-sm font-semibold`}>Total Test Results</p>
                <p className={`${localGeorama.className} text-3xl font-bold text-[#002A3C] mt-2`}>
                  {statistics?.totalResults || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#002A3C] opacity-20" />
            </div>
          </div>

          {/* PLMar Students Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${localGeorama.className} text-gray-600 text-sm font-semibold`}>PLMar Students</p>
                <p className={`${localGeorama.className} text-3xl font-bold text-green-600 mt-2`}>
                  {statistics?.plmarStudents || 0}
                </p>
                <p className={`${localGeorama.className} text-xs text-gray-500 mt-1`}>
                  {statistics?.totalResults ? Math.round((statistics.plmarStudents / statistics.totalResults) * 100) : 0}% of total
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          {/* Average Age Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-[#0077B6]">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${localGeorama.className} text-gray-600 text-sm font-semibold`}>Average Age</p>
                <p className={`${localGeorama.className} text-3xl font-bold text-[#0077B6] mt-2`}>
                  {statistics?.averageAge || 0} years
                </p>
                <p className={`${localGeorama.className} text-xs text-gray-500 mt-1`}>
                  {statistics?.totalWithAge || 0} students with age data
                </p>
              </div>
              <Calendar className="w-12 h-12 text-[#0077B6] opacity-20" />
            </div>
          </div>
        </div>

        {/* PLMar Distribution Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4 flex items-center`}>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              PLMar Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={plmarData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {plmarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Demographics Summary */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:col-span-2">
            <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4`}>
              Key Insights
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className={`${localGeorama.className} text-sm font-semibold text-blue-900 mb-2`}>
                  🏆 Most Common MBTI Type
                </p>
                <p className={`${localGeorama.className} text-2xl font-bold text-blue-600`}>
                  {statistics?.topMbtiTypes?.[0]?.type || 'N/A'} ({statistics?.topMbtiTypes?.[0]?.count || 0} students)
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className={`${localGeorama.className} text-sm font-semibold text-purple-900 mb-2`}>
                  🎯 Most Common RIASEC Code
                </p>
                <p className={`${localGeorama.className} text-2xl font-bold text-purple-600`}>
                  {statistics?.topRiasecCodes?.[0]?.code || 'N/A'} ({statistics?.topRiasecCodes?.[0]?.count || 0} students)
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className={`${localGeorama.className} text-sm font-semibold text-green-900 mb-2`}>
                  📚 Most Popular Course
                </p>
                <p className={`${localGeorama.className} text-lg font-bold text-green-600`}>
                  {statistics?.topCourses?.[0]?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Section - Age and Gender */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Age Distribution Chart */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4 flex items-center`}>
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Age Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0077B6" name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className={`${localGeorama.className} text-sm text-gray-700`}>
                <span className="font-semibold text-[#0077B6]">Average Age:</span> {statistics?.averageAge || 0} years
              </p>
              <p className={`${localGeorama.className} text-xs text-gray-500 mt-1`}>
                Based on {statistics?.totalWithAge || 0} students with age data
              </p>
            </div>
          </div>

          {/* Gender Distribution Chart */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4 flex items-center`}>
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Gender Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {genderChartData.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: GENDER_COLORS[index % GENDER_COLORS.length] }}
                    ></div>
                    <span className={`${localGeorama.className} text-sm font-semibold`}>{item.name}</span>
                  </div>
                  <span className={`${localGeorama.className} text-sm text-gray-600`}>
                    {item.count} ({statistics?.totalResults ? Math.round((item.count / statistics.totalResults) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MBTI Distribution Chart */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4 flex items-center`}>
            <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Top 5 MBTI Personality Types
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mbtiChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#002A3C" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RIASEC Distribution Chart */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4 flex items-center`}>
            <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Top 5 RIASEC Interest Codes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riasecChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0077B6" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Courses Chart */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4 flex items-center`}>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Top 8 Most Recommended Courses
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={coursesChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00B4D8" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Careers Chart */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className={`${localGeorama.className} text-lg sm:text-xl font-bold text-[#002A3C] mb-4 flex items-center`}>
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Top 8 Most Recommended Careers
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={careersChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#90E0EF" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
