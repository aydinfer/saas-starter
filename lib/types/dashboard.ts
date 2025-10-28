export interface PriorityFix {
  id: number;
  name: string;
  currentImpact: number;
  recoveryPotential: number;
  recoveryPercentage: number;
  timeRequired: string;
  roi: number;
  customers: {
    total?: number;
    abandoned?: number;
    avgOrder?: number;
    targetOrder?: number;
  };
  primaryCause: string;
  fix: string;
  steps: ImplementationStep[];
}

export interface ImplementationStep {
  name: string;
  done: boolean;
  time?: string;
}

export interface CompletedFix {
  name: string;
  impact: number;
  time: string;
}

export interface DashboardSummary {
  totalLoss: number;
  totalRecoverable: number;
  dailyLoss: number;
  currentRevenue: number;
  completedRecovery: number;
  totalTimeInvested: number;
}

export interface CartAbandonmentAnalysis {
  success: boolean;
  organization_id: string;
  analysis_result: {
    primary_causes: Array<{
      cause: string;
      impact_percentage: number;
      estimated_monthly_loss: number;
    }>;
    recovery_opportunities: Array<{
      strategy: string;
      recovery_potential_percentage: number;
      estimated_monthly_recovery: number;
      implementation_time: string;
    }>;
    implementation_roadmap: Array<{
      step: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      estimated_time: string;
      roi_per_minute: number;
    }>;
  };
  circuit_breaker_status: {
    comprehensive_circuit_open: boolean;
    friction_circuit_open: boolean;
    recovery_circuit_open: boolean;
  };
  metadata: {
    analysis_type: string;
    processing_time_ms: number;
    timestamp: string;
    services_used: string[];
  };
}
