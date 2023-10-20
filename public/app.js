const chat = document.querySelector("#chat");
const chatForm = document.querySelector("#chat-input");

async function getPosts() {
    try {
        const response = await fetch("/cbbs");
        const posts = await response.json();
        chat.innerHTML = "";
        chat.innerHTML = posts
            .map((post) => {
                const serverTime = new Date(post.created_at);
                const localTime = serverTime.toLocaleString("en-US", {
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                });
                const userDay = localTime.slice(0, 10);
                const userTime = localTime.slice(14);
                const userName = post.username;
                const userMessage = ` >> ${sanitizeHTML(post.message)}`;
                return `
            <div id ='box'>
                <div id ='timeBox'>
                    <p>${userDay}</p>
                    <p>${userTime}</p>
                </div>
                <div id ='chatBox'>
                    <p>${randomUserColor(userName)}${userMessage}</p>
                </div>
            </div>
            `;
            })
            .join("");
    } catch (err) {
        console.error(err);
    }
}
getPosts();

chatForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && chatForm.value.trim() !== "") {
        e.preventDefault();
        postSubmission();
    }
});
async function getRandomUser() {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const user = data.results[0].login.username;
    return user;
}

const user = await getRandomUser();

chatForm.placeholder = `say something, ${user}...`;

async function postSubmission() {
    const message = chatForm.value.trim();
    try {
        await fetch("/cbbs", {
            method: "POST",
            body: JSON.stringify({
                user,
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

function randomUserColor(user) {
    const savedColor = localStorage.getItem(user);
    if (savedColor) {
        return `<span id='userName' style='color: ${savedColor}'>${user}</span>`;
    }
    const colors = [
        "orangered",
        "lightcoral",
        "orange",
        "dodgerblue",
        "mediumorchid",
        "plum",
        "cyan",
    ];
    const randomNum = Math.floor(Math.random() * colors.length);
    localStorage.setItem(user, colors[randomNum]);
    return `<span id='userName' style='color: ${colors[randomNum]}'>${user}</span>`;
}
function sanitizeHTML(text) {
    const element = document.createElement("div");
    element.innerText = text;
    return element.innerHTML;
}
