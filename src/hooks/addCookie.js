import Cookie from "js-cookie"

const addCookie = (cookieName, token, expiration) => {
  const expirationDate = new Date(expiration);
  Cookie.set(cookieName, token, {
    expires: expiration ? expirationDate : null,
    secure: true,
    sameSite: "strict",
    path: '/',
  });
}

export default addCookie;