import React, { useState, useEffect } from 'react';
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

export default function InnerProductSimulator() {
  const [func1, setFunc1] = useState('sin');
  const [func2, setFunc2] = useState('cos');
  const [period, setPeriod] = useState(2 * Math.PI);

  const getFuncValue = (name, x) => {
    switch (name) {
      case 'sin': return Math.sin(x);
      case 'cos': return Math.cos(x);
      case 'sin2x': return Math.sin(2 * x);
      default: return Math.sin(x);
    }
  };

  const resolution = 200;
  const labels = Array.from({ length: resolution }, (_, i) => (i * period) / resolution);
  
  const data1 = labels.map(x => getFuncValue(func1, x));
  const data2 = labels.map(x => getFuncValue(func2, x));
  const productData = labels.map(x => getFuncValue(func1, x) * getFuncValue(func2, x));

  let integral = 0;
  const dx = period / resolution;
  for (let val of productData) {
    integral += val * dx;
  }

  const chartOptions1 = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#f0f0f2' } },
      title: { display: true, text: 'الدوال الأصلية', color: '#00e5ff' },
    },
    scales: {
      x: { display: false },
      y: { min: -1.5, max: 1.5, ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  const chartOptions2 = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'حاصل الضرب f(t) × g(t) والمساحة', color: '#00e5ff' },
    },
    scales: {
      x: { display: false },
      y: { min: -1.5, max: 1.5, ticks: { color: '#a1a3a8' }, grid: { color: '#2a2d36' } }
    }
  };

  return (
    <div className="simulator-container">
      <h3 className="simulator-title">محاكاة التطابق والإسقاط الرياضي</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
        <select value={func1} onChange={e => setFunc1(e.target.value)} style={{ padding: '0.5rem', background: '#1a1d24', color: '#fff', border: '1px solid #2a2d36', borderRadius: '4px' }}>
          <option value="sin">Sin(t)</option>
          <option value="cos">Cos(t)</option>
          <option value="sin2x">Sin(2t)</option>
        </select>
        <select value={func2} onChange={e => setFunc2(e.target.value)} style={{ padding: '0.5rem', background: '#1a1d24', color: '#fff', border: '1px solid #2a2d36', borderRadius: '4px' }}>
          <option value="sin">Sin(t)</option>
          <option value="cos">Cos(t)</option>
          <option value="sin2x">Sin(2t)</option>
        </select>
      </div>

      <div style={{ height: '200px', marginBottom: '20px' }}>
        <Line 
          options={chartOptions1} 
          data={{
            labels,
            datasets: [
              { label: 'f(t)', data: data1, borderColor: '#8a2be2', tension: 0.4, pointRadius: 0 },
              { label: 'g(t)', data: data2, borderColor: '#00ff66', tension: 0.4, pointRadius: 0 },
            ]
          }} 
        />
      </div>

      <div style={{ height: '200px' }}>
        <Line 
          options={chartOptions2} 
          data={{
            labels,
            datasets: [
              { 
                label: 'Product', 
                data: productData, 
                borderColor: '#00e5ff', 
                backgroundColor: 'rgba(0, 229, 255, 0.2)',
                fill: true,
                tension: 0.4, 
                pointRadius: 0 
              }
            ]
          }} 
        />
      </div>

      <div className="slider-container">
        <label>
          <span>فترة التكامل (T): {(period / Math.PI).toFixed(2)}π</span>
          <span>المساحة الإجمالية (التكامل): {integral.toFixed(4)}</span>
        </label>
        <input 
          type="range" 
          min={0.1} 
          max={4 * Math.PI} 
          step={0.1} 
          value={period} 
          onChange={e => setPeriod(parseFloat(e.target.value))} 
        />
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: Math.abs(integral) < 0.1 ? '#00ff66' : '#ff3366' }}>
        {Math.abs(integral) < 0.1 ? 'الدالتان متعامدتان (المساحات تلغي بعضها)!' : 'يوجد تطابق بين الدالتين (التكامل لا يساوي صفر).'}
      </p>
    </div>
  );
}
