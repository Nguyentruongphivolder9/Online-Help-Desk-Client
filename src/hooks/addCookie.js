import Cookie from "js-cookie"

const addCookie = (cookieName, token, expiration) => {
  console.log(token);
  Cookie.set(cookieName, token, {
    expires: expiration ? expiration : null,
    secure: true,
    sameSite: "strict",
    path: '/',
  });
}

export default addCookie;