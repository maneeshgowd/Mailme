"use strict";

import "core-js";
import "regenerator-runtime/runtime";

import uniqid from "uniqid";
import renderer from "./renderView";
import * as model from "./model.js";
import { SET_TIME } from "./helper.js";
import formValidation from "./formView.js";

import Localbase from "localbase";

///////////////////////////////////////////////////////////
// !warn please don't touch
const DB = new Localbase("userData");
DB.config.debug = false;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// model
const pantryBasket = async function (name, email, pass) {
  //creating a database for new  user
  try {
    const body = {
      name,
      email,
      pass,
    };

    const data = await model.AJAX("POST", email, body);
    // displaying mailme UI
    formLoaderAnimation(undefined)(email, name);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

// checking for existing user

async function existingUser(mail, pass) {
  // validating for user login
  try {
    const email = mail.value.toLowerCase().trim();
    const password = pass.value.trim();
    if (!email || !password) throw new Error("Please fill the form completely!");

    const getData = await model.GET(email);

    if (email !== getData.email || password !== getData.pass)
      throw new Error("Invalid email or password");

    // if login successful displaying mailme UI
    formLoaderAnimation(getData)(email);
  } catch (err) {
    errorHandler(err);
  }
}

// form view

const addBorder = (ele, border) => {
  // adding and removing error and success border during create acc
  if (ele.classList.contains("error") || ele.classList.contains("success")) {
    ele.classList.remove("error", "success");
  }
  // if the user data is valid , then data attr = true;
  if (border === "success") ele.dataset.valid = true;
  ele.classList.add(border);
};

const userValidation = function (...arr) {
  const [userName, userEmail, userPass, userRePass, createUser] = arr;
  const name = userName.value.toLowerCase().trim();
  const email = userEmail.value.toLowerCase().trim();
  const pass = userPass.value.trim();
  const repass = userRePass.value.trim();
  const validateEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail.com$/g;

  // validating user name

  !(name.length >= 5) ? addBorder(userName, "error") : addBorder(userName, "success");

  // validating user email
  !validateEmail.test(email) ? addBorder(userEmail, "error") : addBorder(userEmail, "success");

  //validating user password
  if (pass === repass && pass.length >= 8 && repass.length >= 8) {
    addBorder(userPass, "success");
    addBorder(userRePass, "success");
  } else {
    addBorder(userPass, "error");
    addBorder(userRePass, "error");
  }

  // if all the data attr are true then data transfer
  const data = Array.from(createUser.querySelectorAll("input")).every(
    (e) => e.dataset.valid === "true"
  );
  if (data) pantryBasket(name, email, pass);
};

function formLoaderAnimation(getData) {
  const loader = renderer.applicationLoader;
  const application = renderer.application;
  const parentElement = renderer.applicationUserFrom;
  const applicationMails = renderer.applicationMails;

  parentElement.classList.add("display");
  loader.classList.remove("display");

  setTimeout(() => {
    loader.classList.add("display");
    application.classList.remove("display");
    checkForUserData(getData, applicationMails);
    sentMessages("sentbox");
  }, SET_TIME);

  return function (mail, name) {
    renderer.applicationWindow.dataset.logged = true;
    renderer.applicationWindow.dataset.user = mail;

    if (name) {
      const user = name.replace(name[0], name[0].toUpperCase());
      localStorage.setItem(mail, user);
    }
  };
}

async function checkForUserData(getData, application) {
  const userData = await renderCheckUserMsg(getData);
  if (Array.isArray(userData)) {
    htmlAdder(application, userData);
    helperFunction(application);
    starrCheckMsg(renderer.applicationStarred, "starred");
    starrCheckMsg(renderer.applicationDraft, "starred");
    // gsap.from(".user-mails", { stagger: 0.1, y: 200, duration: 0.5 });
  } else {
    application.insertAdjacentHTML("beforeend", userData);
  }
}

const formValidationLoginCreate = function (loginUser, createUser, e) {
  e.preventDefault();
  // toggling login and create account
  loginUser.classList.toggle("display");
  createUser.classList.toggle("display");
};

// checking the number of messages user received

function helperFunction(application) {
  // counting the number of mail user received and storing them as data prop
  const datavar = application.dataset.elements || 0;
  const miniTitle = document.querySelector(".ui__title-mini");
  miniTitle.innerHTML = `There are total <span>${datavar}</span> mails`;
  +datavar >= 6 ? application.classList.add("overflow") : application.classList.remove("overflow");
}

async function renderCheckUserMsg(userData) {
  // retreving user data from DB when user logins
  const html = [];
  if (!userData) return "No mails yet!";
  const newObject = Object.assign({}, userData);
  const arr = Object.entries(newObject);
  for (let i = 0; i < 3; i++) arr.shift();

  if (arr.length === 0) return "No mails yet!";

  // creating separate arrays for all crucial info
  const ids = arr.filter((id) => id[0].startsWith("id"));
  const sender = arr.filter((sender) => sender[0].startsWith("sender"));
  const subject = arr.filter((subject) => subject[0].startsWith("subject"));
  const message = arr.filter((message) => message[0].startsWith("message"));
  const names = arr.filter((name) => name[0].startsWith("name"));
  const dates = arr.filter((date) => date[0].startsWith("date"));

  // dynamically generating content
  for (let i = 0; i < sender.length; i++) {
    const [check, star] = await model.getBookmarks(DB, ids[i][1]);
    html.push(
      renderer.messageRender(
        names[i][1],
        sender[i][1],
        subject[i][1],
        message[i][1],
        dates[i][1][0],
        dates[i][1][1],
        "inbox",
        ids[i][1],
        check,
        star
      )
    );
  }

  return html.reverse();
}

const rendererWindow = function (messgWindow, receiver, subj, messg) {
  // toggling message sender window
  messgWindow.classList.toggle("comp-helper");
  receiver.value = subj.value = messg.value = "";
};

const renderMsgSender = async function (receiver, subject, message, messgWindow) {
  // sending user message to the databse with uniq id
  const id = uniqid.time();
  const sender = receiver.value;
  const subj = subject.value;
  const messg = message.value;
  const currentUser = renderer.applicationWindow.dataset.user;
  const timeDate = getTimeAndDate();

  try {
    if (!sender || !subj || !messg)
      throw new Error("Please fill the To,Subject and Message field!");

    if (sender === currentUser) throw new Error("User cannot mail to themselves!");

    const rece = sender.toLowerCase();
    const sub = subj.replace(subj[0], subj[0].toUpperCase());
    const senderName = localStorage.getItem(currentUser);
    const body = {
      [`id_${id}`]: id,
      [`sender_${id}`]: currentUser,
      [`name_${id}`]: senderName,
      [`subject_${id}`]: sub,
      [`message_${id}`]: messg,
      [`date_${id}`]: timeDate,
    };

    model.renderSentBox(id, sub, rece, messg, timeDate, "sentbox", DB);

    await model.GET(rece);
    await model.AJAX("PUT", rece, body);

    rendererWindow(messgWindow, receiver, subject, message);
  } catch (err) {
    errorHandler(err);
  }
};

const renderMsgView = function (e) {
  // displaying the user mail when he clicks
  if (e.target.classList.contains("application__mail")) {
    e.target.nextElementSibling.classList.toggle("display");
    e.target.lastElementChild.lastElementChild.classList.toggle("application__arrow");
  }

  // adding checkmark and starred starred feature
  if (e.target.id === "checkbox") {
    renderMsgHelper(e.target, "display", "checked");
  }

  if (e.target.id === "not-starred") {
    renderMsgHelper(e.target, "fill-me", "starred");
  }
};

function renderMsgHelper(e, clas, document) {
  const child = e.lastElementChild;
  const closestParentId = e.closest(".user-mails").dataset.id;

  // toggling  checked and starred feature
  if (child.classList.contains(clas)) {
    child.classList.remove(clas);
    // adding selected checked and starred in indexedDB
    model.renderBookmarks(closestParentId, document, DB);
  } else {
    child.classList.add(clas);
    // removing checked and starred in indexedDB when user unchecks
    model.removeBookmarks(closestParentId, document, DB);
  }
}

// function checkCompWindow() {
//   // adding the checkcomp only when all the elements are unchecked
//   const checks = [...document.querySelectorAll(".check")];
//   const some = checks.some((e) => !e.classList.contains("display"));
//   const every = checks.every((e) => e.classList.contains("display"));
//   if (some) renderer.checkComp.classList.remove("comp-helper");
//   if (every) renderer.checkComp.classList.add("comp-helper");

//   const component = renderer.checkComp.lastElementChild;
//   const activeTitle = renderer.activeTitle.textContent;

//   if (activeTitle === "Inbox") component.classList.add("opacity");
//   else component.classList.remove("opacity");
// }

const renderToggle = function (e) {
  const targetID = e.target.id;
  const pageTitle = renderer.activeTitle;
  if (!e.target.classList.contains("anchor")) return;
  const childrens = this.querySelectorAll("a");
  const content = Array.from(document.querySelector(".ui-wrapper").children);
  content.shift();

  // removing the active class form every anchor tag
  childrens.forEach((e) => e.classList.remove("active"));
  // adding the display class to all the applicaiton feature
  content.forEach((e) => e.classList.add("display"));

  // adding active to the target
  e.target.classList.add("active");
  // adding the section text like inbox and starred when user clicks anyone of the features
  const contentChild = content.find((e) => e.id === targetID);
  contentChild.classList.remove("display");
  pageTitle.textContent = e.target.title;

  // counting total number of mails when user clicks on either of the button
  if (e.target.id === "inbox") helperFunction(renderer.applicationMails);

  if (e.target.id === "starred") starrCheckMsg(renderer.applicationStarred, "starred");

  if (e.target.id === "draft") starrCheckMsg(renderer.applicationDraft, "checked");

  if (e.target.id === "sent") sentMessages("sentbox");
};

// function to get current time and date
function getTimeAndDate() {
  // getting date and time
  let currentTime = 0;
  const [, month, date, year, time] = String(new Date()).split(" ");
  const receivedDate = `${date} ${month} ${year}`;
  const [hours, min] = time.split(":");
  if (+hours > 12) currentTime = `${hours % 12}:${min} PM`;
  else currentTime = `${hours}:${min} AM`;
  return [receivedDate, currentTime];
}

function errorHandler(err) {
  // displaying error component when user dosen't enter data correctly
  const error = document.querySelector(".error-comp");
  if (err) error.classList.remove("comp-helper");
  if (error.innerText) error.innerText = "";
  error.innerText = err;

  setTimeout(() => error.classList.add("comp-helper"), SET_TIME + SET_TIME);
}

async function starrCheckMsg(element, doc) {
  const storedEle = element;
  const array = [];
  const mails = renderer.applicationMails?.children;
  const sent = renderer.applicationSent?.children;
  const combined = [...mails, ...sent];
  // getting the data of starred from DB
  const getDB = await model.getDataFromDB(doc, DB);
  const modified = getDB.map((d) => d.elementId);

  // return a modified array of elements which need to be added in draft or starred
  for (const arr of modified) {
    const find = combined.find((e) => e.dataset.id === arr);
    array.push(find);
  }

  const children = [storedEle?.children];
  if (children) storedEle.innerHTML = "";

  storedEle.dataset.elements = array.length;
  helperFunction(storedEle);
  array.forEach((ele) => storedEle.insertAdjacentElement("beforeend", ele.cloneNode(true)));
}

function htmlAdder(element, data) {
  element.dataset.elements = data.length;
  element.insertAdjacentHTML("beforeend", data.join(""));
}

async function sentMessages(document) {
  const sentCode = [];
  let responseData = await model.getDataFromDB(document, DB);
  if (!responseData) return `No mails yet!`;
  const newarr = responseData.map((arr) => Object.values(arr).flat());
  for (let i = 0; i < newarr.length; i++) {
    const [check, star] = await model.getBookmarks(DB, newarr[i][6]);
    sentCode.push(
      renderer.messageRender(
        undefined,
        newarr[i][2],
        newarr[i][1],
        newarr[i][3],
        newarr[i][4],
        newarr[i][5],
        "sentbox",
        newarr[i][6],
        check,
        star
      )
    );

    const renderChildren = [...renderer.applicationSent.children];
    if (renderChildren) renderer.applicationSent.innerHTML = "";
    htmlAdder(renderer.applicationSent, sentCode);
    helperFunction(renderer.applicationSent);
  }
}

/////////////////////////////////////////////////////

// initilization

(function () {
  formValidation.addHandlerSubmit(userValidation);
  formValidation.addHandlerLogin(existingUser);
  formValidation.addHandlerToggleForm(formValidationLoginCreate);
  renderer.addHandlerMsgWindow(rendererWindow);
  renderer.addHandlerMsgSender(renderMsgSender);
  renderer.addHandlerViewMesg(renderMsgView);
  renderer.addHandlerFeature(renderToggle);
  // renderer.addHandlerDraftComp(renderdraftFuture, deleteDraftFuture);
})();


// model.deleteAllUsers();
