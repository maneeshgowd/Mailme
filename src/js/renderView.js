import arrow from "url:../img/arrow-right.svg";


class UIRenderer {
  _newMail = document.getElementById("new-mail");
  _messageWindow = document.querySelector(".message");
  _cancelWindow = document.getElementById("cancel");
  _messageBody = document.querySelector(".message__body");
  _sendBtn = document.querySelector(".send-btn");
  _allInputs = this._messageBody.querySelectorAll(".msg");
  _deleteInputMail = document.querySelector(".delete-msg");
  _applicationFeature = document.querySelector(".application__flex-2");

  applicationSent = document.querySelector(".application-sent");
  applicationMails = document.querySelector(".application-mails");
  applicationDraft = document.querySelector(".application-draft");
  applicationStarred = document.querySelector(".application-starred");
  applicationWindow = document.querySelector(".application__window");
  applicationLoader = document.querySelector(".loader");
  applicationUserFrom = document.querySelector(".userform");
  application = document.querySelector(".application");
  checkComp = document.querySelector(".check-comp");
  activeTitle = document.getElementById("active-title");

  addHandlerMsgWindow(handler) {
    const [receiver, subj, mesg] = this._allInputs;

    this._newMail.addEventListener("click", () => {
      handler(this._messageWindow, receiver, subj, mesg);
    });

    this._cancelWindow.addEventListener("click", () => {
      handler(this._messageWindow, receiver, subj, mesg);
    });

    this._deleteInputMail.addEventListener("click", () => {
      handler(this._messageWindow, receiver, subj, mesg);
    });
  }

  addHandlerMsgSender(handler) {
    const [receiver, subj, mesg] = this._allInputs;

    this._sendBtn.addEventListener("click", () => {
      handler(receiver, subj, mesg, this._messageWindow);
    });
  }

  addHandlerViewMesg(handler) {
    this.applicationMails.addEventListener("click", handler);
    this.applicationSent.addEventListener("click", handler);
    this.applicationDraft.addEventListener("click", handler);
    this.applicationStarred.addEventListener("click", handler);
  }

  addHandlerFeature(handler) {

    this._applicationFeature.addEventListener("click", function (e) {
      handler.call(this, e);
    });
  }

  messageRender(...arr) {
    // rendering user mails dynamically
    const [senderName, sender, subject, message, date, time, code, id, check, starr] = arr;
    return `
        <div class="user-mails" data-id="${id}">
        <div class="application__mail">
          <div class="application__mail-icons">
            <svg class="features" width="40" height="40" viewBox="0 0 30 30" fill="none" id="checkbox">
              <path
                d="M22.5 5H7.5C6.11929 5 5 6.11929 5 7.5V22.5C5 23.8807 6.11929 25 7.5 25H22.5C23.8807
              25 25 23.8807 25 22.5V7.5C25 6.11929 23.8807 5 22.5 5Z"
                stroke="#373B54"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                class="check ${!check ? "display" : ""}"
                d="M11.25 15L13.75 17.5L18.75 12.5"
                stroke="#373B54"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
  
            <svg
              class="features"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              id="not-starred"
            >
              <path class="${!starr ? "fill-me" : ""}"
                d="M20.0002 29.5833L9.71355 34.9917L11.6785 23.5367L3.34521 15.425L14.8452 13.7583L19.9885
              3.33667L25.1319 13.7583L36.6319 15.425L28.2985 23.5367L30.2635 34.9917L20.0002 29.5833Z"
                fill="#373b54"
                stroke="#373b54"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        ${
          code === "sentbox"
            ? `<div class="application__mailer">To: ${sender}</div>
              <div class="info-wrapper">
              <div class="application__date">${date}</div>
              <div class="application__status sentbox__status">Sent</div>
              <img src="${arrow}" alt="" class="features right-arrow" />
              </div>
            </div>
            <div class="user-message display">
              <div class="message-header">
                <div class="message-flex-1">
                  <h3 class="user-mail">To: ${sender}</h3>
                  <h1 class="user-subject">Subject: ${subject}</h1>
                </div>
                <div class="message-flex-2">
                  <span class="message-date">${date}</span>
                  <span class="message-time">${time}</span>
                </div>
              </div>
              <div class="message-body">
                ${message}
              </div>
            </div>`
            : `  
            <div class="application__mailer">${senderName}</div>
            <div class="info-wrapper">
            <div class="application__date">${date}</div>
            <div class="application__status inbox__status">Received</div>
            <img src="${arrow}" alt="" class="features right-arrow" />
            </div>
          </div>
          <div class="user-message display">
            <div class="message-header">
              <div class="message-flex-1">
                <h3 class="user-mail">From: ${sender}</h3>
                <h1 class="user-subject">Subject: ${subject}</h1>
              </div>
              <div class="message-flex-2">
                <span class="message-date">${date}</span>
                <span class="message-time">${time}</span>
              </div>
            </div>
            <div class="message-body">
              ${message}
            </div>
          </div>`
        }
      </div>`;
  }

  // addHandlerDraftComp(addHandler,deleteHandler) {
  //   this.checkComp.addEventListener("click", function (e) {
  //     if (e.target.id === "save-draft") addHandler.call(this);
  //     if(e.target.id === 'delete-mail') deleteHandler();
  //   });
  // }
}

export default new UIRenderer();
