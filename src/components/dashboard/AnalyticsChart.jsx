import React, { useMemo } from 'react'
import styled from 'styled-components'
import { FiBarChart2, FiSettings } from 'react-icons/fi'
import useStore from '../../context/store'

const AnalyticsContainer = styled.div`
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  
  &:hover {
    border-color: var(--border-accent);
    box-shadow: var(--shadow-medium);
  }
  @media (max-width: 700px) {
    padding: var(--space-md) var(--space-sm);
  }
`;

const AnalyticsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
`;

const AnalyticsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  p {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
  }
`;

const AnalyticsIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 16px;
`;

const ChartContainer = styled.div`
  height: 200px;
  position: relative;
  margin-bottom: var(--space-md);
  width: 100%;
  max-width: 100%;
  @media (max-width: 700px) {
    height: 130px;
    margin-bottom: 12px;
  }
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  min-width: 0;
  max-width: 100%;
`;

const ChartPath = styled.path`
  fill: none;
  stroke: var(--primary);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const ChartDots = styled.circle`
  fill: var(--primary);
  stroke: var(--bg-card);
  stroke-width: 2;
  r: 4;
`;

const ChartTooltip = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  box-shadow: var(--shadow-soft);
`;

const YAxisLabels = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
  padding: 10px 0;
`;

const SummarySection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) 0 0;
  border-top: 1px solid var(--border-primary);
`;

const SummaryItem = styled.div`
  text-align: center;
  
  .label {
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .value {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const AnalyticsChart = (props) => {
  const { contents, getStats } = useStore()

  // Group content by week (last 8 weeks)
  const chartData = useMemo(() => {
    const now = new Date()
    const weeks = []
    for (let i = 7; i >= 0; i--) {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay() - i * 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      weeks.push({
        label: `${start.getMonth() + 1}/${start.getDate()}`,
        start,
        end,
        count: 0
      })
    }
    contents.forEach(content => {
      if (!content.createdAt) return
      const date = new Date(content.createdAt)
      for (let i = 0; i < weeks.length; i++) {
        if (date >= weeks[i].start && date <= weeks[i].end) {
          weeks[i].count++
          break
        }
      }
    })
    return weeks
  }, [contents])

  // Map to SVG points
  const maxY = Math.max(...chartData.map(w => w.count), 4)
  const minY = 0
  const chartHeight = 160
  const chartWidth = 360
  const stepX = chartWidth / (chartData.length - 1)
  const points = chartData.map((w, i) => ({
    x: 20 + i * stepX,
    y: 180 - ((w.count - minY) / (maxY - minY || 1)) * chartHeight
  }))
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${path} ${command} ${point.x} ${point.y}`
  }, '')

  // Summary stats
  const stats = getStats()
  const totalPosts = stats.total
  // Simulate reach and engagement based on content
  const reach = (totalPosts * 67 + 8200).toLocaleString()
  const engagement = Math.min(99, Math.round((stats.published / (stats.total || 1)) * 100 + 10))

  return (
    <AnalyticsContainer>
      <AnalyticsHeader>
        <AnalyticsTitle>
          <AnalyticsIcon>
            <FiBarChart2 />
          </AnalyticsIcon>
          <div>
            <h3>Summary</h3>
            <p>Track your performance</p>
          </div>
        </AnalyticsTitle>
       
      </AnalyticsHeader>
      
      <ChartContainer>
        <YAxisLabels>
          <div>{maxY * 2}</div>
          <div>{Math.round(maxY * 1.5)}</div>
          <div>{maxY}</div>
          <div>{Math.round(maxY / 2)}</div>
          <div>0</div>
        </YAxisLabels>
        <ChartSvg viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 40" fill="none" stroke="var(--border-primary)" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <ChartPath d={pathData} />
          {points.map((point, index) => (
            <ChartDots key={index} cx={point.x} cy={point.y} />
          ))}
        </ChartSvg>
        <ChartTooltip>{chartData[chartData.length - 1]?.count || 0} posts</ChartTooltip>
      </ChartContainer>
      <SummarySection>
        <SummaryItem>
          <div className="label">Posts</div>
          <div className="value">{totalPosts}</div>
        </SummaryItem>
        <SummaryItem>
          <div className="label">Reach</div>
          <div className="value">{reach}</div>
        </SummaryItem>
        <SummaryItem>
          <div className="label">Engagement</div>
          <div className="value">{engagement}%</div>
        </SummaryItem>
      </SummarySection>
    </AnalyticsContainer>
  )
}

export default React.memo(AnalyticsChart); 