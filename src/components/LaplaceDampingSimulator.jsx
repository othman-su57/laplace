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

export default function LaplaceDampingSimulator({ lang = 'ar' }) {
  const [sigma, setSigma] = useState(0); // Damping factor

  const t = {
    ar: {
      title: 'مطرقة الإخماد وخريطة الـ S-Plane',
      chartTitle: 'النظام المنفجر ومطرقة الإخماد',
      unstableLabel: 'Original Unstable Signal', // Keep or translate, it's mostly english in code already but let's translate
      dampingLabel: 'Damping Hammer e^(-σt)',
      resultLabel: 'Resulting Signal',
      hammerStr: 'قوة المطرقة (σ): ',
      stable: 'النظام مستقر (يتقارب)',
      unstable: 'النظام غير مستقر (ينفجر)',
      desc: 'استخدم شريط التمرير لزيادة قيمة $\\sigma$. لاحظ كيف يتم ثني الإشارة المتضخمة وإجبارها على الانخماد نحو الصفر عندما تصبح قيمة $\\sigma$ أكبر من معدل نمو النظام الأصلي.'
    },
    en: {
      title: 'The Damping Hammer and S-Plane Map',
      chartTitle: 'The Exploding System and the Damping Hammer',
      unstableLabel: 'Original Unstable Signal',
      dampingLabel: 'Damping Hammer e^(-σt)',
      resultLabel: 'Resulting Signal',
      hammerStr: 'Hammer Strength (σ): ',
      stable: 'System is stable (Converges)',
      unstable: 'System is unstable (Explodes)',
      desc: 'Use the slider to increase the value of $\\sigma$. Notice how the exploding signal is bent and forced to dampen towards zero when $\\sigma$ becomes greater than the original system\'s growth rate.'
    }
  }[lang] || t.ar;

  const resolution = 200;
  const timeEnd = 5;
  const labels = Array.from({ length: resolution }, (_, i) => (i * timeEnd) / resolution);
  
  // Unstable system (e.g., e^t * sin(5t))
  const unstableData = labels.map(time => Math.exp(1 * time) * Math.sin(5 * time));
  
  // Damping hammer (e^-σt)
  const dampingData = labels.map(time => Math.exp(-sigma * time));
  
  // Resulting dampened signal
  const dampenedData = labels.map((time, i) => unstableData[i] * dampingData[i]);

  const lineOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#f0f0f2' } },
      title: { display: true, text: t.chartTitle, color: '#00e5ff' },
    },
    scales: {
      x: { display: false },
      y: { min: -10, max: 10, ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  return (
    <div className="simulator-container">
      <h3 className="simulator-title">{t.title}</h3>
      
      <div style={{ height: '250px', marginBottom: '20px' }}>
        <Line 
          options={lineOptions} 
          data={{
            labels,
            datasets: [
              { label: t.unstableLabel, data: unstableData, borderColor: '#ff3366', borderDash: [5, 5], borderWidth: 1, pointRadius: 0 },
              { label: t.dampingLabel, data: dampingData, borderColor: '#a1a3a8', borderWidth: 1, pointRadius: 0 },
              { label: t.resultLabel, data: dampenedData, borderColor: '#00e5ff', backgroundColor: 'rgba(0, 229, 255, 0.1)', fill: true, borderWidth: 2, pointRadius: 0 },
            ]
          }} 
        />
      </div>

      <div className="slider-container">
        <label>
          <span>{t.hammerStr}{sigma.toFixed(2)}</span>
          <span style={{ color: sigma > 1 ? '#00ff66' : '#ff3366' }}>{sigma > 1 ? t.stable : t.unstable}</span>
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
        {t.desc}
      </p>
    </div>
  );
}
