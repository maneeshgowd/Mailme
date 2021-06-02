import { API_KEY } from "./helper.js";

// Different API calls

// put some data or create a new basket in pantry
export const AJAX = async function (method, basketName, body = "") {
  try {
    const requestBody = JSON.stringify(body);

    const requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
      redirect: "follow",
    };

    const apiCall = await fetch(
      `https://getpantry.cloud/apiv1/pantry/${API_KEY}/basket/${basketName}`,
      requestOptions
    );

    if (!apiCall.ok) throw new Error("Failed to send mail, check your internet connection!");

    return method === "POST" ? await apiCall.text() : await apiCall.json();
  } catch (err) {
    throw err;
  }
};

// get a particular basket from pantry
export const GET = async function (basketName, err = "Oops! user dosen't exists.") {
  try {
    const apiCall = await fetch(
      `https://getpantry.cloud/apiv1/pantry/${API_KEY}/basket/${basketName}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!apiCall.ok) throw new Error(err);

    const data = await apiCall.json();
    return data;
  } catch (err) {
    throw err;
  }
};

// delete a basket
export const DELETE = async function (basket) {
  try {
    const del = await fetch(`https://getpantry.cloud/apiv1/pantry/${API_KEY}/basket/${basket}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });

    const res = await del.text();
    return res;
  } catch (err) {
    throw err;
  }
};

// get info about a particular pantry
export const PANTRY_GET = async function () {
  try {
    const apiCall = await fetch(`https://getpantry.cloud/apiv1/pantry/${API_KEY}`);
    const data = await apiCall.json();
    return data;
  } catch (err) {
    throw err;
  }
};

// creating a database and perfoming operations like get, delete

export function renderSentBox(...arr) {
  const [id, sub, sender, messg, timeDate, document, DB] = arr;
  DB.collection(document).add(
    {
      id: 1,
      sub,
      sender,
      messg,
      timeDate,
      userid: id,
    },
    id
  );
}

export function renderBookmarks(elementId, collectionName, DB) {
  DB.collection(collectionName).add({
    id: 1,
    elementId,
  });
}

export async function getBookmarks(DB, givenId) {
  const arrChecked = await DB.collection("checked").get();
  const arrStarred = await DB.collection("starred").get();
  const filterCheck = arrChecked?.map((arr) => arr.elementId).find((id) => id === givenId) || false;
  const filterStarr = arrStarred?.map((arr) => arr.elementId).find((id) => id === givenId) || false;
  return [filterCheck, filterStarr];
}

export const getDataFromDB = async (doc, DB) => await DB.collection(doc).get();

export function removeBookmarks(elementId, collectionName, DB) {
  DB.collection(collectionName).doc({ elementId }).delete();
}

/////////////////////////////////////////////////////

// ! Warning should not be used
export async function deleteAllUsers(userEmail) {
  const deleted = await model.DELETE(userEmail);
  return deleted;
}

//  deleteAllUsers();

////////////////////////////////////////////////////////////
