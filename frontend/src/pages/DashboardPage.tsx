import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecentSales } from '@/components/dashboard/RecentSales';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Users 
} from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    sales: 0,
    customers: 0,
    active: 0
  });

  // Simulate data loading
  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStats({
        revenue: 45231.89,
        sales: 2350,
        customers: 1245,
        active: 573
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">Settings</Button>
          <Button onClick={logout}>Logout</Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <>
                <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +20.1% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Subscriptions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <>
                <div className="text-2xl font-bold">+{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +180.1% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sales Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <>
                <div className="text-2xl font-bold">+{stats.sales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +19% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Now Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Now
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <>
                <div className="text-2xl font-bold">+{stats.customers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +201 since last hour
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <OverviewChart />
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[70px]" />
                    </div>
                    <Skeleton className="h-4 w-[50px] ml-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <RecentSales />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;