// client/src/pages/Trade/components/Pagination.tsx
import React from 'react';
import Pagination from '../../../components/ui/Pagination';

// Это просто реэкспорт общего компонента с настройками для Trade
const TradePagination: React.FC<any> = (props) => {
  return <Pagination {...props} color="custom" size="medium" />;
};

export default TradePagination;