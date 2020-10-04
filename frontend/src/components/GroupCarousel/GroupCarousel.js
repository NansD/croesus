import React, { useRef } from 'react';
import GroupPresentation from '../GroupPresentation/GroupPresentation';

export default function GroupCarousel({ groups, activeGroupId, reload }) {
  const activeGroupRef = useRef(null);
  return (
    <>
      <div className="mb-5 group-carousel">
        {groups.map((group) => (group._id === activeGroupId
          ? (
            <GroupPresentation
              group={group}
              key={group._id}
              reload={reload}
              isActive
              ref={activeGroupRef}
            />
          )
          : (
            <GroupPresentation
              group={group}
              key={group._id}
              reload={reload}
            />
          )))}
      </div>
    </>
  );
}
