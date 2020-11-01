import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/authentication';
import useUserState from '../../hooks/useUserState';
import UserService from '../../services/user.service';
import Loading from '../Loading/Loading';
import Group from './Group';
import GroupCodeInput from './GroupCodeInput';
import GroupForm from './GroupForm';

function pickUserFavoriteGroup(user) {
  return user && (user.favoriteGroup
                  || (user.groups[0] && user.groups[0]._id));
}

export default function Groups() {
  const { user: authenticatedUser } = useAuth();
  const [localUser, setLocalUser] = useUserState(authenticatedUser);
  const [groups, setGroups] = useState([]);
  const [favoriteGroup, setFavoriteGroup] = useState(pickUserFavoriteGroup(localUser));

  function updateGroups(newGroups) {
    setGroups(newGroups);
    const newUser = { ...localUser, groups: newGroups };
    if (!newUser.favoriteGroup) {
      newUser.favoriteGroup = pickUserFavoriteGroup(newUser);
    }
    setLocalUser(newUser);
  }

  function notifyError(error) {
    console.log('error :', error);
    toast.error(`Erreur d'obtention de l'utilisateur courant: ${error}`);
  }

  function notifyFavoriteGroupFailure(error) {
    console.log('error :', error);
    toast.error(`Erreur lors de la sauvegarde du groupe favori: ${error}`);
  }

  function saveUserGroups(data) {
    updateGroups(data.document.groups);
    setFavoriteGroup(data.document.favoriteGroup);
  }

  function deleteGroup(deletedGroup) {
    const newGroups = groups.filter((group) => group._id !== deletedGroup._id);
    updateGroups(newGroups);
  }

  const { isPending: loading, reload } = useAsync({
    promiseFn: UserService.getSelf,
    _id: localUser && localUser._id,
    onReject: notifyError,
    onResolve: saveUserGroups,
  });

  const { run: updateUser } = useAsync({
    deferFn: UserService.update,
    onResolve: (data) => setLocalUser({ ...localUser, ...data.document }),
    onReject: notifyFavoriteGroupFailure,
  });

  function updateActiveGroup(g) {
    setFavoriteGroup(g._id);
    updateUser({ ...localUser, favoriteGroup: g._id });
  }

  function onGroupFormChange(g) {
    updateGroups([g, ...groups]);
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <GroupCodeInput reload={() => reload()} />
      <GroupForm onChange={onGroupFormChange} />
      { groups
      && groups.map((g) => (
        <Group
          active={favoriteGroup === g._id}
          group={g}
          key={g._id}
          deleteGroup={deleteGroup}
          setActiveGroup={() => updateActiveGroup(g)}
          reload={() => reload()}
        />
      ))}
    </>
  );
}
