import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useAIInterview } from '@/hooks/useAIInterview';
import { AIAvatar } from '@/components/ui/AIAvatar';
import { 
  Mic, 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Target,
  TrendingUp,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  tips: string;
}

interface ScoreResult {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
  overallFeedback: string;
}

type SimulatorState = 'setup' | 'practice' | 'feedback' | 'complete';

export default function InterviewSimulator() {
  const [state, setState] = useState<SimulatorState>('setup');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [scores, setScores] = useState<(ScoreResult | null)[]>([]);
  const [currentScore, setCurrentScore] = useState<ScoreResult | null>(null);

  const { isLoading, generateQuestions, scoreAnswer } = useAIInterview();

  const handleStartInterview = async () => {
    if (!role || !industry) return;
    
    const generatedQuestions = await generateQuestions(role, industry, difficulty);
    if (generatedQuestions && generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setScores(new Array(generatedQuestions.length).fill(null));
      setCurrentIndex(0);
      setState('practice');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    const result = await scoreAnswer(questions[currentIndex].question, answer);
    if (result) {
      setCurrentScore(result);
      const newScores = [...scores];
      newScores[currentIndex] = result;
      setScores(newScores);
      setState('feedback');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setCurrentScore(null);
      setState('practice');
    } else {
      setState('complete');
    }
  };

  const handleRestart = () => {
    setState('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer('');
    setScores([]);
    setCurrentScore(null);
  };

  const averageScore = scores.filter(s => s !== null).reduce((acc, s) => acc + (s?.score || 0), 0) / 
    Math.max(scores.filter(s => s !== null).length, 1);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <AIAvatar emotion="default" size="lg" />
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">AI Interview Simulator</h1>
            <p className="text-muted-foreground">Practice with AI-powered interview questions and get instant feedback</p>
          </div>
        </div>

        {/* Progress Bar */}
        {state !== 'setup' && (
          <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium text-foreground">
                {currentIndex + 1} / {questions.length} questions
              </span>
            </div>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
          </div>
        )}

        {/* Setup State */}
        {state === 'setup' && (
          <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold font-heading text-foreground">Configure Your Interview</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tell us about the role you're preparing for and we'll generate tailored interview questions
              </p>
            </div>

            <div className="grid gap-4 max-w-md mx-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software-developer">Software Developer</SelectItem>
                    <SelectItem value="marketing-intern">Marketing Intern</SelectItem>
                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                    <SelectItem value="hr-assistant">HR Assistant</SelectItem>
                    <SelectItem value="finance-graduate">Finance Graduate</SelectItem>
                    <SelectItem value="project-coordinator">Project Coordinator</SelectItem>
                    <SelectItem value="graphic-designer">Graphic Designer</SelectItem>
                    <SelectItem value="sales-representative">Sales Representative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Difficulty Level</label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - Entry Level</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some Experience</SelectItem>
                    <SelectItem value="advanced">Advanced - Senior Positions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStartInterview}
                disabled={!role || !industry || isLoading}
                className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Interview
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Practice State */}
        {state === 'practice' && questions[currentIndex] && (
          <div className="space-y-6">
            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
              <div className="flex items-start gap-4">
                <AIAvatar emotion="talking" size="md" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      questions[currentIndex].type === 'behavioral' ? 'bg-blue-500/20 text-blue-400' :
                      questions[currentIndex].type === 'technical' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {questions[currentIndex].type}
                    </span>
                    <span className="text-xs text-muted-foreground">Question {currentIndex + 1}</span>
                  </div>
                  <h3 className="text-lg font-medium text-foreground">
                    {questions[currentIndex].question}
                  </h3>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <Lightbulb className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{questions[currentIndex].tips}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 space-y-4">
              <label className="text-sm font-medium text-foreground">Your Answer</label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... Be specific and use examples from your experience."
                className="min-h-[200px] bg-background/50 border-border/50 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {answer.length} characters
                </span>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || isLoading}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get AI Feedback'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback State */}
        {state === 'feedback' && currentScore && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Your Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(currentScore.score)}`}>
                  {currentScore.score}/10
                </div>
              </div>
              <p className="text-muted-foreground">{currentScore.overallFeedback}</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <h4 className="font-medium text-green-400">Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {currentScore.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <h4 className="font-medium text-yellow-400">Areas to Improve</h4>
                </div>
                <ul className="space-y-2">
                  {currentScore.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sample Answer */}
            <div className="p-5 rounded-xl bg-primary/10 border border-primary/30 space-y-3">
              <div className="flex items-center gap-3">
                <AIAvatar emotion="idea" size="sm" />
                <h4 className="font-medium text-primary">Sample Strong Answer</h4>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {currentScore.sampleAnswer}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setAnswer('');
                  setCurrentScore(null);
                  setState('practice');
                }}
                className="border-border/50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View Results
                    <TrendingUp className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Complete State */}
        {state === 'complete' && (
          <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 space-y-6">
            <div className="text-center space-y-4">
              <AIAvatar emotion="excited" size="xl" className="mx-auto" />
              <h2 className="text-2xl font-bold font-heading text-foreground">Interview Complete!</h2>
              <p className="text-muted-foreground">Here's your performance summary</p>
            </div>

            {/* Overall Score */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 text-center">
              <p className="text-sm text-muted-foreground mb-2">Average Score</p>
              <div className={`text-5xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}/10
              </div>
            </div>

            {/* Question Scores */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Question Breakdown</h4>
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                  <span className="text-sm text-muted-foreground truncate flex-1 mr-4">
                    {q.question}
                  </span>
                  <span className={`font-semibold ${getScoreColor(scores[i]?.score || 0)}`}>
                    {scores[i]?.score || '-'}/10
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleRestart}
                className="border-border/50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                New Interview
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
