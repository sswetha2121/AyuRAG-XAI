import React from 'react';
import './DashboardHeader.css';
import { Badge, Button } from '../ui';
import {
  Sparkles,
  Printer,
  Download,
  RotateCcw,
  ShieldCheck,
  Calendar,
  User,
  CheckCircle2
} from 'lucide-react';

export const DashboardHeader = ({
  patientName = 'Assessment User',
  generatedAt = '',
  constitutionType = 'Vata-Pitta',
  onReevaluate,
  onTriggerToast,
  className = ''
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    onTriggerToast?.({
      type: 'success',
      title: 'Report Exported',
      message: 'Personalized Clinical Assessment Summary compiled for session records.'
    });
  };

  return (
    <div className={`ayur-dashboard-header ${className}`.trim()}>
      <div className="ayur-dash-header-top">
        <div className="flex items-center gap-xs flex-wrap">
          <Badge color="accent" variant="solid" size="md" icon={<Sparkles size={13} />}>
            AI Decision Support & XAI Dashboard
          </Badge>
          <Badge color="primary" variant="subtle" size="md">
            {constitutionType}
          </Badge>
          <span className="ayur-dash-timestamp">
            <Calendar size={13} />
            <span>Generated: {generatedAt || 'Today'}</span>
          </span>
        </div>

        <div className="ayur-dash-header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer size={14} />}
            onClick={handlePrint}
          >
            Print Summary
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExport}
          >
            Export Report
          </Button>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
            onClick={onReevaluate}
            title="Recalibrate responses"
          >
            Re-evaluate
          </Button>
        </div>
      </div>

      <div className="ayur-dash-header-content">
        <h1 className="ayur-dash-title">
          Personalized Ayurvedic Profile for <span className="ayur-dash-patient">{patientName}</span>
        </h1>

        <p className="ayur-dash-desc">
          An explainable, multi-domain clinical intelligence summary integrating baseline constitution (Prakṛti), circadian lifestyle (Dinacaryā), dietary fire (Agni), and active symptom manifestations.
        </p>
      </div>
    </div>
  );
};
