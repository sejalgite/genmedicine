import React from 'react';
import { Pill, TrendingUp, ArrowUpRight, BarChart2, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const MarketSubstitutionView: React.FC = () => {
  const comparisons = [
    {
      generic: 'Cipla Atorvastatin 20mg',
      brand: 'Pfizer Lipitor® 20mg',
      category: 'Cardiovascular',
      genericPrice: '$14.20',
      brandPrice: '$88.50',
      savings: '84%',
      switchRate: '66%',
      monthlyVolume: '142,000 units',
    },
    {
      generic: 'Cipla Metformin 500mg ER',
      brand: 'Merck Glucophage® XR 500mg',
      category: 'Metabolic & Endocrine',
      genericPrice: '$4.80',
      brandPrice: '$42.00',
      savings: '88%',
      switchRate: '74%',
      monthlyVolume: '185,000 units',
    },
    {
      generic: 'Cipla Azithromycin 250mg',
      brand: 'Pfizer Zithromax® 250mg',
      category: 'Anti-Infectives',
      genericPrice: '$9.10',
      brandPrice: '$35.00',
      savings: '74%',
      switchRate: '61%',
      monthlyVolume: '62,000 units',
    },
    {
      generic: 'Cipla Rosuvastatin 10mg',
      brand: 'AstraZeneca Crestor® 10mg',
      category: 'Cardiovascular',
      genericPrice: '$16.00',
      brandPrice: '$76.00',
      savings: '79%',
      switchRate: '69%',
      monthlyVolume: '94,000 units',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c1c7cf] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#00334f]">Innovator Displacement &amp; Market Substitution</h2>
          <p className="text-xs text-[#41474e] mt-1">
            Real-time patient discovery conversions from high-priced branded innovators to FDA Orange Book certified AB-rated generics.
          </p>
        </div>
        <button
          onClick={() => alert('Exporting innovator displacement report...')}
          className="h-8 px-3 bg-white border border-[#c1c7cf] hover:bg-[#eff4ff] text-[#00334f] text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-2xs self-start"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#006398]" />
          <span>Export Analytics</span>
        </button>
      </div>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisons.map((c) => (
          <div key={c.generic} className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#00334f] font-semibold">
                  {c.category}
                </span>
                <h3 className="font-bold text-sm text-[#00334f] mt-1.5">{c.generic}</h3>
                <p className="text-xs text-[#72787f]">Displacing: <strong className="text-[#0b1c30]">{c.brand}</strong></p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#dce9ff] text-[#003825]">
                  -{c.savings} Savings
                </span>
                <div className="text-lg font-bold text-[#003825] font-mono mt-1">{c.genericPrice}</div>
                <div className="text-xs text-[#72787f] line-through font-mono">{c.brandPrice}</div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#c1c7cf]">
              <div className="flex justify-between text-xs">
                <span className="text-[#41474e] font-medium">Consumer Switch Rate:</span>
                <span className="font-bold text-[#00334f]">{c.switchRate} ({c.monthlyVolume})</span>
              </div>
              <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#006398] rounded-full" style={{ width: c.switchRate }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
