import React from 'react';
import './EmptyAssessmentState.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../ui';
import { Brain, Sparkles, ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';

export const EmptyAssessmentState = ({
  onStartAssessment,
  onLoadDemo,
  className = ''
}) => {
  return (
    <div className={`ayur-empty-dashboard ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-empty-dash-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge color="accent" variant="solid" icon={<Sparkles size={12} />}>
              AyuRAG-XAI Clinical Pipeline
            </Badge>
            <span className="text-micro text-muted">Awaiting Input Data</span>
          </div>

          <CardTitle as="h2" className="ayur-empty-dash-title">
            AI Decision Support Dashboard
          </CardTitle>

          <CardDescription className="ayur-empty-dash-desc">
            The personalized explainable AI dashboard synthesizes inputs across Personal Information, Prakriti, Lifestyle, Diet, and Symptoms.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-empty-dash-box">
            <div className="ayur-empty-dash-icon">
              <Brain size={48} className="text-primary opacity-80" />
            </div>

            <div className="ayur-empty-dash-text">
              <h3 className="text-h3 text-primary">No Active Assessment Profile Found</h3>
              <p className="text-body text-muted max-width-md">
                You can begin your personalized clinical assessment from Step 01, or load a realistic demonstration profile to explore all explainability and RAG features instantly.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="ayur-empty-dash-actions">
            <Button
              variant="outline"
              size="md"
              leftIcon={<PlayCircle size={16} />}
              onClick={onLoadDemo}
            >
              Load Demo Profile (1-Click Testing)
            </Button>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={onStartAssessment}
            >
              Start Assessment (Step 01) →
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
