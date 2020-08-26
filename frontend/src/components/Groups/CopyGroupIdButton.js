import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ClipboardService from '../../services/others/clipboard.service';

export default function CopyGroupIdButton({ groupId }) {
  const [showDropDown, setShowDropDown] = useState(false);

  const codeInputRef = useRef(null);

  function toggleShowInvitationCode() {
    setShowDropDown(!showDropDown);
  }

  async function copyInputToClipBoard(ref) {
    ref.current.focus();
    ref.current.select();
    await ClipboardService.copy(ref.current.value);
    toast.success('Copié !');
    setShowDropDown(false);
  }

  function copyCodeToClipboard() {
    return copyInputToClipBoard(codeInputRef);
  }
  return (
    <div className={`${showDropDown && 'is-active'} dropdown is-up`}>
      <div className="dropdown-trigger">
        <button type="button" className="button is-primary" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleShowInvitationCode}>
          <i className="fa fa-share icon" aria-label="share" />
          {/* <span> Inviter à rejoindre le groupe </span> */}
        </button>
      </div>
      <div className="dropdown-menu" style={{ minWidth: '300px' }} id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item is-flex">
            <button type="button" className="button" onClick={copyCodeToClipboard}>
              <i className="icon fa fa-clone" aria-hidden="true" aria-label="share" />
            </button>

            <input readOnly type="text" className="input" ref={codeInputRef} value={groupId} />
          </div>
          {/* IN CASE I WANT TO INVITE PEOPLE TO SIGNUP */}
          {/* <div className="dropdown-item is-flex">
        <button type="button" className="button" onClick={copyUrlToClipboard}>
          <i className="icon fa fa-copy" aria-hidden="true" aria-label="share" />
        </button>

        <input readOnly type="text" className="input" ref={urlInputRef}
        value={`${window.location.protocol}//
        ${window.location.host}/${NAVIGATION.SIGNUP}?groupId=${group._id}`}
        />
      </div> */}
        </div>
      </div>
    </div>
  );
}
