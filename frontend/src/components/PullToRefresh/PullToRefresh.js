import React from 'react';
import PullToRefresh from 'rmc-pull-to-refresh';
import useIsMobile from '../../hooks/useIsMobile';

export default function CustomPullToRefresh(props) {
  const { children, ...rest } = props;
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <PullToRefresh
        indicator={{
          activate: true, deactivate: true, release: true, finish: true,
        }}
        {...rest}
      >
        {(children)}
      </PullToRefresh>
    );
  }
  return (children);
}
