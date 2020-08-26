import React from 'react';
import ReactPullToRefresh from 'react-pull-to-refresh';
import useIsMobile from '../../hooks/useIsMobile';

export default function PullToRefresh(props) {
  const { children, ...rest } = props;
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <ReactPullToRefresh {...rest}>
        {(children)}
      </ReactPullToRefresh>
    );
  }
  return (children);
}
