import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { HelpCircle, Filter, TrendingUp, TrendingDown } from 'lucide-react';

interface OptionData {
  symbol: string;
  strike: number;
  expiration: string;
  type: 'call' | 'put';
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
  openInterest: number;
  impliedVolatility?: number;
  bid?: number;
  ask?: number;
}

interface OptionsChainProps {
  options: OptionData[];
  currentStockPrice: number;
  onPlaceOrder: (option: OptionData, action: 'buy' | 'sell') => void;
  loading?: boolean;
}

// Tooltip definitions for options terms
const tooltips = {
  strike: "The price at which the option can be exercised",
  delta: "How much the option price changes when the stock moves $1",
  gamma: "How much delta changes when the stock moves $1",
  theta: "Daily time decay - how much value the option loses per day",
  vega: "How much the option price changes when volatility changes 1%",
  volume: "Number of contracts traded today",
  openInterest: "Number of outstanding contracts",
  impliedVolatility: "Market's expectation of future stock price volatility",
  bid: "Highest price someone is willing to pay for this option",
  ask: "Lowest price someone is willing to sell this option for"
};

export const OptionsChain: React.FC<OptionsChainProps> = ({
  options,
  currentStockPrice,
  onPlaceOrder,
  loading = false
}) => {
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'call' | 'put',
    moneyness: 'all' as 'all' | 'itm' | 'atm' | 'otm',
    minVolume: '',
    minOpenInterest: '',
    expiration: 'all'
  });

  const [sortBy, setSortBy] = useState('strike');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get unique expirations
  const expirations = [...new Set(options.map(opt => opt.expiration))].sort();

  // Filter and sort options
  const filteredOptions = options
    .filter(option => {
      if (filters.type !== 'all' && option.type !== filters.type) return false;
      
      // Moneyness filter
      if (filters.moneyness !== 'all') {
        const isITM = option.type === 'call' ? 
          currentStockPrice > option.strike : 
          currentStockPrice < option.strike;
        const isATM = Math.abs(currentStockPrice - option.strike) < 2;
        const isOTM = option.type === 'call' ? 
          currentStockPrice < option.strike : 
          currentStockPrice > option.strike;
        
        if (filters.moneyness === 'itm' && !isITM) return false;
        if (filters.moneyness === 'atm' && !isATM) return false;
        if (filters.moneyness === 'otm' && !isOTM) return false;
      }
      
      if (filters.minVolume && option.volume < parseInt(filters.minVolume)) return false;
      if (filters.minOpenInterest && option.openInterest < parseInt(filters.minOpenInterest)) return false;
      if (filters.expiration !== 'all' && option.expiration !== filters.expiration) return false;
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'strike':
          comparison = a.strike - b.strike;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'volume':
          comparison = a.volume - b.volume;
          break;
        case 'openInterest':
          comparison = a.openInterest - b.openInterest;
          break;
        case 'delta':
          comparison = Math.abs(a.delta) - Math.abs(b.delta);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getMoneynessBadge = (option: OptionData) => {
    const isITM = option.type === 'call' ? 
      currentStockPrice > option.strike : 
      currentStockPrice < option.strike;
    const isATM = Math.abs(currentStockPrice - option.strike) < 2;
    
    if (isITM) return <Badge variant="default" className="bg-green-100 text-green-800">ITM</Badge>;
    if (isATM) return <Badge variant="secondary">ATM</Badge>;
    return <Badge variant="outline">OTM</Badge>;
  };

  const getDeltaColor = (delta: number) => {
    const absDelta = Math.abs(delta);
    if (absDelta > 0.7) return 'text-green-600 font-semibold';
    if (absDelta > 0.3) return 'text-blue-600';
    return 'text-gray-600';
  };

  const TooltipWrapper = ({ term, children }: { term: keyof typeof tooltips, children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltips[term]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Options Chain Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="call">Calls</SelectItem>
                  <SelectItem value="put">Puts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Moneyness</Label>
              <Select value={filters.moneyness} onValueChange={(value: any) => setFilters(prev => ({ ...prev, moneyness: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="itm">In-the-Money</SelectItem>
                  <SelectItem value="atm">At-the-Money</SelectItem>
                  <SelectItem value="otm">Out-of-the-Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Min Volume</Label>
              <Input
                placeholder="0"
                value={filters.minVolume}
                onChange={(e) => setFilters(prev => ({ ...prev, minVolume: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Min Open Interest</Label>
              <Input
                placeholder="0"
                value={filters.minOpenInterest}
                onChange={(e) => setFilters(prev => ({ ...prev, minOpenInterest: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Expiration</Label>
              <Select value={filters.expiration} onValueChange={(value) => setFilters(prev => ({ ...prev, expiration: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {expirations.map(exp => (
                    <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strike">Strike</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="openInterest">Open Interest</SelectItem>
                  <SelectItem value="delta">Delta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {filteredOptions.length} of {options.length} options
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Options Chain Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Options Chain - {options[0]?.symbol} @ {formatCurrency(currentStockPrice)}</span>
            <div className="text-sm text-gray-600">
              {options[0]?.symbol} Options
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading options data...</p>
            </div>
          ) : filteredOptions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <TooltipWrapper term="strike">Strike</TooltipWrapper>
                    </TableHead>
                    <TableHead>
                      <TooltipWrapper term="strike">Moneyness</TooltipWrapper>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <TooltipWrapper term="bid">Bid</TooltipWrapper>
                    </TableHead>
                    <TableHead>
                      <TooltipWrapper term="ask">Ask</TooltipWrapper>
                    </TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>
                      <TooltipWrapper term="delta">Delta</TooltipWrapper>
                    </TableHead>
                    <TableHead>
                      <TooltipWrapper term="gamma">Gamma</TooltipWrapper>
                    </TableHead>
                    <TableHead>
                      <TooltipWrapper term="theta">Theta</TooltipWrapper>
                    </TableHead>
                    <TableHead>
                      <TooltipWrapper term="vega">Vega</TooltipWrapper>
                    </TableHead>
                    <TableHead>
                      <TooltipWrapper term="volume">Volume</TooltipWrapper>
                    </TableHead>
                    <TableHead>
                      <TooltipWrapper term="openInterest">OI</TooltipWrapper>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOptions.map((option) => (
                    <TableRow key={`${option.symbol}-${option.strike}-${option.expiration}-${option.type}`}>
                      <TableCell className="font-semibold">{formatCurrency(option.strike)}</TableCell>
                      <TableCell>{getMoneynessBadge(option)}</TableCell>
                      <TableCell>
                        <Badge variant={option.type === 'call' ? 'default' : 'secondary'}>
                          {option.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{option.bid ? formatCurrency(option.bid) : '-'}</TableCell>
                      <TableCell>{option.ask ? formatCurrency(option.ask) : '-'}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(option.price)}</TableCell>
                      <TableCell className={getDeltaColor(option.delta)}>
                        {option.delta.toFixed(3)}
                      </TableCell>
                      <TableCell>{option.gamma.toFixed(4)}</TableCell>
                      <TableCell className="text-red-600">{option.theta.toFixed(4)}</TableCell>
                      <TableCell>{option.vega.toFixed(4)}</TableCell>
                      <TableCell>{formatNumber(option.volume)}</TableCell>
                      <TableCell>{formatNumber(option.openInterest)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPlaceOrder(option, 'buy')}
                            className="text-green-600 hover:text-green-700"
                          >
                            Buy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPlaceOrder(option, 'sell')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Sell
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No options match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 