import React from 'react';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  let badgeClass = 'bg-secondary text-white';
  let icon = <Clock size={12} />;

  switch (status) {
    case 'PLACED':
      badgeClass = 'bg-info text-dark';
      icon = <Clock size={12} />;
      break;
    case 'CONFIRMED':
      badgeClass = 'bg-primary text-white';
      icon = <CheckCircle2 size={12} />;
      break;
    case 'SHIPPED':
      badgeClass = 'bg-warning text-dark';
      icon = <Truck size={12} />;
      break;
    case 'OUT_FOR_DELIVERY':
      badgeClass = 'bg-warning text-dark';
      icon = <Truck size={12} />;
      break;
    case 'DELIVERED':
      badgeClass = 'bg-success text-white';
      icon = <PackageCheck size={12} />;
      break;
    case 'CANCELLED':
      badgeClass = 'bg-danger text-white';
      icon = <XCircle size={12} />;
      break;
    default:
      break;
  }

  return (
    <span className={`badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 font-monospace fw-bold ${badgeClass}`}>
      {icon} {status}
    </span>
  );
};

export default StatusBadge;
