import React, { useState } from 'react';
import { DollarSign, TrendingUp, Sliders, CheckCircle2, FileSpreadsheet, ArrowRight, ShieldCheck } from 'lucide-react';

export const PricingEconomicsView: React.FC = () => {
  const [wholesaleDelta, setWholesaleDelta] = useState(-0.3);

  const basePrice = 9.8;
  const newAcquisitionPrice = basePrice + wholesaleDelta;
  const consumerPrice = (newAcquisitionPrice * 1.45).toFixed(2);
  const estimatedVolumeIncrease = Math.round(Math.abs(wholesaleDelta) * 61333);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c1c7cf] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#00334f]">Wholesale Pricing &amp; Margin Modeling</h2>
          <p className="text-xs text-[#41474e] mt-1">
            Simulate wholesale unit pricing impact on retail pharmacy adoption, consumer basket savings, and ranking algorithm placement.
          </p>
        </div>
        <button
          onClick={() => alert('Exporting Wholesale Price Schedule to EDI 832 format...')}
          className="h-8 px-3 bg-white border border-[#c1c7cf] hover:bg-[#eff4ff] text-[#00334f] text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-2xs self-start"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#006398]" />
          <span>Export Price Book (EDI 832)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#72787f] font-semibold uppercase">
            <span>Average Wholesale Margin</span>
            <DollarSign className="w-4 h-4 text-[#005137]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#00334f] tabular-nums font-mono">41.8%</span>
            <span className="text-xs text-[#005137] font-semibold">+3.4% YoY</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">Direct cGMP manufacturer to pharmacy rails</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#72787f] font-semibold uppercase">
            <span>Pharmacy Retained Gross Margin</span>
            <TrendingUp className="w-4 h-4 text-[#006398]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#00334f] tabular-nums font-mono">31.0%</span>
            <span className="text-xs text-[#006398] font-semibold">Healthy Tier</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">Displaces PBM rebate clawbacks</p>
        </div>

        <div className="bg-white border border-[#c1c7cf] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#72787f] font-semibold uppercase">
            <span>Consumer Cash Savings</span>
            <ShieldCheck className="w-4 h-4 text-[#00334f]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#005137] tabular-nums font-mono">76.4%</span>
            <span className="text-xs text-[#003825] font-semibold">vs Brand Innovator</span>
          </div>
          <p className="text-[11px] text-[#72787f] mt-1">Zero deductible gatekeeping</p>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#c1c7cf] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c1c7cf] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#00334f] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#006398]" />
                Price Elasticity Simulator (Atorvastatin 20mg)
              </h3>
              <p className="text-xs text-[#72787f]">Slide wholesale variance to project order demand and ranking shifts</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#0b1c30]">Wholesale Variance Per Pack:</span>
              <span className="font-mono font-bold text-sm text-[#00334f]">
                {wholesaleDelta >= 0 ? `+$${wholesaleDelta.toFixed(2)}` : `-$${Math.abs(wholesaleDelta).toFixed(2)}`}
              </span>
            </div>

            <input
              type="range"
              min="-1.50"
              max="1.50"
              step="0.10"
              value={wholesaleDelta}
              onChange={(e) => setWholesaleDelta(parseFloat(e.target.value))}
              className="w-full accent-[#006398] cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-[#72787f] font-mono">
              <span>-$1.50 (Aggressive Volume)</span>
              <span>Baseline ($9.80)</span>
              <span>+$1.50 (Margin Maximizer)</span>
            </div>
          </div>

          <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c1c7cf] space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#41474e]">Pharmacy Net Acquisition:</span>
              <span className="font-mono font-bold text-[#00334f]">${newAcquisitionPrice.toFixed(2)} / unit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#41474e]">Recommended Patient Cash Price:</span>
              <span className="font-mono font-bold text-[#005137]">${consumerPrice} / 30-day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#41474e]">Projected Monthly Order Surge:</span>
              <span className="font-mono font-bold text-[#006398]">+{estimatedVolumeIncrease.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#c1c7cf]">
              <span className="text-[#41474e]">Discovery Engine Ranking:</span>
              <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#003825] font-bold text-[11px]">
                {wholesaleDelta <= -0.2 ? '#1 Lowest Cost Bioequivalent' : '#2 Ranked Generic'}
              </span>
            </div>
          </div>
        </div>

        {/* Tiered Wholesale Matrix */}
        <div className="bg-white border border-[#c1c7cf] rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-[#c1c7cf] pb-3">
            <h3 className="text-base font-bold text-[#00334f]">Volume Discount Tiering</h3>
            <p className="text-xs text-[#72787f]">Standard wholesale contract bands for Apollo Health and regional dispensary networks</p>
          </div>

          <div className="space-y-3">
            {[
              { tier: 'Tier 1 (Small / Independent)', range: '500 - 2,500 packs/mo', price: '$10.40', discount: 'Base' },
              { tier: 'Tier 2 (Regional Chains)', range: '2,500 - 15,000 packs/mo', price: '$9.50', discount: '-8.6%' },
              { tier: 'Tier 3 (Enterprise Apollo Tenant)', range: '15,000+ packs/mo', price: '$8.80', discount: '-15.4%' },
            ].map((t) => (
              <div key={t.tier} className="p-3 bg-[#f8f9ff] border border-[#c1c7cf] rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#00334f]">{t.tier}</div>
                  <div className="text-[11px] text-[#72787f]">{t.range}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#005137]">{t.price}</div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#dce9ff] text-[#00334f] font-semibold">{t.discount}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('New volume contract proposal drafted and sent to Tenant Admin review.')}
            className="w-full h-9 bg-[#00334f] hover:bg-[#0c4a6e] text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Draft New Tiered Contract</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
