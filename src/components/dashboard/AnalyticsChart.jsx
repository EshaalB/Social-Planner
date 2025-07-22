import React from 'react'
import styled from 'styled-components'
import { FiBarChart2, FiSettings } from 'react-icons/fi'

const AnalyticsContainer = styled.div`
  margin-top: -380px;
  width: 500px;
  background: var(--glass-bg);
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

const SettingsButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--glass-shadow);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--border-accent);
    transform: scale(1.1);
  }
`;

const ChartContainer = styled.div`
  height: 200px;
  position: relative;
  margin-bottom: 24px;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
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

const AnalyticsChart = () => {
  // Sample data points for the chart
  const dataPoints = [
    { x: 10, y: 160 },
    { x: 60, y: 120 },
    { x: 110, y: 140 },
    { x: 160, y: 100 },
    { x: 210, y: 130 },
    { x: 260, y: 80 },
    { x: 310, y: 110 },
    { x: 360, y: 60 }
  ];

  // Create SVG path from data points
  const pathData = dataPoints.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

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
        <SettingsButton>
          <FiSettings />
        </SettingsButton>
      </AnalyticsHeader>
      
      <ChartContainer>
        <YAxisLabels>
          <div>400</div>
          <div>300</div>
          <div>200</div>
          <div>100</div>
        </YAxisLabels>
        
        <ChartSvg viewBox="0 0 400 200" preserveAspectRatio="none">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 40" fill="none" stroke="var(--border-glass)" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Chart line */}
          <ChartPath d={pathData} />
          
          {/* Data points */}
          {dataPoints.map((point, index) => (
            <ChartDots
              key={index}
              cx={point.x}
              cy={point.y}
            />
          ))}
        </ChartSvg>
        
        <ChartTooltip>203</ChartTooltip>
      </ChartContainer>
      
      <SummarySection>
        <SummaryItem>
          <div className="label">Posts</div>
          <div className="value">124</div>
        </SummaryItem>
        <SummaryItem>
          <div className="label">Reach</div>
          <div className="value">8.2K</div>
        </SummaryItem>
        <SummaryItem>
          <div className="label">Engagement</div>
          <div className="value">94%</div>
        </SummaryItem>
      </SummarySection>
    </AnalyticsContainer>
  );
};

export default AnalyticsChart; 