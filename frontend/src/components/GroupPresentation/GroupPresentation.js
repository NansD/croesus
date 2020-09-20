import React, { useEffect } from 'react';

export default React.forwardRef(({ group, isActive }, ref) => {
  useEffect(() => {
    console.log(isActive, ref);
    if (isActive && ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref, isActive]);
  return (
    <div id={isActive ? 'active-group' : ''} ref={ref} className="hero has-background-white mx-5" style={{ minWidth: '40vw' }}>
      <div className="hero-body">
        <h3 className="title is-3">
          { group && group.name }
        </h3>
        <h4 className="subtitle is-4">
          Participants :
          { group
        && group.participants && group.participants.map((p) => <div key={p._id}>{p.name}</div>)}
        </h4>
      </div>
    </div>
  );
});
