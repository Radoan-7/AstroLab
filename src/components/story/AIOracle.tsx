import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface OraclePrediction {
  risk: string;
  confidence: 'Low' | 'Moderate' | 'High' | 'Very High';
  suggestion: string;
  timestamp: string;
}

interface AIOracleProps {
  currentAct: number;
}

const generatePrediction = (act: number): OraclePrediction => {
  const risks = ['42%', '67%', '72%', '85%', '91%'];
  const confidences: Array<'Low' | 'Moderate' | 'High' | 'Very High'> = ['Low', 'Moderate', 'High', 'Very High'];
  const suggestions = [
    'Deploy kinetic impactor within 5 days.',
    'Increase telescope observation frequency by 300%.',
    'Activate emergency global defense protocol.',
    'Consider gravity tractor deployment immediately.',
    'Nuclear option should remain as backup plan.',
    'Recommend evacuation of predicted impact zones.',
  ];

  const randomRisk = risks[Math.floor(Math.random() * risks.length)];
  const randomConfidence = confidences[Math.min(act - 1, confidences.length - 1)];
  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return {
    risk: randomRisk,
    confidence: randomConfidence,
    suggestion: randomSuggestion,
    timestamp: new Date().toLocaleTimeString(),
  };
};

export const AIOracle = ({ currentAct }: AIOracleProps) => {
  const [prediction, setPrediction] = useState<OraclePrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const askOracle = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPrediction(generatePrediction(currentAct));
      setIsAnalyzing(false);
    }, 1500);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'Very High': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Moderate': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className="border-2 border-cyan-500/50 bg-black/80 backdrop-blur-sm pixel-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 pixel-text text-cyan-400">
          <div className="relative">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="h-5 w-5 opacity-75" />
            </div>
          </div>
          THE ORACLE
        </CardTitle>
        <p className="text-xs text-muted-foreground pixel-text">AI ASSISTANT - PREDICTIVE ANALYSIS SYSTEM</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!prediction && !isAnalyzing && (
          <p className="text-sm text-muted-foreground pixel-text">
            Ask The Oracle for AI-powered risk assessment and mission recommendations.
          </p>
        )}

        {isAnalyzing && (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-cyan-500/20 rounded"></div>
            <div className="h-4 bg-cyan-500/20 rounded w-3/4"></div>
            <div className="h-4 bg-cyan-500/20 rounded w-1/2"></div>
            <p className="text-center text-cyan-400 pixel-text text-xs mt-4">
              ANALYZING DATA STREAMS...
            </p>
          </div>
        )}

        {prediction && !isAnalyzing && (
          <div className="space-y-3 animate-slide-in">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground pixel-text mb-1">IMPACT RISK</p>
                <p className="text-2xl font-bold text-red-400 pixel-text">{prediction.risk}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground pixel-text mb-1">CONFIDENCE</p>
                <Badge className={`${getConfidenceColor(prediction.confidence)} pixel-text`}>
                  {prediction.confidence}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground pixel-text mb-2">AI RECOMMENDATION</p>
              <p className="text-sm text-cyan-100 pixel-text leading-relaxed">
                {prediction.suggestion}
              </p>
            </div>

            <p className="text-xs text-muted-foreground pixel-text text-right">
              Analysis timestamp: {prediction.timestamp}
            </p>
          </div>
        )}

        <Button
          onClick={askOracle}
          disabled={isAnalyzing}
          className="w-full pixel-text bg-cyan-600 hover:bg-cyan-700 border-2 border-cyan-400"
        >
          {isAnalyzing ? 'ANALYZING...' : prediction ? 'REANALYZE' : 'ASK THE ORACLE'}
        </Button>
      </CardContent>
    </Card>
  );
};
