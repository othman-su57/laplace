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

export default function LaplaceDampingSimulator() {
  const [sigma, setSigma] = useState(0); // Damping factor

  const resolution = 200;
  const timeEnd = 5;
  const labels = Array.from({ length: resolution }, (_, i) => (i * timeEnd) / resolution);
  
  // Unstable system (e.g., e^t * sin(5t))
  const unstableData = labels.map(t => Math.exp(1 * t) * Math.sin(5 * t));
  
  // Damping hammer (e^-σt)
  const dampingData = labels.map(t => Math.exp(-sigma * t));
  
  // Resulting dampened signal
  const dampenedData = labels.map((t, i) => unstableData[i] * dampingData[i]);

  const lineOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#f0f0f2' } },
      title: { display: true, text: 'النظام المنفجر ومطرقة الإخماد', color: '#00e5ff' },
    },
    scales: {
      x: { display: false },
      y: { min: -10, max: 10, ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  return (
    <div className="simulator-container">
      <h3 className="simulator-title">مطرقة الإخماد وخريطة الـ S-Plane</h3>
      
      <div style={{ height: '250px', marginBottom: '20px' }}>
        <Line 
          options={lineOptions} 
          data={{
            labels,
            datasets: [
              { label: 'Original Unstable Signal', data: unstableData, borderColor: '#ff3366', borderDash: [5, 5], borderWidth: 1, pointRadius: 0 },
              { label: 'Damping Hammer e^(-σt)', data: dampingData, borderColor: '#a1a3a8', borderWidth: 1, pointRadius: 0 },
              { label: 'Resulting Signal', data: dampenedData, borderColor: '#00e5ff', backgroundColor: 'rgba(0, 229, 255, 0.1)', fill: true, borderWidth: 2, pointRadius: 0 },
            ]
          }} 
        />
      </div>

      <div className="slider-container">
        <label>
          <span>قوة المطرقة (σ): {sigma.toFixed(2)}</span>
          <span style={{ color: sigma > 1 ? '#00ff66' : '#ff3366' }}>{sigma > 1 ? 'النظام مستقر (يتقارب)' : 'النظام غير مستقر (ينفجر)'}</span>
        </label>
        <input 
          type="range" 
          min={-1} 
          max={3} 
          step={0.1} 
          value={sigma} 
          onChange={e => setSigma(parseFloat(e.target.value))} 
        />
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#a1a3a8' }}>
        استخدم شريط التمرير لزيادة قيمة $\sigma$. لاحظ كيف يتم ثني الإشارة المتضخمة وإجبارها على الانخماد نحو الصفر عندما تصبح قيمة $\sigma$ أكبر من معدل نمو النظام الأصلي.
      </p>
    </div>
  );
}
