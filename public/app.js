const chat = document.querySelector("#chat");
const chatForm = document.querySelector("#chat-input");
const yourUsername = document.querySelector("#yourUsername");
const currentUser = await getRandomUser();

getPosts();

yourUsername.innerHTML = `${randomUserColor(
    currentUser
)} i am your assigned username!`;

async function getPosts() {
    try {
        const response = await fetch("/nmb");
        const posts = await response.json();
        chat.innerHTML = "";
        posts.forEach((post) => {
            const serverTime = new Date(post.created_at);
            const localTime = serverTime.toLocaleString("en-US");
            const [date, time] = localTime.split(",");

            const username = document.createElement("span");
            username.innerHTML = `${randomUserColor(post.username)}`;

            const message = document.createElement("span");
            message.textContent = post.message;

            const timeBox = document.createElement("div");
            timeBox.classList.add("timeBox");
            timeBox.textContent = `${date} ${time}`;

            const chatBox = document.createElement("div");
            chatBox.classList.add("chatBox");
            chatBox.appendChild(username);
            chatBox.appendChild(message);

            const postEntry = document.createElement("div");
            postEntry.classList.add("postEntry");
            postEntry.appendChild(timeBox);
            postEntry.appendChild(chatBox);

            const editInput = document.createElement("textarea");
            editInput.classList.add("editInput");

            const editTitle = document.createElement("legend");
            editTitle.textContent = "edit post";

            const editPost = document.createElement("fieldset");
            editPost.classList.add("editPost");
            editPost.appendChild(editTitle);
            editPost.appendChild(editInput);

            chat.appendChild(postEntry);
            chat.appendChild(editPost);

            patchPostEventListener(post, postEntry, editInput, editPost);
            deletePostEventListener(post, postEntry, editPost);
        });
    } catch (err) {
        chatForm.placeholder = "Something went wrong. Check back later. ;(";
    }
}

chatForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && chatForm.value.trim() !== "") {
        e.preventDefault();
        postSubmission();
    }
});

function patchPostEventListener(post, postEntry, editInput, editPost) {
    postEntry.addEventListener("click", () => {
        if (post.username === currentUser) {
            editPost.style.display = "block";
            editInput.value = post.message;
        }
    });
    editInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey && editInput.value.trim() !== "") {
            e.preventDefault();
            patchSubmission(post, editInput);
            editPost.style.display = "none";
        }
    });
}

async function patchSubmission(post, editInput) {
    try {
        const message = editInput.value.trim();
        await fetch(`/nmb/${post.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                message,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error(err);
    }
    getPosts();
}

function deletePostEventListener(post, postEntry, editPost) {
    postEntry.addEventListener("dblclick", async () => {
        if (post.username === currentUser) {
            try {
                await fetch(`/nmb/${post.id}`, {
                    method: "DELETE",
                });
                chat.removeChild(postEntry);
                chat.removeChild(editPost);
            } catch (err) {
                console.error(err);
            }
        }
    });
}

async function postSubmission() {
    const message = chatForm.value.trim();
    try {
        await fetch("/nmb", {
            method: "POST",
            body: JSON.stringify({
                currentUser,
                message,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error(err);
    }
    chatForm.value = "";
    getPosts();
}

async function getRandomUser() {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const handle = data.results[0].login.username.slice(0, -3);
    const salt = data.results[0].login.salt.slice(0, 5);
    return handle + "_" + salt;
}

function randomUserColor(user) {
    const savedColor = localStorage.getItem(user);
    if (savedColor) {
        return `<span id='userName' style='color: ${savedColor}'>${user}</span>`;
    }
    const colors = [
        // AAA a11y colors
        "#FFFFFF", // White
        "#FFFF00", // Yellow
        "#FFD700", // Gold
        "#FF8C00", // Dark Orange
        "#FF4500", // Orange Red
        "#FF0000", // Red
        "#FF1493", // Deep Pink
        "#FF00FF", // Magenta
        "#DA70D6", // Orchid
    ];
    const randomNum = Math.floor(Math.random() * colors.length);
    localStorage.setItem(user, colors[randomNum]);
    return `<span id='userName' style='color: ${colors[randomNum]}'>${user}</span>`;
}
