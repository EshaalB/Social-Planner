import React, { useMemo } from 'react'
import styled from 'styled-components'
import { FiBarChart2, FiSettings } from 'react-icons/fi'
import useStore from '../../context/store'

const AnalyticsContainer = styled.div`
  margin-top: -380px;
  width: 500px;
  background: var(--glass-bg);
  margin-right: 20px;
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-large), var(--shadow-glow);
  }
  
  /* Gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--linearPrimarySecondary);
    opacity: 0.02;
    transition: var(--transition);
  }
  
  &:hover::before {
    opacity: 0.04;
  }
  @media (max-width: 700px) {
    padding: 14px 6px;
  }
`;

const AnalyticsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const AnalyticsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  p {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
  }
`;

const AnalyticsIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--linearPrimaryAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: var(--shadow-soft);
`;

 

const ChartContainer = styled.div`
  height: 180px;
  position: relative;
  margin-bottom: 24px;
  width: 100%;
  max-width: 100%;
  @media (max-width: 700px) {
    height: 120px;
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
  stroke: var(--color-primary);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 4px 8px rgba(124, 58, 237, 0.3));
`;

const ChartDots = styled.circle`
  fill: var(--color-primary);
  stroke: white;
  stroke-width: 3;
  r: 6;
  filter: drop-shadow(0 2px 4px rgba(124, 58, 237, 0.5));
`;

const ChartTooltip = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--linearPrimarySecondary);
  color: white;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  box-shadow: var(--shadow-medium);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--color-primary);
  }
`;

const YAxisLabels = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  padding: 10px 0;
`;

const SummarySection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 1px solid var(--border-glass);
`;

const SummaryItem = styled.div`
  text-align: center;
  
  .label {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    background: var(--linearPrimaryAccent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
              <path d="M 50 0 L 0 0 0 40" fill="none" stroke="var(--border-glass)" strokeWidth="1" opacity="0.3"/>
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