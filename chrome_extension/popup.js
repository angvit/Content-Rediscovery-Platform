import { BACKEND_URL, FRONTEND_URL, DEPLOYED } from "./config.dev.js";
const backend_url = DEPLOYED ? BACKEND_URL : "http://127.0.0.1:8000";
const frontend_url = DEPLOYED ? FRONTEND_URL : "http://localhost:3000";

let userEmail = "";

//Get user permission to get email
chrome.identity.getProfileUserInfo({ accountStatus: "ANY" }, (userInfo) => {
  userEmail = userInfo.email;
});

function getNotes() {
  const textarea = document.getElementById("notesTextarea");
  const content = textarea.value;

  return content;
}

function insertMessage(message, messageType) {
  // const parent = document.querySelector("app");
  const message_p = document.querySelector(".message-p");
  const submit_button = document.querySelector(".action-bar");

  submit_button.disabled = true;
  if (!message_p) return;

  message_p.textContent = message;
  message_p.style.color = messageType === "error" ? "red" : "green";

  setTimeout(() => {
    message_p.textContent = "";
    message_p.style.color = "";
    submit_button.disabled = false;
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("bookMarkBtn");
  console.log("Popup script loaded and running...");
  console.log("Button element: ", btn);

  if (btn) {
    // Make the main event listener async
    btn.addEventListener("click", async () => {
      try {
        // Use try...catch for async operations
        let [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab || !tab.url) {
          console.warn("No active tab found or tab has no URL.");
          return;
        }

        console.log("Attempting to get cookie for URL:", frontend_url);

        if (userEmail) {
          try {
            const notes = getNotes();
            const endpoint = `${backend_url}/content/save`;

            const response = await fetch(endpoint, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // Authorization: `Bearer ${cookieVal}`,
              },
              body: JSON.stringify({
                url: tab.url,
                title: tab.title,
                source: "chrome_extension",
                email: userEmail,
                notes: notes,
              }),
            });

            // Wait for JSON parsing
            const data = await response.json();

            console.log("Raw response from server:", response);
            console.log("Parsed response data:", data);

            // Check if server returned a successful status
            if (data.status !== "Success") {
              throw new Error(`Server returned error status: ${data.status}`);
            }

            insertMessage("Bookmark successfully saved", "success");
          } catch (err) {
            alert("Error saving bookmark:" + err);
            insertMessage("Failed to save bookmark", "error");
          }
        } else {
          console.warn("Token cookie not found or has no value.");
          alert("Could not find authentication token. Please log in.");
        }
      } catch (error) {
        insertMessage("An error occured, please try again later", "error");
        // Display a user-friendly error message if needed
        alert(`An error occurred: ${error.message}`);
      }
    });
  } else {
    console.error("Button with ID 'bookMarkBtn' not found.");
  }
});
