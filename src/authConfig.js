export const msalConfig = {
  auth: {
    clientId: "<YOUR_CLIENT_ID>", // Replace with your client id
    authority: "https://login.microsoftonline.com/<YOUR_TENANT_ID>", // Replace with your tenant id or common
    redirectUri: "http://localhost:5173"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};
