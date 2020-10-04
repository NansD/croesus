import React, { useEffect } from 'react';
import ExpenseService from '../../services/expense.service';

export default React.forwardRef(({
  group, isActive, reload,
}, ref) => {
  useEffect(() => {
    if (isActive && ref && ref.current) {
      ref.current.scrollIntoView(false, { behavior: 'smooth' });
    }
  }, [ref, isActive]);
  function setActiveGroup() {
    ExpenseService.setGroup(group._id);
    reload({ _id: group._id });
  }
  // TODO: handle keyboard here
  function handleKeyPress() {}
  return (
    <div
      onClick={setActiveGroup}
      id={isActive ? 'active-group' : ''}
      ref={ref}
      className="hero has-background-white mx-5"
      style={{ minWidth: '40vw', cursor: 'pointer' }}
      onKeyPress={(e) => handleKeyPress(e)}
      role="button"
      tabIndex={0}
    >
      <div className="hero-body">
        <h5 className="title is-5">
          { group && group.name }
        </h5>
        <h6 className="subtitle is-6">
          Participants :
          { group
          && group.participants && group.participants.map((p) => <div key={p._id}>{p.name}</div>)}
        </h6>
      </div>
    </div>
  );
});
