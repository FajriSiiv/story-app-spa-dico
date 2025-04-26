function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[3] || null,
  };
}



function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id && pathSegments.resource === 'story') {
    pathname = `/story/detail/${pathSegments.id}`;
  }

  return pathname || '/';
}



export function getActivePathname() {
  const hash = window.location.hash;

  const routeOnly = hash.split('#/')[1]?.split('#')[0] || '';

  return `/${routeOnly}`;
}


export function getActiveRoute() {
  const pathname = getActivePathname();

  const urlSegments = extractPathnameSegments(pathname);

  if (urlSegments.resource === 'story' && urlSegments.id) {
    return `/story/detail`;
  }

  return pathname || '/';
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}
