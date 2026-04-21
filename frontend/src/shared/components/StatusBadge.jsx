import React from 'react';
import { STATUS_CONFIG } from '../constants/statusConfig';

const StatusBadge = ({ statusId }) => {
    const cfg = STATUS_CONFIG[statusId] || STATUS_CONFIG['S1'];
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
            {cfg.label}
        </span>
    );
};

export default StatusBadge;
