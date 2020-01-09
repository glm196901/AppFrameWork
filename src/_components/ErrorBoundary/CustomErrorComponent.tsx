import React from 'react';
const CustomComponent: React.FC = () => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}
    onClick={() => window.location.reload()}
  >
    <div>
      <img src={require('./error.svg')} alt="1" />
    </div>
  </div>
);

export default CustomComponent;
