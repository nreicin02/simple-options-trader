import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
              Options Trading Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Trade options with confidence using plain language and intuitive tools designed for casual retail traders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/trade">Start Trading</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/education">Learn First</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How SimpliOptions Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/40">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tell Us Your Market View</h3>
                  <p className="text-muted-foreground">
                    Instead of complex options language, just tell us what you think will happen with a stock.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get Matched With Strategies</h3>
                  <p className="text-muted-foreground">
                    We'll suggest appropriate options strategies with clear explanations of risks and potential outcomes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Learn As You Trade</h3>
                  <p className="text-muted-foreground">
                    Context-specific educational content helps you understand the mechanics behind each trade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trading Examples Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Options Trading, Simplified</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        Instead of saying
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      "I want to buy a call option on AAPL with a 180 strike expiring in 30 days"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        With SimpliOptions
                      </div>
                    </div>
                    <p className="text-xl font-bold">
                      "I think Apple will go up in the next month"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        Instead of saying
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      "I want to sell a cash-secured put on TSLA at the 200 strike"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        With SimpliOptions
                      </div>
                    </div>
                    <p className="text-xl font-bold">
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
            <h2 className="text-3xl font-bold mb-6">Ready to start trading options with confidence?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join SimpliOptions today and discover a clearer, simpler way to navigate the options market.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/trade">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;