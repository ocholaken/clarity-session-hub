export const getResourcePath = (resourceId: string) =>
  `/resources?resource=${encodeURIComponent(resourceId)}`;

export const requireResourceAccess = (resourceId: string) => {
  const isLoggedIn = Boolean(sessionStorage.getItem("user") || sessionStorage.getItem("token"));

  if (!isLoggedIn) {
    sessionStorage.setItem("redirectAfterLogin", getResourcePath(resourceId));
    window.location.href = "/login";
    return false;
  }

  return true;
};