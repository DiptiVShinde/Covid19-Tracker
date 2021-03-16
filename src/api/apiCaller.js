export default async function apiCaller(endpoint, method = "") {
  try {
    const resp = await fetch(`${endpoint}`)
    //   .then((response) => response.json());
      console.log("apiDrop - ", resp);

    return resp;
  } catch (error) {
    console.log("error - ", error);
    return error;
  }
}
