import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download,
  Eye,
  TrendingUp,
  BarChart3,
  Calendar,
  Mail,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { Assessment, AssessmentResponse, Question } from '@/types/assessment';

interface ResponseViewerProps {
  assessment: Assessment;
  responses: AssessmentResponse[];
}

export function ResponseViewer({ assessment, responses }: ResponseViewerProps) {
  const [selectedResponse, setSelectedResponse] = useState<AssessmentResponse | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    calculateAnalytics();
  }, [responses]);

  const calculateAnalytics = () => {
    const totalResponses = responses.length;
    const completedResponses = responses.filter(r => r.status === 'completed').length;
    const inProgressResponses = responses.filter(r => r.status === 'in-progress').length;
    const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;

    // Calculate average completion time
    const completedWithTime = responses.filter(r => 
      r.status === 'completed' && r.completedAt && r.startedAt
    );
    const avgCompletionTime = completedWithTime.length > 0 
      ? completedWithTime.reduce((sum, r) => {
          const start = new Date(r.startedAt).getTime();
          const end = new Date(r.completedAt!).getTime();
          return sum + (end - start);
        }, 0) / completedWithTime.length
      : 0;

    // Question analytics
    const questionAnalytics = assessment.sections.flatMap(section => 
      section.questions.map(question => {
        const questionResponses = responses
          .filter(r => r.status === 'completed')
          .map(r => r.responses.find(resp => resp.questionId === question.id))
          .filter(Boolean);

        return {
          questionId: question.id,
          questionText: question.text,
          questionType: question.type,
          responseCount: questionResponses.length,
          responses: questionResponses,
        };
      })
    );

    setAnalytics({
      totalResponses,
      completedResponses,
      inProgressResponses,
      completionRate,
      avgCompletionTime,
      questionAnalytics,
    });
  };

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const exportResponses = () => {
    const csvData = responses.map(response => {
      const row: any = {
        'Candidate Name': response.candidateName || 'Anonymous',
        'Candidate Email': response.candidateEmail || '',
        'Status': response.status,
        'Started At': new Date(response.startedAt).toLocaleString(),
        'Completed At': response.completedAt ? new Date(response.completedAt).toLocaleString() : '',
      };

      // Add question responses
      assessment.sections.forEach(section => {
        section.questions.forEach(question => {
          const questionResponse = response.responses.find(r => r.questionId === question.id);
          row[question.text] = questionResponse ? 
            (Array.isArray(questionResponse.value) ? 
              questionResponse.value.join(', ') : 
              String(questionResponse.value)
            ) : '';
        });
      });

      return row;
    });

    // Convert to CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessment.title}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Responses exported successfully');
  };

  const renderResponseDetail = (response: AssessmentResponse) => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {response.candidateName || 'Anonymous Candidate'}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {response.candidateEmail && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {response.candidateEmail}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Started: {new Date(response.startedAt).toLocaleString()}
                  </div>
                  {response.completedAt && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Completed: {new Date(response.completedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant={response.status === 'completed' ? 'default' : 'secondary'}>
                {response.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessment.sections.map(section => (
                <div key={section.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">{section.title}</h3>
                  <div className="space-y-3">
                    {section.questions.map(question => {
                      const questionResponse = response.responses.find(r => r.questionId === question.id);
                      return (
                        <div key={question.id} className="border-l-4 border-primary pl-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">{question.text}</span>
                            <Badge variant="outline" className="text-xs">
                              {question.type}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            {questionResponse ? (
                              <div className="p-2 bg-muted/50 rounded">
                                {Array.isArray(questionResponse.value) ? (
                                  <ul className="list-disc list-inside">
                                    {questionResponse.value.map((value, index) => (
                                      <li key={index}>{String(value)}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span>{String(questionResponse.value)}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">No response</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalResponses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analytics.completedResponses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analytics.inProgressResponses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(analytics.completionRate)}%</div>
              <Progress value={analytics.completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Question Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Question Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.questionAnalytics.map((qa: any) => (
                <div key={qa.questionId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{qa.questionText}</h4>
                    <Badge variant="outline">{qa.questionType}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {qa.responseCount} response{qa.responseCount !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assessment Responses</h2>
          <p className="text-muted-foreground">{assessment.title}</p>
        </div>
        <Button onClick={exportResponses} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="responses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="responses" className="gap-2">
            <Users className="h-4 w-4" />
            Responses ({responses.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="space-y-4">
          {responses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Responses Yet</h3>
                <p className="text-muted-foreground text-center">
                  Responses will appear here once candidates start taking the assessment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Response List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>All Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto">
                      {responses.map((response) => (
                        <div
                          key={response.id}
                          className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                            selectedResponse?.id === response.id ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => setSelectedResponse(response)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {response.candidateName || 'Anonymous'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {response.candidateEmail}
                              </div>
                            </div>
                            <Badge variant={response.status === 'completed' ? 'default' : 'secondary'}>
                              {response.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(response.startedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Response Detail */}
              <div className="lg:col-span-2">
                {selectedResponse ? (
                  renderResponseDetail(selectedResponse)
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select a Response</h3>
                      <p className="text-muted-foreground text-center">
                        Choose a response from the list to view detailed answers.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
