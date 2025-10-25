import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AssessmentRuntime } from '@/components/assessments/AssessmentRuntime';
import { Assessment } from '@/types/assessment';
import { AssessmentBuilderUtils } from '@/utils/assessment';
import { ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AssessmentDemo() {
  const [isTakingAssessment, setIsTakingAssessment] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');

  // Create a sample assessment for demo
  const sampleAssessment: Assessment = {
    id: 'demo-assessment',
    jobId: 'demo-job',
    title: 'Frontend Developer Assessment',
    description: 'Complete this assessment to demonstrate your frontend development skills.',
    sections: [
      {
        id: 'section-1',
        title: 'Technical Skills',
        description: 'Questions about your technical background',
        order: 0,
        questions: [
          {
            id: 'q-1',
            type: 'single-choice',
            text: 'What is your experience level with React?',
            description: 'Select the option that best describes your React experience',
            options: ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'],
            validation: { required: true },
            order: 0,
          },
          {
            id: 'q-2',
            type: 'multi-choice',
            text: 'Which technologies are you familiar with?',
            description: 'Select all that apply',
            options: ['TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Redux', 'Jest'],
            validation: { required: true, minLength: 2 },
            order: 1,
          },
          {
            id: 'q-3',
            type: 'short-text',
            text: 'Describe your experience with modern JavaScript features',
            description: 'Briefly explain your familiarity with ES6+ features',
            validation: { required: true, maxLength: 200 },
            order: 2,
          },
          {
            id: 'q-4',
            type: 'long-text',
            text: 'Explain how you would optimize a slow React application',
            description: 'Provide a detailed explanation of your optimization approach',
            validation: { required: true, minLength: 100 },
            order: 3,
          },
          {
            id: 'q-5',
            type: 'numeric',
            text: 'How many years of professional development experience do you have?',
            description: 'Enter the number of years',
            validation: { required: true, min: 0, max: 20 },
            order: 4,
          },
          {
            id: 'q-6',
            type: 'file-upload',
            text: 'Upload your portfolio or GitHub profile',
            description: 'Upload a PDF of your portfolio or provide a link to your GitHub',
            validation: { required: false },
            order: 5,
          },
        ],
      },
      {
        id: 'section-2',
        title: 'Problem Solving',
        description: 'Scenario-based questions',
        order: 1,
        questions: [
          {
            id: 'q-7',
            type: 'single-choice',
            text: 'How do you approach debugging a complex issue?',
            options: [
              'Start with console.log statements',
              'Use browser dev tools and breakpoints',
              'Write unit tests to isolate the problem',
              'Ask team members for help immediately',
            ],
            validation: { required: true },
            order: 0,
          },
          {
            id: 'q-8',
            type: 'long-text',
            text: 'Describe a challenging project you worked on and how you solved the main technical challenges',
            description: 'Provide specific details about the challenges and your solutions',
            validation: { required: true, minLength: 150 },
            order: 1,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };

  const handleStartAssessment = () => {
    if (!candidateName.trim()) {
      alert('Please enter your name');
      return;
    }
    setIsTakingAssessment(true);
  };

  const handleAssessmentComplete = (response: any) => {
    console.log('Assessment completed:', response);
    alert('Assessment completed successfully! Check the console for details.');
    setIsTakingAssessment(false);
  };

  const handleAssessmentSave = (response: any) => {
    console.log('Assessment saved:', response);
  };

  if (isTakingAssessment) {
    return (
      <Layout>
        <AssessmentRuntime
          assessment={sampleAssessment}
          candidateName={candidateName}
          candidateEmail={candidateEmail}
          onComplete={handleAssessmentComplete}
          onSave={handleAssessmentSave}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <Link to="/assessments">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Assessments
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Assessment Demo</h1>
          <p className="text-muted-foreground">
            Experience the assessment runtime with a sample Frontend Developer assessment
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Sample Assessment Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{sampleAssessment.title}</h3>
                <p className="text-muted-foreground">{sampleAssessment.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Assessment Sections:</h4>
                {sampleAssessment.sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-3">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-sm text-muted-foreground">{section.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Question Types Included:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Single Choice
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Multiple Choice
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Short Text
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Long Text
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Numeric Input
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    File Upload
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Start Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="candidateName">Your Name *</Label>
                <Input
                  id="candidateName"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="candidateEmail">Email (Optional)</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-1"
                />
              </div>
              <Button onClick={handleStartAssessment} className="w-full gap-2">
                <Play className="h-4 w-4" />
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a demo assessment. Your responses will be saved locally and can be viewed in the response viewer. 
                The assessment includes validation rules, conditional logic, and a live preview of how candidates would experience the assessment.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
