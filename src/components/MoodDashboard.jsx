import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function MoodDashboard({ moodData }) {
  const [chartType, setChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('week')

  const processData = () => {
    if (!moodData.length) return null

    const filteredData = moodData.slice(0, timeRange === 'week' ? 7 : 30)
    
    const labels = filteredData.map(item => item.date).reverse()
    const sentiments = filteredData.map(item => Math.round(item.sentiment * 100)).reverse()
    
    const moodCounts = filteredData.reduce((acc, item) => {
      acc[item.mood] = (acc[item.mood] || 0) + 1
      return acc
    }, {})

    return { labels, sentiments, moodCounts }
  }

  const data = processData()

  const lineChartData = data ? {
    labels: data.labels,
    datasets: [
      {
        label: 'Mood Score (%)',
        data: data.sentiments,
        borderColor: '#DDA0DD',
        backgroundColor: 'rgba(221, 160, 221, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#E6E6FA',
        pointBorderColor: '#DDA0DD',
        pointHoverBackgroundColor: '#D8BFD8',
      }
    ]
  } : null

  const barChartData = data ? {
    labels: data.labels,
    datasets: [
      {
        label: 'Daily Mood Score',
        data: data.sentiments,
        backgroundColor: data.sentiments.map(score => 
          score >= 70 ? '#90EE90' : score >= 40 ? '#E6E6FA' : '#FFB6C1'
        ),
        borderColor: '#DDA0DD',
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  } : null

  const doughnutData = data ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          data.moodCounts.positive || 0,
          data.moodCounts.neutral || 0,
          data.moodCounts.negative || 0
        ],
        backgroundColor: ['#90EE90', '#E6E6FA', '#FFB6C1'],
        borderColor: ['#90EE90', '#E6E6FA', '#FFB6C1'],
        borderWidth: 2,
      }
    ]
  } : null

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          color: '#6B46C1'
        }
      },
      title: {
        display: true,
        text: `Mood Tracking - Last ${timeRange === 'week' ? 'Week' : 'Month'}`,
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold'
        },
        color: '#6B46C1'
      }
    },
    scales: chartType !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(221, 160, 221, 0.2)'
        },
        ticks: {
          color: '#6B46C1'
        }
      },
      x: {
        grid: {
          color: 'rgba(221, 160, 221, 0.2)'
        },
        ticks: {
          color: '#6B46C1'
        }
      }
    } : {}
  }

  const renderChart = () => {
    if (!data) return null

    switch (chartType) {
      case 'line':
        return <Line data={lineChartData} options={chartOptions} />
      case 'bar':
        return <Bar data={barChartData} options={chartOptions} />
      case 'doughnut':
        return <Doughnut data={doughnutData} options={chartOptions} />
      default:
        return <Line data={lineChartData} options={chartOptions} />
    }
  }

  const getInsight = () => {
    if (!data || !data.sentiments.length) return "Start journaling to see your mood insights!"
    
    const avgScore = data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length
    const trend = data.sentiments.length > 1 ? 
      data.sentiments[data.sentiments.length - 1] - data.sentiments[0] : 0

    if (avgScore >= 70) {
      return "🌟 You've been feeling quite positive lately! Keep up the great mindset."
    } else if (avgScore >= 40) {
      return "💙 Your mood has been balanced. Consider activities that boost your wellbeing."
    } else {
      return "🤗 It seems you've been going through some challenges. Remember, it's okay to seek support."
    }
  }

  return (
    <div className="mood-dashboard">
      <div className="dashboard-header">
        <h2>Your Mood Journey</h2>
        <p>Visualize your emotional patterns and discover insights</p>
      </div>

      <div className="dashboard-controls">
        <div className="control-group">
          <label>Chart Type:</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="doughnut">Mood Distribution</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      {!moodData.length ? (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <h3>No mood data yet</h3>
          <p>Start journaling to see beautiful visualizations of your emotional journey</p>
        </div>
      ) : (
        <>
          <div className="chart-container">
            {renderChart()}
          </div>
          
          <div className="insights-section">
            <h3>💡 Your Insight</h3>
            <div className="insight-card">
              <p>{getInsight()}</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Entries</h4>
              <div className="stat-value">{moodData.length}</div>
            </div>
            <div className="stat-card">
              <h4>Average Mood</h4>
              <div className="stat-value">
                {data ? Math.round(data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length) : 0}%
              </div>
            </div>
            <div className="stat-card">
              <h4>Best Day</h4>
              <div className="stat-value">
                {data && data.sentiments.length ? 
                  data.labels[data.sentiments.indexOf(Math.max(...data.sentiments))] : 'N/A'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MoodDashboard