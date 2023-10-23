const chat = document.querySelector("#chat");
const chatForm = document.querySelector("#chat-input");
const currentUser = await getRandomUser();

getPosts();

chatForm.placeholder = `type and press enter, ${currentUser.slice(0, -6)}`;
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
            deleteEventListener(post, postEntry);

            chat.appendChild(postEntry);
        });
    } catch (err) {
        chatForm.placeholder = "Something went wrong. Check back later. ;(";
    }
}

async function deleteEventListener(post, postEntry) {
    postEntry.addEventListener("click", async () => {
        if (post.username === currentUser) {
            try {
                await fetch(`/cbbs/${post.id}`, {
                    method: "DELETE",
                });
                chat.removeChild(postEntry);
            } catch (err) {
                console.error(err);
            }
        }
    });
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
        return `<span id='userName' style='color: ${savedColor}'>${user}: </span>`;
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
    return `<span id='userName' style='color: ${colors[randomNum]}'>${user}: </span>`;
}
