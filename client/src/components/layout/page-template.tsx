import { PageHeader } from "./page-header";

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  headerActions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export function PageTemplate({ 
  title, 
  subtitle, 
  showBackButton = true, 
  backPath,
  headerActions,
  className = "",
  children,
  showBottomNav = true
}: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backPath={backPath}
      >
        {headerActions}
      </PageHeader>
      
      <div className={`px-4 pt-24 ${showBottomNav ? 'pb-20 lg:pb-4' : 'pb-4'} ${className}`}>
        {children}
      </div>
    </div>
  );
}