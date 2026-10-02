import React from 'react';
import { AiForecastData } from './types';
import { TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface AiTabProps {
    aiData: AiForecastData | null;
}

export const AiForecastTab: React.FC<AiTabProps> = ({ aiData }) => {
    if (!aiData) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-400">
                Loading AI Expiry Risk & Demand Forecast...
            </div>
        );
    }

    const chartData = aiData.forecastingTable.map((item) => ({
        name: item.bloodType,
        'Current Stock': item.currentStock,
        '14-Day Projected Demand': item.projected14DayDemand,
    }));

    return (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="rounded-2xl border border-purple-800/40 bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-slate-900 p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-purple-500/30 bg-purple-600/20 p-3 text-purple-400">
                            <Sparkles className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-white">
                                    AI Expiry Prediction & Demand Forecast
                                </h2>
                                <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                                    Confidence:{' '}
                                    {(aiData.confidenceScore * 100).toFixed(0)}%
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Machine learning algorithms analyze historical
                                hospital consumption velocity and stock aging
                                curves to prevent stockouts & waste.
                            </p>
                        </div>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                        <span>Last AI Model Sync:</span>
                        <div className="font-mono font-semibold text-slate-200">
                            {aiData.generatedAt
                                .substring(0, 19)
                                .replace('T', ' ')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Demand vs Stock Chart */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <h3 className="flex items-center gap-2 text-base font-bold text-white">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    14-Day Demand Forecast vs Current Available Stock
                </h3>

                <div className="h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#334155"
                            />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: '#334155',
                                    borderRadius: '0.75rem',
                                    color: '#f8fafc',
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar
                                dataKey="Current Stock"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="14-Day Projected Demand"
                                fill="#f43f5e"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recommendations & Risk Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* AI Recommendations */}
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                    <h3 className="flex items-center gap-2 border-b border-slate-800 pb-3 text-base font-bold text-white">
                        <Sparkles className="h-5 w-5 text-rose-400" />
                        AI Actionable Recommendations
                    </h3>

                    <div className="space-y-3">
                        {aiData.recommendations.map((rec) => (
                            <div
                                key={rec.id}
                                className={`flex items-start gap-3 rounded-xl border p-4 text-xs ${
                                    rec.priority === 'High'
                                        ? 'border-rose-500/40 bg-rose-950/20 text-slate-200'
                                        : 'border-slate-800 bg-slate-950/70 text-slate-300'
                                }`}
                            >
                                <span
                                    className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                        rec.priority === 'High'
                                            ? 'border border-rose-500/30 bg-rose-500/20 text-rose-400'
                                            : 'border border-amber-500/30 bg-amber-500/20 text-amber-300'
                                    }`}
                                >
                                    {rec.priority} Priority
                                </span>
                                <div>
                                    <div className="mb-0.5 font-bold text-white">
                                        {rec.category}
                                    </div>
                                    <p className="leading-relaxed text-slate-300">
                                        {rec.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expiry Risk Units Alert Box */}
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                    <h3 className="flex items-center gap-2 border-b border-slate-800 pb-3 text-base font-bold text-white">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        High Expiry Risk Units (&le; 7 Days Remaining)
                    </h3>

                    <div className="no-scrollbar max-h-72 space-y-2 overflow-y-auto">
                        {aiData.expiringUnitsList.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-500">
                                No units are currently at risk of expiry within
                                7 days.
                            </div>
                        ) : (
                            aiData.expiringUnitsList.map((item) => (
                                <div
                                    key={item.unit.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs"
                                >
                                    <div>
                                        <div className="font-mono font-bold text-white">
                                            {item.unit.unitNumber} (
                                            {item.unit.bloodType})
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                            {item.unit.facilityName}
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded border px-2.5 py-1 text-xs font-bold ${
                                            item.daysRemaining <= 2
                                                ? 'animate-pulse border-rose-500/30 bg-rose-500/20 text-rose-400'
                                                : 'border-amber-500/30 bg-amber-500/20 text-amber-300'
                                        }`}
                                    >
                                        Expires in {item.daysRemaining}d
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
