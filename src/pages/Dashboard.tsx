import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart4, CreditCard, DollarSign, FileText, MoreHorizontal, Settings, TrendingUp, Calendar, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createAdminUser } from "@/utils/create-admin-user";
import { getPages } from "@/utils/supabase-api";
import { PageData } from "@/types/page";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

// Sample data for the chart
const activityData = [{
  day: '06 Jan',
  views: 1000,
  pages: 2400
}, {
  day: '07 Jan',
  views: 1500,
  pages: 2800
}, {
  day: '08 Jan',
  views: 800,
  pages: 2200
}, {
  day: '09 Jan',
  views: 1200,
  pages: 1800
}, {
  day: '10 Jan',
  views: 2000,
  pages: 2400
}, {
  day: '11 Jan',
  views: 2500,
  pages: 3000
}];
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  useEffect(() => {
    // Create admin user on first load
    createAdminUser();
    const fetchPages = async () => {
      setLoading(true);
      try {
        const pagesData = await getPages();
        setPages(pagesData);

        // Calculate total views
        const views = pagesData.reduce((total, page) => total + (page.view_count || 0), 0);
        setTotalViews(views);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Get user's first name
  const firstName = user?.email ? user.email.split('@')[0] : 'User';
  return <DashboardLayout>
      <div className="space-y-6">
        <motion.div className="flex items-center justify-between" initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your pages</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Calendar className="mr-2 h-4 w-4" />
              Jan 6, 2024 - Jan 11, 2024
            </Button>
          </div>
        </motion.div>
        
        {/* Main Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1,
          duration: 0.5
        }}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">
                  Primary Statistics
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle className="text-primary/20" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                      <circle className="text-primary" strokeWidth="10" strokeDasharray={250} strokeDashoffset={100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-bold">{pages.length}</span>
                        <div className="text-xs text-muted-foreground">Pages</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-center">{totalViews}</div>
                <div className="text-xs text-muted-foreground text-center mb-2">Total Views</div>
                <div className="flex items-center justify-center text-sm">
                  <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                  <span className="text-green-500 font-medium">3.4%</span>
                  <span className="text-muted-foreground ml-1">vs. last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2,
          duration: 0.5
        }}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">
                  Secondary Statistics
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle className="text-blue-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                      <circle className="text-blue-500" strokeWidth="10" strokeDasharray={250} strokeDashoffset={210} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-bold">{pages.length > 0 ? Math.round(totalViews / pages.length) : 0}</span>
                        <div className="text-xs text-muted-foreground">Avg Views</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-center">
                  {(pages.filter(p => p.view_count && p.view_count > 0).length / Math.max(pages.length, 1) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground text-center mb-2">Pages with views</div>
                <div className="flex items-center justify-center text-sm">
                  <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                  <span className="text-green-500 font-medium">2.0%</span>
                  <span className="text-muted-foreground ml-1">vs. last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Your Pages / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3,
          duration: 0.5
        }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">Your Pages</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? <p className="text-center text-muted-foreground py-8">Loading pages...</p> : pages.length > 0 ? pages.slice(0, 3).map(page => <div key={page.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded flex items-center justify-center bg-primary text-primary-foreground mr-3">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-xs text-muted-foreground">{page.view_count || 0} views</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold">
                            {(page.view_count || 0) > 0 ? <div className="flex items-center text-green-500">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                {page.view_count || 0}
                              </div> : <span className="text-muted-foreground">No views</span>}
                          </div>
                        </div>
                      </div>) : <p className="text-center text-muted-foreground py-8">No pages found</p>}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/dashboard/pages">View All Pages</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4,
          duration: 0.5
        }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">Activity</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData} margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5
                  }}>
                      <XAxis dataKey="day" tick={{
                      fontSize: 12
                    }} tickLine={false} axisLine={false} />
                      <YAxis hide={true} />
                      <Tooltip contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px"
                    }} />
                      <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} dot={{
                      r: 3
                    }} activeDot={{
                      r: 5
                    }} />
                      <Line type="monotone" dataKey="pages" stroke="#f97316" strokeWidth={2} dot={{
                      r: 3
                    }} activeDot={{
                      r: 5
                    }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 grid grid-cols-3 gap-4 border-t pt-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Average Views</div>
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <span>1,512</span>
                      <span className="text-xs text-green-500 flex items-center">
                        <ArrowUp className="h-3 w-3" />
                        3.4%
                      </span>
                    </div>
                  </div>
                  <div className="text-center border-l border-r">
                    <div className="text-xs text-muted-foreground">Average Pages</div>
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <span>1,512</span>
                      <span className="text-xs text-green-500 flex items-center">
                        <ArrowUp className="h-3 w-3" />
                        3.4%
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Profit</div>
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <span>+22%</span>
                      <span className="text-xs text-green-500 flex items-center">
                        <ArrowUp className="h-3 w-3" />
                        3.4%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Weekly Summary */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5,
        duration: 0.5
      }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Weekly Summary</CardTitle>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">$890.93</span>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>;
};
export default Dashboard;