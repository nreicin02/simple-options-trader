import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, BookOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Index: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleStartTrading = () => {
    if (user) {
      navigate('/trade');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SimpliOptions</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/home" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Home
              </Link>
              <Link to="/trade" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Trade
              </Link>
              <Link to="/education" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Learn
              </Link>
              <Link to="/portfolio" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Portfolio
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.firstName}!</span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
              Options Trading Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Trade options with confidence using plain language and intuitive tools designed for casual retail traders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleStartTrading}>
                <Link to="/trade">Start Trading</Link>
              </Button>
              <Button asChild size="lg" variant="outline" onClick={handleStartTrading}>
                <Link to="/education">Learn First</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">How SimpliOptions Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/40 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Tell Us Your Market View</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Instead of complex options language, just tell us what you think will happen with a stock.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Get Matched With Strategies</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We'll suggest appropriate options strategies with clear explanations of risks and potential outcomes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Learn As You Trade</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Context-specific educational content helps you understand the mechanics behind each trade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trading Examples Section */}
      <section className="py-16 bg-white/30 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Options Trading, Simplified</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        Instead of saying
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                      "I want to buy a call option on AAPL with a 180 strike expiring in 30 days"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        With SimpliOptions
                      </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      "I think Apple will go up in the next month"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        Instead of saying
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                      "I want to sell a cash-secured put on TSLA at the 200 strike"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        With SimpliOptions
                      </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      "I'm willing to buy Tesla at $200 and earn income while waiting"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Ready to start trading options with confidence?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join SimpliOptions today and discover a clearer, simpler way to navigate the options market.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleStartTrading}>
              <Link to="/trade">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
