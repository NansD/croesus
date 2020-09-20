import React, { useRef } from 'react';
import GroupPresentation from '../GroupPresentation/GroupPresentation';

export default function GroupCarousel({ groups, activeGroupId }) {
  const activeGroupRef = useRef(null);
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', overflow: 'scroll' }} id="groups-carousel">
        {groups.map((group) => (group._id === activeGroupId
          ? <GroupPresentation group={group} key={group._id} isActive ref={activeGroupRef} />
          : <GroupPresentation group={group} key={group._id} />))}
      </div>
    </>
  );
}
