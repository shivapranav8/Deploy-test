export interface AuditIssue {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    category: string;
    location: string;
    issue: string;
    detail: string;       // why it matters + what goes wrong if ignored
    suggestion: string;   // specific, multi-point actionable fix
    status: 'open' | 'addressed' | 'dismissed';
}

export interface AuditData {
    fileName: string;
    analyzedDate: string;
    totalSheets: number;
    totalUseCases: number;
    score: number;
    issues: AuditIssue[];
    summary: {
        critical: number;
        warnings: number;
        info: number;
    };
}
