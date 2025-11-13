import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface MemoizedCardProps {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export const MemoizedCard = memo(function MemoizedCard({ className, children, onClick }: MemoizedCardProps) {
  return (
    <Card className={className} onClick={onClick}>
      {children}
    </Card>
  );
});

interface MemoizedCardWithContentProps {
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export const MemoizedCardWithContent = memo(function MemoizedCardWithContent({ 
  className, 
  contentClassName,
  children, 
  onClick 
}: MemoizedCardWithContentProps) {
  return (
    <Card className={className} onClick={onClick}>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
});

interface MemoizedCardWithHeaderProps {
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  title?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
}

export const MemoizedCardWithHeader = memo(function MemoizedCardWithHeader({ 
  className, 
  headerClassName,
  contentClassName,
  title,
  children, 
  onClick 
}: MemoizedCardWithHeaderProps) {
  return (
    <Card className={className} onClick={onClick}>
      {title && (
        <CardHeader className={headerClassName}>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
});
