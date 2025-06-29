import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Play, ScrollText, ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

// Education resource interface
interface EducationalResource {
  id: string;
  title: string;
  description: string;
  contentType: 'article' | 'video' | 'interactive';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  timeToComplete: string;
  imageUrl?: string;
  url: string;
}

const EducationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Educational resources data
  const educationalResources: EducationalResource[] = [
    {
      id: '1',
      title: 'Options Trading Basics',
      description: 'Learn the foundational concepts of options trading, including calls, puts, strike prices, and expiration dates.',
      contentType: 'article',
      difficultyLevel: 'beginner',
      tags: ['basics', 'terminology', 'getting started'],
      timeToComplete: '10 min',
      imageUrl: '/assets/education/options-basics.jpg',
      url: 'https://www.investopedia.com/terms/o/option.asp'
    },
    {
      id: '2',
      title: 'Understanding Option Pricing',
      description: 'Explore the factors that influence options prices, including the Black-Scholes model, volatility, and time decay.',
      contentType: 'article',
      difficultyLevel: 'intermediate',
      tags: ['pricing', 'greeks', 'volatility'],
      timeToComplete: '18 min',
      imageUrl: '/assets/education/option-pricing.jpg',
      url: 'https://www.investopedia.com/terms/b/blackscholes.asp'
    },
    {
      id: '3',
      title: 'Bull Call Spread Strategy',
      description: 'Learn how to set up and manage a bull call spread strategy for moderately bullish market outlooks.',
      contentType: 'article',
      difficultyLevel: 'intermediate',
      tags: ['strategies', 'bullish', 'spreads'],
      timeToComplete: '15 min',
      imageUrl: '/assets/education/bull-call-spread.jpg',
      url: 'https://www.investopedia.com/terms/b/bullcallspread.asp'
    },
    {
      id: '4',
      title: 'Introduction to Risk Management',
      description: 'Discover essential risk management techniques to protect your portfolio when trading options.',
      contentType: 'article',
      difficultyLevel: 'beginner',
      tags: ['risk', 'management', 'position sizing'],
      timeToComplete: '12 min',
      imageUrl: '/assets/education/risk-management.jpg',
      url: 'https://www.investopedia.com/articles/trading/08/risk-management.asp'
    },
    {
      id: '5',
      title: 'Advanced Options Income Strategies',
      description: 'Explore sophisticated income-generating strategies like iron condors, butterflies, and calendar spreads.',
      contentType: 'article',
      difficultyLevel: 'advanced',
      tags: ['income', 'advanced strategies', 'multi-leg'],
      timeToComplete: '25 min',
      imageUrl: '/assets/education/advanced-income.jpg',
      url: 'https://www.investopedia.com/terms/i/ironcondor.asp'
    },
    {
      id: '6',
      title: 'Options Greeks Explained',
      description: 'Master the Greeks (Delta, Gamma, Theta, Vega) and understand how they affect options pricing.',
      contentType: 'article',
      difficultyLevel: 'advanced',
      tags: ['greeks', 'delta', 'theta', 'gamma', 'vega'],
      timeToComplete: '20 min',
      imageUrl: '/assets/education/greeks-simulator.jpg',
      url: 'https://www.investopedia.com/terms/g/greeks.asp'
    },
    {
      id: '7',
      title: 'Covered Call Strategy',
      description: 'Learn how to generate income from stocks you already own using covered call options.',
      contentType: 'article',
      difficultyLevel: 'intermediate',
      tags: ['income', 'covered calls', 'strategies'],
      timeToComplete: '8 min',
      imageUrl: '/assets/education/covered-calls.jpg',
      url: 'https://www.investopedia.com/terms/c/coveredcall.asp'
    },
    {
      id: '8',
      title: 'Cash Secured Put Strategy',
      description: 'Understand how to sell cash-secured puts to potentially buy stocks at a discount.',
      contentType: 'article',
      difficultyLevel: 'intermediate',
      tags: ['income', 'cash secured puts', 'strategies'],
      timeToComplete: '12 min',
      imageUrl: '/assets/education/cash-secured-puts.jpg',
      url: 'https://www.investopedia.com/terms/c/cashsecuredput.asp'
    },
    {
      id: '9',
      title: 'Options Chain Analysis',
      description: 'Learn how to read and analyze options chains to make informed trading decisions.',
      contentType: 'article',
      difficultyLevel: 'intermediate',
      tags: ['analysis', 'options chain', 'volume', 'open interest'],
      timeToComplete: '15 min',
      imageUrl: '/assets/education/options-chain.jpg',
      url: 'https://www.investopedia.com/terms/o/optionschain.asp'
    },
    {
      id: '10',
      title: 'Implied Volatility Explained',
      description: 'Understand implied volatility and how it affects options pricing and strategy selection.',
      contentType: 'article',
      difficultyLevel: 'advanced',
      tags: ['volatility', 'implied volatility', 'pricing'],
      timeToComplete: '14 min',
      imageUrl: '/assets/education/implied-volatility.jpg',
      url: 'https://www.investopedia.com/terms/i/iv.asp'
    },
    {
      id: '11',
      title: 'Options Expiration and Assignment',
      description: 'Learn what happens when options expire and the process of assignment.',
      contentType: 'article',
      difficultyLevel: 'intermediate',
      tags: ['expiration', 'assignment', 'exercise'],
      timeToComplete: '10 min',
      imageUrl: '/assets/education/expiration.jpg',
      url: 'https://www.investopedia.com/terms/e/exercise.asp'
    },
    {
      id: '12',
      title: 'Options Trading Psychology',
      description: 'Master the psychological aspects of options trading and emotional discipline.',
      contentType: 'article',
      difficultyLevel: 'intermediate',
      tags: ['psychology', 'emotions', 'discipline'],
      timeToComplete: '16 min',
      imageUrl: '/assets/education/psychology.jpg',
      url: 'https://www.investopedia.com/articles/trading/08/trading-psychology.asp'
    }
  ];
  
  // Filter resources based on search query and filters
  const filteredResources = educationalResources.filter((resource) => {
    const matchesSearch = (
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesLevel = selectedLevel === 'all' || resource.difficultyLevel === selectedLevel;
    const matchesType = selectedType === 'all' || resource.contentType === selectedType;
    
    return matchesSearch && matchesLevel && matchesType;
  });
  
  // Content type icon mapping
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'article':
        return <ScrollText className="h-4 w-4" />;
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'interactive':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  // Difficulty level color mapping
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Options Trading Education</h1>
      <p className="text-muted-foreground mb-8">Expand your knowledge with these learning resources</p>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search for resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Difficulty Level</label>
            <div className="flex gap-2">
              <Button 
                variant={selectedLevel === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedLevel('all')}
                className={selectedLevel === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                All
              </Button>
              <Button 
                variant={selectedLevel === 'beginner' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedLevel('beginner')}
                className={selectedLevel === 'beginner' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Beginner
              </Button>
              <Button 
                variant={selectedLevel === 'intermediate' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedLevel('intermediate')}
                className={selectedLevel === 'intermediate' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Intermediate
              </Button>
              <Button 
                variant={selectedLevel === 'advanced' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedLevel('advanced')}
                className={selectedLevel === 'advanced' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Advanced
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">Content Type</label>
            <div className="flex gap-2">
              <Button 
                variant={selectedType === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedType('all')}
                className={selectedType === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                All
              </Button>
              <Button 
                variant={selectedType === 'article' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedType('article')}
              >
                <ScrollText className="mr-1 h-3 w-3" /> Articles
              </Button>
              <Button 
                variant={selectedType === 'video' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedType('video')}
              >
                <Play className="mr-1 h-3 w-3" /> Videos
              </Button>
              <Button 
                variant={selectedType === 'interactive' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedType('interactive')}
              >
                <BookOpen className="mr-1 h-3 w-3" /> Interactive
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Paths Section */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="saved">Saved Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden border-border/40 hover:border-primary/30 transition-colors">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <Badge className={`${getDifficultyColor(resource.difficultyLevel)} capitalize`}>
                        {resource.difficultyLevel}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-xs p-1 px-2 rounded-md flex items-center gap-1">
                      {getContentTypeIcon(resource.contentType)}
                      <span>{resource.timeToComplete}</span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-sm">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm">
                      <Bookmark className="mr-1 h-3 w-3" /> Save
                    </Button>
                    {resource.url.startsWith('http') ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Start Learning <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </a>
                    ) : (
                      <Link to={resource.url} className="inline-block">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Start Learning <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your filters.</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLevel('all');
                  setSelectedType('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="paths">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Options Fundamentals</CardTitle>
                <CardDescription>A structured path for beginners to learn options trading from scratch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between mb-2">
                    <span>4 modules • 8 lessons</span>
                    <span>~2 hours to complete</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Learning Path</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Income Generation Mastery</CardTitle>
                <CardDescription>Learn proven strategies for generating consistent income with options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between mb-2">
                    <span>5 modules • 12 lessons</span>
                    <span>~3 hours to complete</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Learning Path</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No saved resources yet</h3>
            <p className="text-sm text-muted-foreground mt-2">Save resources to access them later</p>
            <Button className="mt-4" onClick={() => document.querySelector('[data-value="all"]')?.dispatchEvent(new MouseEvent('click'))}>
              Browse Resources
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationPage;