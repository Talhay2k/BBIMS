import React from 'react';
import { AuditLog, DiscardLog } from './types';
import { FileText, ShieldCheck, Download, AlertTriangle } from 'lucide-react';

interface AuditTabProps {
    auditLogs: AuditLog[];
    discardLogs: DiscardLog[];
}

export const AuditComplianceTab: React.FC<AuditTabProps> = ({
    auditLogs,
    discardLogs,
}) => {
    const exportCSV = () => {
        const headers = [
            'Timestamp',
            'User/Staff',
            'Action',
            'Entity Type',
            'Entity ID',
            'Details',
            'Signature Hash',
        ];
        const rows = auditLogs.map((l) => [
            `"${l.timestamp}"`,
            `"${l.userStaff}"`,
            `"${l.action}"`,
            `"${l.entityType}"`,
            `"${l.entityId}"`,
            `"${l.details.replace(/"/g, '""')}"`,
            `"${l.digitalSignatureHash}"`,
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute(
            'download',
            `BBIMS_Audit_Compliance_Report_${new Date().toISOString().split('T')[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-600/20 p-3 text-emerald-400">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">
                                HIPAA & FDA Regulatory Audit Log
                            </h2>
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                                Immutable Cryptographic Hash Logs
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Complete chain of custody tracing for blood intake,
                            electronic cross-matching, discards, and donor PHI
                            protection.
                        </p>
                    </div>
                </div>

                <button
                    onClick={exportCSV}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-500 active:scale-95"
                >
                    <Download className="h-4 w-4" />
                    Export Compliance CSV Report
                </button>
            </div>

            {/* Audit Logs Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        System Audit Logs ({auditLogs.length} Entries)
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">Authorized Staff</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Target ID</th>
                                <th className="px-4 py-3">Audit Details</th>
                                <th className="px-4 py-3 text-right">
                                    Digital Signature Hash
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {auditLogs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="transition hover:bg-slate-800/40"
                                >
                                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-200">
                                        {log.userStaff}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-200">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono font-bold text-purple-400">
                                        {log.entityId}
                                    </td>
                                    <td className="max-w-md truncate px-4 py-3 text-slate-300">
                                        {log.details}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-[11px] text-emerald-400">
                                        {log.digitalSignatureHash}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Discard Logs Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                        Blood Discard Log ({discardLogs.length} Entries)
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                                <th className="px-4 py-3">Discard Date</th>
                                <th className="px-4 py-3">Unit Barcode</th>
                                <th className="px-4 py-3">Type & Component</th>
                                <th className="px-4 py-3">Discard Reason</th>
                                <th className="px-4 py-3">Facility</th>
                                <th className="px-4 py-3 text-right">
                                    Performed By
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {discardLogs.map((dsc) => (
                                <tr
                                    key={dsc.id}
                                    className="transition hover:bg-slate-800/40"
                                >
                                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                                        {dsc.discardDate}
                                    </td>
                                    <td className="px-4 py-3 font-mono font-bold text-rose-400">
                                        {dsc.unitNumber}
                                    </td>
                                    <td className="px-4 py-3 text-slate-200">
                                        {dsc.bloodType} ({dsc.component})
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-300">
                                            {dsc.reason}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {dsc.facilityName}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-300">
                                        {dsc.performedBy}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
