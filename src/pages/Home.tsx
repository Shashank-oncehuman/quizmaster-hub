import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, FileQuestion, Award, BookOpen, Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";

// Mock data structure - you'll replace this with actual API calls
interface Subject {
  subjectid: string;
  subject_name: string;
  subject_logo: string;
  is_paid: number;
}

interface TestSeries {
  id: string;
  title: string;
  logo: string;
  price: number;
  offer_price: number;
  totaltesttitle: string;
  validity: string;
}

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [filteredTestSeries, setFilteredTestSeries] = useState<TestSeries[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    // Mock data - Replace with actual API calls
    setSubjects([
      {
        subjectid: "2122",
        subject_name: "Airforce (Tech. Physics)",
        subject_logo: "https://appx-content-v2.classx.co.in/subject/2025-11-01-0_4165515018200583.png",
        is_paid: 0,
      },
      {
        subjectid: "2123",
        subject_name: "Airforce (Tech. Maths)",
        subject_logo: "https://appx-content-v2.classx.co.in/subject/2025-11-01-0_13339394150023676.png",
        is_paid: 0,
      },
    ]);

    const mockTestSeries = [
      {
        id: "554",
        title: "Airforce 01/2027 Paid Test Series",
        logo: "https://appx-content-v2.classx.co.in/subject/2025-11-01-0_7742947516682324.png",
        price: 149,
        offer_price: 149,
        totaltesttitle: "15",
        validity: "12",
      },
      {
        id: "546",
        title: "Agniveer Navy SSR Stage 2 Test Series 2025",
        logo: "https://appx-content-v2.classx.co.in/subject/2025-10-24-0_5725865716141157.png",
        price: 0,
        offer_price: 0,
        totaltesttitle: "12",
        validity: "12",
      },
      {
        id: "547",
        title: "Agniveer Navy MR Stage 2 Test Series 2025",
        logo: "https://appx-content-v2.classx.co.in/subject/2025-10-25-0_659564551035573.png",
        price: 0,
        offer_price: 0,
        totaltesttitle: "10",
        validity: "12",
      },
      {
        id: "534",
        title: "BSF RO/RM Paid Test Series 2025",
        logo: "https://appx-content-v2.classx.co.in/subject/2025-10-07-0_7408899781051559.png",
        price: 149,
        offer_price: 99,
        totaltesttitle: "20",
        validity: "12",
      },
      {
        id: "503",
        title: "CAPF (BSF HCM & ASI) Paid Test Series 2025",
        logo: "https://appx-content-v2.classx.co.in/subject/2025-09-02-0_8783068605489902.jpeg",
        price: 99,
        offer_price: 99,
        totaltesttitle: "18",
        validity: "12",
      },
    ];
    
    setTestSeries(mockTestSeries);
    setFilteredTestSeries(mockTestSeries);

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Filter and search effect
  useEffect(() => {
    let filtered = [...testSeries];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((series) =>
        series.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter === "free") {
      filtered = filtered.filter((series) => series.price === 0);
    } else if (priceFilter === "paid") {
      filtered = filtered.filter((series) => series.price > 0);
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.offer_price - b.offer_price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.offer_price - a.offer_price);
    } else if (sortBy === "tests") {
      filtered.sort((a, b) => parseInt(b.totaltesttitle) - parseInt(a.totaltesttitle));
    }

    setFilteredTestSeries(filtered);
  }, [searchQuery, priceFilter, sortBy, testSeries]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 relative overflow-hidden rounded-2xl p-8 gradient-hero text-primary-foreground">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master Your Knowledge
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              Take quizzes, compete with others, and climb the leaderboard!
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-card/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <FileQuestion className="h-5 w-5" />
                <span className="font-semibold">1000+ Questions</span>
              </div>
              <div className="flex items-center space-x-2 bg-card/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <Award className="h-5 w-5" />
                <span className="font-semibold">50+ Test Series</span>
              </div>
              <div className="flex items-center space-x-2 bg-card/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">15+ Subjects</span>
              </div>
            </div>
          </div>
        </section>

        {/* Test Series Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold">Available Test Series</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search test series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="tests">Most Tests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTestSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestSeries.map((series) => (
              <Card
                key={series.id}
                className="overflow-hidden hover:shadow-lg transition-smooth cursor-pointer group"
                onClick={() => navigate(`/test-series/${series.id}`)}
              >
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                  <img
                    src={series.logo}
                    alt={series.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{series.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FileQuestion className="h-4 w-4 mr-1" />
                      {series.totaltesttitle} Tests
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {series.validity} Months
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {series.price > 0 ? (
                      <div>
                        <span className="text-2xl font-bold text-primary">₹{series.offer_price}</span>
                        {series.price !== series.offer_price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ₹{series.price}
                          </span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        Free
                      </Badge>
                    )}
                    <Button>View Tests</Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <FileQuestion className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No test series found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </section>

        {/* Subjects Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Browse by Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <Card
                key={subject.subjectid}
                className="overflow-hidden hover:shadow-md transition-smooth cursor-pointer group"
                onClick={() => navigate(`/subject/${subject.subjectid}`)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 mb-3">
                    <img
                      src={subject.subject_logo}
                      alt={subject.subject_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  </div>
                  <h3 className="font-semibold text-center line-clamp-2">{subject.subject_name}</h3>
                  {subject.is_paid === 1 && (
                    <Badge variant="secondary" className="mt-2 w-full justify-center">
                      Premium
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
