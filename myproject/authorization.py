from zope.interface import implementer

from pyramid.interfaces import IAuthorizationPolicy

from pyramid.location import lineage

from pyramid.compat import is_nonstr_iter

from pyramid.security import (
    ACLAllowed,
    ACLDenied,
    Allow,
    Deny,
    Everyone,
    )

from .models import *
from .views import log

import re

@implementer(IAuthorizationPolicy)
class InAuthorizationPolicy(object):

    def permits(self, context, principals, permission):
        """ Return an instance of
        :class:`pyramid.security.ACLAllowed` instance if the policy
        permits access, return an instance of
        :class:`pyramid.security.ACLDenied` if not."""

        for principal in principals:
            category = principal.split(':')[0]
            if category == 'group':
                # find group name
                group = Group.objects(name=principal).first()
                if group is None or group.permissions == []:
                    continue
                if re.search('|'.join(group.permissions), permission):
                    return True
            elif category == 'system':
                continue
            else:
                # find user name
                user = User.objects(username=principal).first()
                if user is None or user.permissions == []:
                    continue
                if re.search('|'.join(user.permissions), permission):
                    return True

        return False

    def principals_allowed_by_permission(self, context, permission):
        """ Return the set of principals explicitly granted the
        permission named ``permission`` according to the ACL directly
        attached to the ``context`` as well as inherited ACLs based on
        the :term:`lineage`."""
        allowed = set()

        log.warn("[principals_allowed_by_permission] context: %s, permission: %s", context, permission)

        for location in reversed(list(lineage(context))):
            # NB: we're walking *up* the object graph from the root
            try:
                acl = location.__acl__
            except AttributeError:
                continue

            allowed_here = set()
            denied_here = set()
            
            for ace_action, ace_principal, ace_permissions in acl:
                if not is_nonstr_iter(ace_permissions):
                    ace_permissions = [ace_permissions]
                if (ace_action == Allow) and (permission in ace_permissions):
                    if not ace_principal in denied_here:
                        allowed_here.add(ace_principal)
                if (ace_action == Deny) and (permission in ace_permissions):
                        denied_here.add(ace_principal)
                        if ace_principal == Everyone:
                            # clear the entire allowed set, as we've hit a
                            # deny of Everyone ala (Deny, Everyone, ALL)
                            allowed = set()
                            break
                        elif ace_principal in allowed:
                            allowed.remove(ace_principal)

            allowed.update(allowed_here)

        return allowed
