import { useEffect, useRef } from 'react';

const Chart = ({ 
  data, 
  type = 'line', 
  title,
  labels,
  className = '' 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get max value for scaling
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    // Padding
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    if (type === 'line') {
      drawLineChart(ctx, data, width, height, padding, chartWidth, chartHeight, maxValue, minValue, range, labels);
    } else if (type === 'bar') {
      drawBarChart(ctx, data, width, height, padding, chartWidth, chartHeight, maxValue, minValue, range, labels);
    } else if (type === 'area') {
      drawAreaChart(ctx, data, width, height, padding, chartWidth, chartHeight, maxValue, minValue, range, labels);
    }
  }, [data, type, labels]);

  const drawLineChart = (ctx, data, width, height, padding, chartWidth, chartHeight, maxValue, minValue, range, labels) => {
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / range) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / range) * chartHeight;

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw labels
    if (labels && labels.length === data.length) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      labels.forEach((label, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        ctx.fillText(label, x, height - padding + 20);
      });
    }
  };

  const drawBarChart = (ctx, data, width, height, padding, chartWidth, chartHeight, maxValue, minValue, range, labels) => {
    const barWidth = chartWidth / data.length * 0.8;
    const gap = chartWidth / data.length * 0.2;

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    data.forEach((value, index) => {
      const x = padding + (barWidth + gap) * index + gap / 2;
      const barHeight = ((value - minValue) / range) * chartHeight;
      const y = height - padding - barHeight;

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });

    // Draw labels
    if (labels && labels.length === data.length) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      labels.forEach((label, index) => {
        const x = padding + (barWidth + gap) * index + gap / 2 + barWidth / 2;
        ctx.fillText(label, x, height - padding + 20);
      });
    }
  };

  const drawAreaChart = (ctx, data, width, height, padding, chartWidth, chartHeight, maxValue, minValue, range, labels) => {
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / range) * chartHeight;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / range) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw labels
    if (labels && labels.length === data.length) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      labels.forEach((label, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        ctx.fillText(label, x, height - padding + 20);
      });
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full"
      />
    </div>
  );
};

export default Chart;

