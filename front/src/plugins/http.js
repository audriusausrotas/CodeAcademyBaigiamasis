const serverUrl = "http://localhost:4100";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: async (url) => {
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(),
    };
    const res = await fetch(`${serverUrl}/${url}`, options);
    return await res.json();
  },
  getAuth: async (url) => {
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(),
    };
    const res = await fetch(`${serverUrl}/${url}`, options);
    return await res.json();
  },
  post: async (url, data) => {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${serverUrl}/${url}`, options);
    return await res.json();
  },
  postAuth: async (url, data) => {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${serverUrl}/${url}`, options);
    return await res.json();
  },
};
