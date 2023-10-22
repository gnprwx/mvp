const chat = document.querySelector("#chat");
const chatForm = document.querySelector("#chat-input");
getPosts();

chatForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && chatForm.value.trim() !== "") {
        e.preventDefault();
        postSubmission();
    }
});

async function getPosts() {
    try {
        const response = await fetch("/cbbs");
        const posts = await response.json();
        chat.innerHTML = "";
        posts.forEach((post) => {
            const serverTime = new Date(post.created_at);
            const localTime = serverTime.toLocaleString("en-US");
            const [date, time] = localTime.split(",");

            const username = document.createElement("span");
            username.innerHTML = `${randomUserColor(post.username)}`;

            const message = document.createElement("span");
            message.textContent = ` > ${post.message}`;

            const timeBox = document.createElement("div");
            timeBox.classList.add("timeBox");
            timeBox.textContent = `${date} ${time}`;

            const chatBox = document.createElement("div");
            chatBox.classList.add("chatBox");
            chatBox.appendChild(username);
            chatBox.appendChild(message);

            const box = document.createElement("div");
            box.classList.add("box");
            box.appendChild(timeBox);
            box.appendChild(chatBox);

            chat.appendChild(box);
            box.addEventListener("click", () => {
                if (post.username === currentUser) {
                    fetch(`/cbbs/${post.id}`, {
                        method: "DELETE",
                    }).then(() => {
                        chat.removeChild(box);
                    });
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
}

async function postSubmission() {
    const message = chatForm.value.trim();
    try {
        await fetch("/cbbs", {
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
    const delBtn = document.createElement("button");
    getPosts();
}

async function getRandomUser() {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const user = data.results[0].login.username;
    return user;
}

const currentUser = await getRandomUser();

chatForm.placeholder = `say something, ${currentUser}...`;

function randomUserColor(user) {
    const savedColor = localStorage.getItem(user);
    if (savedColor) {
        return `<span id='userName' style='color: ${savedColor}'>${user}</span>`;
    }
    const colors = [
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
