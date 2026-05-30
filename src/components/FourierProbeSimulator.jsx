import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FourierProbeSimulator() {
  const [probeFreq, setProbeFreq] = useState(1);
  const hiddenFreq = 3; // The secret frequency we are looking for

  const resolution = 300;
  const timeEnd = 10;
  const labels = Array.from({ length: resolution }, (_, i) => (i * timeEnd) / resolution);
  
  // Noisy signal with hidden frequency
  const signalData = labels.map(t => Math.sin(hiddenFreq * t) + 0.5 * Math.sin(10 * t) + (Math.random() - 0.5));
  
  // Probe signal
  const probeData = labels.map(t => Math.sin(probeFreq * t));
  
  // Product
  const productData = labels.map((t, i) => signalData[i] * probeData[i]);

  // Integration (Resonance)
  let resonance = 0;
  const dt = timeEnd / resolution;
  for (let val of productData) {
    resonance += val * dt;
  }
  const resonanceValue = Math.abs(resonance);

  const lineOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#f0f0f2' } },
      title: { display: true, text: 'الإشارة المشوشة والمسبار (Probe)', color: '#00e5ff' },
    },
    scales: {
      x: { display: false },
      y: { min: -3, max: 3, ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  const barOptions = {
    responsive: true,
    animation: { duration: 200 },
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'قوة الرنين (التكامل)', color: '#00ff66' },
    },
    scales: {
      x: { display: false },
      y: { min: 0, max: 6, ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  return (
    <div className="simulator-container">
      <h3 className="simulator-title">فورييه وصيد الترددات</h3>
      
      <div style={{ height: '200px', marginBottom: '20px' }}>
        <Line 
          options={lineOptions} 
          data={{
            labels,
            datasets: [
              { label: 'Signal (Unknown)', data: signalData, borderColor: '#a1a3a8', borderWidth: 1, pointRadius: 0 },
              { label: `Probe (ω = ${probeFreq.toFixed(1)})`, data: probeData, borderColor: '#00e5ff', borderWidth: 2, pointRadius: 0 },
            ]
          }} 
        />
      </div>

      <div style={{ height: '150px' }}>
        <Bar 
          options={barOptions} 
          data={{
            labels: ['Resonance'],
            datasets: [
              { 
                label: 'Amplitude', 
                data: [resonanceValue], 
                backgroundColor: resonanceValue > 4 ? '#ff3366' : '#00ff66',
              }
            ]
          }} 
        />
      </div>

      <div className="slider-container">
        <label>
          <span>تردد المسبار (ω): {probeFreq.toFixed(1)} Hz</span>
          <span>استجابة الرنين: {resonanceValue.toFixed(2)}</span>
        </label>
        <input 
          type="range" 
          min={0.5} 
          max={5} 
          step={0.1} 
          value={probeFreq} 
          onChange={e => setProbeFreq(parseFloat(e.target.value))} 
        />
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#a1a3a8' }}>
        حرّك شريط التمرير للبحث عن التردد الخفي داخل الإشارة المشوشة. عندما يطابق تردد المسبار التردد الخفي، سيحدث رنين (Spike).
      </p>
    </div>
  );
}
