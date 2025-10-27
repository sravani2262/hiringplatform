import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, TrendingUp, Users, Star, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateMatch {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  skillsMatch: number;
  experienceMatch: number;
  cultureMatch: number;
  locationMatch: number;
  salaryMatch: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  aiInsights: string;
  avatar: string;
  currentRole: string;
  yearsOfExperience: number;
  keySkills: string[];
}

interface JobRequirement {
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: string;
  location: string;
  salaryRange: string;
  culture: string[];
}

const mockJobRequirement: JobRequirement = {
  title: "Senior Frontend Developer",
  description: "We're looking for a senior frontend developer with expertise in React and TypeScript",
  requiredSkills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Node.js", "GraphQL"],
  experienceLevel: "Senior (5+ years)",
  location: "Remote/San Francisco",
  salaryRange: "$120k - $160k",
  culture: ["Innovative", "Collaborative", "Fast-paced", "Growth-oriented"]
};

const mockCandidates: CandidateMatch[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    overallScore: 94,
    skillsMatch: 98,
    experienceMatch: 92,
    cultureMatch: 89,
    locationMatch: 100,
    salaryMatch: 95,
    currentRole: "Senior React Developer",
    yearsOfExperience: 6,
    keySkills: ["React", "TypeScript", "GraphQL", "Node.js", "AWS"],
    strengths: [
      "Exceptional React and TypeScript expertise",
      "Strong system architecture skills",
      "Proven leadership experience",
      "Open source contributor"
    ],
    weaknesses: [
      "Limited backend experience",
      "Could benefit from more mobile development exposure"
    ],
    recommendations: [
      "Ideal candidate for senior role - proceed with technical interview",
      "Consider for team lead position",
      "Salary expectation aligns perfectly with budget"
    ],
    aiInsights: "This candidate demonstrates exceptional technical skills with a strong match to your requirements. Her open-source contributions and leadership experience make her an excellent culture fit.",
    avatar: "SJ"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    overallScore: 87,
    skillsMatch: 85,
    experienceMatch: 88,
    cultureMatch: 92,
    locationMatch: 80,
    salaryMatch: 90,
    currentRole: "Full Stack Developer",
    yearsOfExperience: 4,
    keySkills: ["React", "JavaScript", "Python", "Docker", "MongoDB"],
    strengths: [
      "Full-stack capabilities",
      "Strong problem-solving skills",
      "Excellent communication",
      "Fast learner"
    ],
    weaknesses: [
      "Limited TypeScript experience",
      "Prefers hybrid work model"
    ],
    recommendations: [
      "Good technical fit with room for growth",
      "Consider for mid-senior position",
      "May need TypeScript training"
    ],
    aiInsights: "Strong candidate with full-stack experience. While TypeScript skills need development, his learning ability and culture fit make him a valuable long-term investment.",
    avatar: "MC"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@email.com",
    overallScore: 78,
    skillsMatch: 75,
    experienceMatch: 82,
    cultureMatch: 85,
    locationMatch: 70,
    salaryMatch: 85,
    currentRole: "Frontend Developer",
    yearsOfExperience: 3,
    keySkills: ["React", "JavaScript", "CSS", "Redux", "Testing"],
    strengths: [
      "Strong React fundamentals",
      "Excellent testing practices",
      "Creative problem solving",
      "Team player"
    ],
    weaknesses: [
      "Limited senior-level experience",
      "Location preference may require relocation",
      "Salary expectations below market rate"
    ],
    recommendations: [
      "Consider for junior-mid level role",
      "Strong potential for growth",
      "May need mentorship initially"
    ],
    aiInsights: "Promising candidate with solid fundamentals. While experience level is below target, her strong testing practices and growth mindset indicate high potential.",
    avatar: "ER"
  }
];

export function CandidateMatchingAI({ jobId }: { jobId?: string }) {
  const [candidates, setCandidates] = useState<CandidateMatch[]>(mockCandidates);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      // Shuffle scores slightly to simulate new analysis
      setCandidates(prev => 
        prev.map(candidate => ({
          ...candidate,
          overallScore: Math.min(100, candidate.overallScore + Math.floor(Math.random() * 6) - 3)
        }))
      );
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreColorProgress = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="card-premium border-none shadow-xl rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  AI-Powered Candidate Matching
                </CardTitle>
                <p className="text-slate-600 text-sm">
                  Intelligent analysis for {mockJobRequirement.title}
                </p>
              </div>
            </div>
            <Button
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Job Requirements Summary */}
      <Card className="card-premium border-none shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Job Requirements Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-1">
                {mockJobRequirement.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Experience</h4>
              <p className="text-sm text-slate-600">{mockJobRequirement.experienceLevel}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Location</h4>
              <p className="text-sm text-slate-600">{mockJobRequirement.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Salary Range</h4>
              <p className="text-sm text-slate-600">{mockJobRequirement.salaryRange}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Matches */}
      <div className="space-y-4">
        {candidates
          .sort((a, b) => b.overallScore - a.overallScore)
          .map((candidate, index) => (
            <Card
              key={candidate.id}
              className="card-premium border-none shadow-lg rounded-2xl overflow-hidden hover-lift"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-50/50" />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-6">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg",
                      index === 0 && "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
                      index === 1 && "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
                      index === 2 && "bg-gradient-to-r from-orange-400 to-orange-600 text-white",
                      index > 2 && "bg-slate-200 text-slate-600"
                    )}>
                      #{index + 1}
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-md">
                          <span className="text-lg font-bold text-primary">
                            {candidate.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">
                            {candidate.name}
                          </h3>
                          <p className="text-slate-600 text-sm mb-1">
                            {candidate.currentRole} • {candidate.yearsOfExperience} years exp.
                          </p>
                          <p className="text-slate-500 text-sm">{candidate.email}</p>
                        </div>
                      </div>
                      
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className={cn(
                          "text-3xl font-bold px-4 py-2 rounded-xl",
                          getScoreColor(candidate.overallScore)
                        )}>
                          {candidate.overallScore}%
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Overall Match</p>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {candidate.keySkills.map((skill) => (
                        <Badge
                          key={skill}
                          className={cn(
                            "text-xs px-2 py-1",
                            mockJobRequirement.requiredSkills.includes(skill)
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          )}
                        >
                          {skill}
                          {mockJobRequirement.requiredSkills.includes(skill) && (
                            <Star className="w-3 h-3 ml-1 fill-current" />
                          )}
                        </Badge>
                      ))}
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      {[
                        { label: "Skills", score: candidate.skillsMatch },
                        { label: "Experience", score: candidate.experienceMatch },
                        { label: "Culture", score: candidate.cultureMatch },
                        { label: "Location", score: candidate.locationMatch },
                        { label: "Salary", score: candidate.salaryMatch }
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div className="text-sm font-medium text-slate-700 mb-1">
                            {item.label}
                          </div>
                          <div className="relative">
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={cn("h-2 rounded-full transition-all duration-500", getScoreColorProgress(item.score))}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <div className="text-xs font-semibold text-slate-600 mt-1">
                              {item.score}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Insights Preview */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl mb-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-2">AI Insights</h4>
                          <p className="text-sm text-slate-700">{candidate.aiInsights}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <Button
                      variant="ghost"
                      onClick={() => setExpandedCandidate(
                        expandedCandidate === candidate.id ? null : candidate.id
                      )}
                      className="w-full justify-between"
                    >
                      <span>View Detailed Analysis</span>
                      {expandedCandidate === candidate.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>

                    {/* Detailed Analysis (Expandable) */}
                    {expandedCandidate === candidate.id && (
                      <div className="mt-6 space-y-4 border-t pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Strengths */}
                          <div>
                            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Strengths
                            </h4>
                            <ul className="space-y-2">
                              {candidate.strengths.map((strength, idx) => (
                                <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Areas for Development */}
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Areas for Development
                            </h4>
                            <ul className="space-y-2">
                              {candidate.weaknesses.map((weakness, idx) => (
                                <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* AI Recommendations */}
                        <div>
                          <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {candidate.recommendations.map((recommendation, idx) => (
                              <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                {recommendation}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            Schedule Interview
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Request More Info
                          </Button>
                          <Button variant="outline">
                            Add to Shortlist
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}