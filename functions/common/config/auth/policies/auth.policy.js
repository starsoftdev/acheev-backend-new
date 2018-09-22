import Acl from 'acl';

const inMemoryAcl = new Acl(new Acl.memoryBackend());

const invokeRolesPolicies = () => {
  inMemoryAcl.allow([
    {
      roles: ['administrator'],
      allows: [
        {
          resources: ['/user', '/user/:id'],
          permissions: '*',
        },
      ],
    },
  ]);

  // inMemoryAcl.addRoleParents( 'user', 'guest' );
};

const isAllowed = (req, res, next) => {
  const roles = (req.user) ? req.user.roles : ['guest'];

  // check for user roles
  inMemoryAcl.areAnyRolesAllowed(
    roles,
    req.route.path,
    req.method.toLowerCase(),
    (err, allow) => {
      if (err) {
        // an authorization error occurred.
        return res.error('Unexpected authorization error', 500);
      }

      if (allow) {
        // access granted
        return next();
      }

      return res.error('User is not authorized', 403);
    },
  );
};

module.exports = {
  invokeRolesPolicies,
  isAllowed,
};
