import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/services/api';

interface MockDataNoticeProps {
  className?: string;
}

export const MockDataNotice: React.FC<MockDataNoticeProps> = ({ className }) => {
  const [mockDataStatus, setMockDataStatus] = React.useState({
    isUsingMockData: false,
    notice: null as string | null
  });

  React.useEffect(() => {
    // Check mock data status every 5 seconds
    const interval = setInterval(() => {
      const status = apiClient.getMockDataStatus();
      setMockDataStatus(status);
    }, 5000);

    // Initial check
    const status = apiClient.getMockDataStatus();
    setMockDataStatus(status);

    return () => clearInterval(interval);
  }, []);

  if (!mockDataStatus.isUsingMockData || !mockDataStatus.notice) {
    return null;
  }

  return (
    <Alert variant="warning" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center gap-2">
        <span className="font-medium">Mock Data Active:</span>
        {mockDataStatus.notice}
      </AlertDescription>
    </Alert>
  );
};

export default MockDataNotice; 