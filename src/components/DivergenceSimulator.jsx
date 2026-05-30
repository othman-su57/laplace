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

export default function DivergenceSimulator() {
  const [timeEnd, setTimeEnd] = useState(10); // How far in time we look

  const resolution = 300;
  const labels = Array.from({ length: resolution }, (_, i) => (i * timeEnd) / resolution);
  
  // f(t) = t * cos(t)
  const signalData = labels.map(t => t * Math.cos(t));
  
  // Running integral of t * cos(t)
  // Integral of t*cos(t) is cos(t) + t*sin(t) - 1 (eval from 0 to t)
  const integralData = labels.map(t => Math.cos(t) + t * Math.sin(t) - 1);

  const lineOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#f0f0f2' } },
      title: { display: true, text: 'كارثة المالانهاية: تكامل t × cos(t)', color: '#ff3366' },
    },
    scales: {
      x: { display: false },
      y: { ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  return (
    <div className="simulator-container">
      <h3 className="simulator-title">وهم التلاشي والانفجار</h3>
      
      <div style={{ height: '300px', marginBottom: '20px' }}>
        <Line 
          options={lineOptions} 
          data={{
            labels,
            datasets: [
              { 
                label: 'الدالة t × cos(t)', 
                data: signalData, 
                borderColor: '#a1a3a8', 
                borderWidth: 1, 
                pointRadius: 0,
                borderDash: [5, 5]
              },
              { 
                label: 'المساحة التراكمية (التكامل)', 
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
          <span>الزمن (t): {timeEnd.toFixed(1)}</span>
          <span style={{ color: '#ff3366' }}>المساحة تتأرجح وتتضخم! (لا تتقارب)</span>
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
        قم بزيادة الزمن (t). لاحظ كيف أن المساحة التراكمية (الخط الأحمر) لا تستقر عند الصفر رغم أن الدالة تتأرجح بين الموجب والسالب، بل تنفجر مع مرور الزمن بسبب الدفع غير المتكافئ!
      </p>
    </div>
  );
}
