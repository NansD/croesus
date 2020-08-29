import React from 'react';

export default function SocialNetworkLink({ href, color, children }) {
  const socialNetworkStyle = {
    textDecoration: 'none',
    boxShadow: 'none',
    backgroundColor: '#FFF',
  };
  return (
    <a
      href={href}
      style={{
        ...socialNetworkStyle,
        color,
      }}
    >
      {children}
    </a>
  );
}
