import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useT } from '../../i18n/useT.js';

export function PrintButton() {
  const { t } = useT();

  return (
    <Button
      variant="outline"
      size="sm"
      icon={Printer}
      onClick={() => window.print()}
      className="print:hidden"
    >
      {t('print')}
    </Button>
  );
}
