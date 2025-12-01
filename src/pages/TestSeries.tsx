import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileQuestion, Award, ChevronLeft, Loader2 } from "lucide-react";
import { useSubjects, useTestTitles } from "@/hooks/useApiData";

const TestSeries = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  // Get subjects for this test series
  const { subjects, loading: subjectsLoading } = useSubjects(apiUrl, seriesId || null);
  
  // Get test titles for selected subject
  const { testTitles, loading: titlesLoading } = useTestTitles(
    apiUrl,
    seriesId || null,
    selectedSubject
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    // Get API URL from localStorage (set in Home page)
    const storedApiUrl = localStorage.getItem("selectedApiUrl");
    if (storedApiUrl) {
      setApiUrl(storedApiUrl);
    }
  }, [navigate]);

  const handleStartTest = (questionsUrl: string, titleId: string) => {
    // Store questions URL in localStorage to use in Quiz page
    localStorage.setItem("currentQuizUrl", questionsUrl);
    navigate(`/quiz/${titleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Test Series</h1>
          <p className="text-muted-foreground">Select a subject to view available tests</p>
        </div>

        {/* Subjects Section */}
        {!selectedSubject && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Select Subject</h2>
            {subjectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading subjects...</span>
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <Card
                    key={subject.subject_id}
                    className="hover:shadow-lg transition-smooth cursor-pointer group"
                    onClick={() => setSelectedSubject(subject.subject_id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        {subject.subject_logo && (
                          <img
                            src={subject.subject_logo}
                            alt={subject.subject_name}
                            className="h-12 w-12 object-contain rounded"
                          />
                        )}
                        <Badge variant="secondary">{subject.total_tests} tests</Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-smooth">
                        {subject.subject_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        View Tests
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No subjects available for this test series.</p>
              </div>
            )}
          </div>
        )}

        {/* Test Titles Section */}
        {selectedSubject && (
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedSubject(null)}
              className="mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Subjects
            </Button>

            <h2 className="text-2xl font-semibold mb-4">Available Tests</h2>
            {titlesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading tests...</span>
              </div>
            ) : testTitles.length > 0 ? (
              <div className="grid gap-4">
                {testTitles.map((test) => (
                  <Card key={test.title_id} className="hover:shadow-lg transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{test.title_name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {test.duration_minutes} mins
                            </div>
                            <div className="flex items-center">
                              <FileQuestion className="h-4 w-4 mr-1" />
                              {test.total_questions} questions
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {test.total_marks} marks
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <div className="flex gap-2">
                            {test.is_completed && (
                              <Badge variant="default" className="bg-success">
                                Completed
                              </Badge>
                            )}
                            {!test.is_completed && test.remaining_attempts > 0 && (
                              <Badge variant="secondary">
                                {test.remaining_attempts} attempts left
                              </Badge>
                            )}
                            {test.remaining_attempts === 0 && !test.is_completed && (
                              <Badge variant="destructive">No attempts left</Badge>
                            )}
                          </div>
                          <Button
                            onClick={() => handleStartTest(test.questions_json_url, test.title_id)}
                            disabled={test.remaining_attempts === 0 && !test.is_completed}
                            className="w-full md:w-auto"
                          >
                            {test.is_completed ? "Retake Test" : "Start Test"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tests available for this subject.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TestSeries;
