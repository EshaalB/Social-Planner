import React from 'react'
import styled from 'styled-components'
 

const HeaderContainer = styled.div`
  width: 100%;
  height: 50px;
  background: linear-gradient(60deg, rgba(20, 24, 48, 0.85) 60%, rgba(108, 46, 183, 0.7) 100%);
  color: #fff;
  display: flex;
  flex-direction: row;
  padding: 20px 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99; 
  backdrop-filter: blur(28px) saturate(180%);
  box-shadow: 8px 0 32px 0 rgba(20, 24, 48, 0.25), 0 2px 12px 0 rgba(108,46,183,0.10) inset;
  opacity: 0.97;`
const Header = () => {
  return (
     <HeaderContainer></HeaderContainer>
  )
}

export default Header