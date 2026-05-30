import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DivergenceSimulator({ lang = 'ar' }) {
  const [timeEnd, setTimeEnd] = useState(10); // How far in time we look

  const t = {
    ar: {
      title: 'وهم التلاشي والانفجار',
      chartTitle: 'كارثة المالانهاية: تكامل t × cos(t)',
      funcLabel: 'الدالة t × cos(t)',
      areaLabel: 'المساحة التراكمية (التكامل)',
      timeText: 'الزمن (t): ',
      diverge: 'المساحة تتأرجح وتتضخم! (لا تتقارب)',
      desc: 'قم بزيادة الزمن (t). لاحظ كيف أن المساحة التراكمية (الخط الأحمر) لا تستقر عند الصفر رغم أن الدالة تتأرجح بين الموجب والسالب، بل تنفجر مع مرور الزمن بسبب الدفع غير المتكافئ!'
    },
    en: {
      title: 'The Illusion of Fading and Divergence',
      chartTitle: 'The Infinity Catastrophe: Integral of t × cos(t)',
      funcLabel: 'Function t × cos(t)',
      areaLabel: 'Cumulative Area (Integral)',
      timeText: 'Time (t): ',
      diverge: 'Area oscillates and explodes! (Does not converge)',
      desc: 'Increase the time (t). Notice how the cumulative area (red line) does not settle at zero even though the function oscillates between positive and negative; instead, it explodes over time due to uneven pushing!'
    }
  }[lang] || t.ar;

  const resolution = 300;
  const labels = Array.from({ length: resolution }, (_, i) => (i * timeEnd) / resolution);

  // f(t) = t * cos(t)
  const signalData = labels.map(time => time * Math.cos(time));

  // Running integral of t * cos(t)
  // Integral of t*cos(t) is cos(t) + t*sin(t) - 1 (eval from 0 to t)
  const integralData = labels.map(time => Math.cos(time) + time * Math.sin(time) - 1);

  const lineOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#f0f0f2' } },
      title: { display: true, text: t.chartTitle, color: '#ff3366' },
    },
    scales: {
      x: { display: false },
      y: { ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  return (
    <div className="simulator-container">
      <h3 className="simulator-title">{t.title}</h3>

      <div style={{ height: '300px', marginBottom: '20px' }}>
        <Line
          options={lineOptions}
          data={{
            labels,
            datasets: [
              {
                label: t.funcLabel,
                data: signalData,
                borderColor: '#a1a3a8',
                borderWidth: 1,
                pointRadius: 0,
                borderDash: [5, 5]
              },
              {
                label: t.areaLabel,
                data: integralData,
                borderColor: '#ff3366',
                backgroundColor: 'rgba(255, 51, 102, 0.1)',
                fill: true,
                borderWidth: 2,
                pointRadius: 0
              },
            ]
          }}
        />
      </div>

      <div className="slider-container">
        <label>
          <span>{t.timeText}{timeEnd.toFixed(1)}</span>
          <span style={{ color: '#ff3366' }}>{t.diverge}</span>
        </label>
        <input
          type="range"
          min={5}
          max={50}
          step={1}
          value={timeEnd}
          onChange={e => setTimeEnd(parseFloat(e.target.value))}
        />
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#a1a3a8' }}>
        {t.desc}
      </p>
    </div>
  );
}
