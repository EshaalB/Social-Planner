import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  background: rgba(34, 40, 49, 0.98); /* More solid for clarity */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1300; /* Above sidebar and menu button */
  box-shadow: 0 2px 12px 0 rgba(108,46,183,0.10) inset, 0 2px 8px 0 rgba(20,24,48,0.10);
  opacity: 1;
  transition: background 0.3s;

  @media (max-width: 768px) {
    height: 56px;
    padding: 0 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  margin: 0;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>Social Planner</Title>
      {/* You can add user/profile/actions here if needed */}
    </HeaderContainer>
  )
}

export default Header