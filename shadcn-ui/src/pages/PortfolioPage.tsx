import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingDown, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';

const PortfolioPage: React.FC = () => {
  // Demo data for the portfolio page
  const positions = [
    {
      id: '1',
      strategy: 'Long Call',
      symbol: 'AAPL',
      strike: 180,
      expiration: '2023-12-15',
      quantity: 1,
      cost: 520,
      currentValue: 680,
      profitLoss: 160,
      profitLossPercent: 30.8,
      status: 'profit'
    },
    {
      id: '2',
      strategy: 'Bull Call Spread',
      symbol: 'MSFT',
      strike: 340,
      expiration: '2023-11-17',
      quantity: 2,
      cost: 780,
      currentValue: 620,
      profitLoss: -160,
      profitLossPercent: -20.5,
      status: 'loss'
    },
    {
      id: '3',
      strategy: 'Cash-Secured Put',
      symbol: 'TSLA',
      strike: 210,
      expiration: '2023-12-29',
      quantity: 1,
      cost: 0,
      currentValue: 420,
      profitLoss: 420,
      profitLossPercent: 100,
      status: 'profit'
    }
  ];

  const calculateTotalValue = () => {
    return positions.reduce((total, position) => total + position.currentValue, 0);
  };

  const calculateTotalProfitLoss = () => {
    return positions.reduce((total, position) => total + position.profitLoss, 0);
  };

  const calculateTotalProfitLossPercent = () => {
    const totalCost = positions.reduce((total, position) => total + position.cost, 0);
    const totalProfitLoss = calculateTotalProfitLoss();
    return totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(calculateTotalValue())}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
                <p className={`text-2xl font-bold ${calculateTotalProfitLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateTotalProfitLoss() >= 0 ? '+' : ''}{formatCurrency(calculateTotalProfitLoss())}
                  <span className="text-base ml-1">({calculateTotalProfitLossPercent().toFixed(2)}%)</span>
                </p>
              </div>
              {calculateTotalProfitLoss() >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-500" /> : 
                <TrendingDown className="h-8 w-8 text-red-500" />}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Positions</p>
                <p className="text-2xl font-bold">{positions.length}</p>
                <p className="text-xs text-muted-foreground">
                  {positions.filter(p => p.status === 'profit').length} profitable / 
                  {positions.filter(p => p.status === 'loss').length} losing
                </p>
              </div>
              <div className="flex gap-1">
                <span className="h-8 w-2 bg-green-500 rounded"></span>
                <span className="h-8 w-2 bg-red-500 rounded"></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Portfolio Details */}
      <Tabs defaultValue="positions" className="mt-8">
        <TabsList>
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="history">Trading History</TabsTrigger>
          <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="positions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
              <CardDescription>Your active options positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Strategy</th>
                      <th className="text-left py-3 px-4">Symbol</th>
                      <th className="text-center py-3 px-4">Strike</th>
                      <th className="text-center py-3 px-4">Expiration</th>
                      <th className="text-center py-3 px-4">Qty</th>
                      <th className="text-right py-3 px-4">Cost</th>
                      <th className="text-right py-3 px-4">Current Value</th>
                      <th className="text-right py-3 px-4">Profit/Loss</th>
                      <th className="text-center py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr key={position.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-4 px-4">{position.strategy}</td>
                        <td className="py-4 px-4 font-medium">{position.symbol}</td>
                        <td className="py-4 px-4 text-center">${position.strike}</td>
                        <td className="py-4 px-4 text-center flex items-center justify-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {formatDate(position.expiration)}
                        </td>
                        <td className="py-4 px-4 text-center">{position.quantity}</td>
                        <td className="py-4 px-4 text-right">{formatCurrency(position.cost)}</td>
                        <td className="py-4 px-4 text-right">{formatCurrency(position.currentValue)}</td>
                        <td className="py-4 px-4 text-right">
                          <div className={`${position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {position.profitLoss >= 0 ? '+' : ''}{formatCurrency(position.profitLoss)}
                            <span className="block text-xs">
                              {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button variant="outline" size="sm">Manage</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trading History</CardTitle>
              <CardDescription>Your past trades and their outcomes</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center space-y-2">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium">Trading history coming soon</h3>
                <p className="text-sm text-muted-foreground">This feature is under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Insights and analysis of your trading activity</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center space-y-2">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium">Analytics coming soon</h3>
                <p className="text-sm text-muted-foreground">This feature is under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;