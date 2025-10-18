import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SatellitesChart = ({ 
  groupId, 
  positions: propPositions, 
  serverUrl, 
  email, 
  password 
}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalDevices, setTotalDevices] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);

  useEffect(() => {
    if (!groupId) {
      setError('لطفاً groupId رو به عنوان prop بدید.');
      setLoading(false);
      return;
    }

    let positions = propPositions;
    if (!positions || positions.length === 0) {
      // fallback: fetch
      const useSession = !serverUrl || !email || !password;
      const url = useSession 
        ? `/api/positions?groupId=${groupId}`
        : `${serverUrl}/api/positions?groupId=${groupId}`;

      const fetchOptions = useSession 
        ? {
            credentials: 'include',
            headers: { Accept: 'application/json' },
          }
        : {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${btoa(`${email}:${password}`)}`,
              'Content-Type': 'application/json',
            },
          };

      console.log('Fetching positions with URL:', url);
      fetch(url, fetchOptions)
        .then(response => {
          console.log('Response status:', response.status, response.statusText);
          if (!response.ok) throw new Error(`خطا در API: ${response.status}`);
          return response.json();
        })
        .then(data => {
          positions = data;
          console.log('Fetched positions length:', positions.length);
          console.log('Sample positions:', positions.slice(0, 3));  // لاگ نمونه برای چک satellites
          processData(positions);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      console.log('Using prop positions length:', positions.length);
      processData(positions);
    }

    // fetch total devices
    const useSession = !serverUrl || !email || !password;
    const fetchOptions = useSession 
      ? {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        }
      : {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`${email}:${password}`)}`,
            'Content-Type': 'application/json',
          },
        };
    const devicesUrl = useSession ? `/api/devices?groupId=${groupId}` : `${serverUrl}/api/devices?groupId=${groupId}`;
    fetch(devicesUrl, fetchOptions)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setTotalDevices(data.length);
        console.log('Total devices in group:', data.length);
      })
      .catch(() => setTotalDevices(0));

    function processData(posData) {
      // فیکس: unique positions by deviceId (اگر duplicate باشه)
      const uniqueMap = new Map();
      posData.forEach(pos => {
        if (pos.deviceId) {
          uniqueMap.set(pos.deviceId, pos);  // آخرین position برای هر device
        }
      });
      const uniquePositions = Array.from(uniqueMap.values());
      console.log('Unique positions by deviceId length:', uniquePositions.length);

      // لاگ satellites برای هر unique position
      uniquePositions.forEach((pos, index) => {
        console.log(`Device ${pos.deviceId} satellites:`, pos.satellites);
      });

      const satelliteCounts = uniquePositions.map(pos => pos.satellites || 0);
      console.log('All satellite counts:', satelliteCounts);
      setActiveDevices(uniquePositions.length);

      const categories = {
        'کمتر از 4 (ضعیف)': 0,
        '4-6 (متوسط)': 0,
        '7-9 (خوب)': 0,
        '10+ (عالی)': 0
      };
      satelliteCounts.forEach(count => {
        if (count < 4) categories['کمتر از 4 (ضعیف)']++;
        else if (count <= 6) categories['4-6 (متوسط)']++;
        else if (count <= 9) categories['7-9 (خوب)']++;
        else categories['10+ (عالی)']++;
      });

      const data = {
        labels: Object.keys(categories),
        datasets: [{
          label: 'تعداد ماشین‌ها',
          data: Object.values(categories),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      };

      setChartData(data);
      setLoading(false);
    }
  }, [groupId, propPositions, serverUrl, email, password]);

  if (loading) return <p>در حال بارگذاری چارت ماهواره‌ها...</p>;
  if (error) return <p style={{ color: 'red' }}>خطا: {error}</p>;
  if (!chartData) return <p>هیچ داده‌ای یافت نشد.</p>;

  const totalActive = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `توزیع تعداد ماهواره‌ها در گروه (${totalActive} دستگاه فعال از ${totalDevices} کل)`
      },
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'تعداد ماشین‌ها' }
      },
      x: {
        title: { display: true, text: 'دسته‌بندی دقت GPS' }
      }
    }
  };

  return (
    <div style={{ direction: 'rtl', width: '100%', height: '400px', marginTop: '20px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SatellitesChart;