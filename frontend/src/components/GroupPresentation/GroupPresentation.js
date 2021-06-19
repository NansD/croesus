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
      className="hero has-background-white mx-3 group-presentation__container"
      style={{
        cursor: 'pointer', boxSizing: 'content-box',
      }}
      onKeyPress={() => handleKeyPress()}
      role="button"
      tabIndex={0}
    >
      <div className="py-5 px-3">
        <h5 className="title is-5">
          { group && group.name }
        </h5>
        <div className="content">
          Participants:
          <ul style={{ marginTop: 0 }}>
            { group
          && group.participants && group.participants.map((p) => <li key={p._id}>{p.name}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
});
