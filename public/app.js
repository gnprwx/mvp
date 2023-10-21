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
            const userName = post.username;
            const userMessage = ` > ${post.message}`;

            const box = document.createElement("div");
            box.id = "box";

            const timeBox = document.createElement("div");
            timeBox.id = "timeBox";
            timeBox.textContent = `${date} ${time}`;

            const chatBox = document.createElement("div");
            chatBox.id = "chatBox";

            const user = document.createElement("span");
            user.innerHTML = `${randomUserColor(userName)}`;

            const message = document.createElement("span");
            message.textContent = userMessage;

            chatBox.appendChild(user);
            chatBox.appendChild(message);
            box.appendChild(timeBox);
            box.appendChild(chatBox);
            chat.appendChild(box);
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

async function getRandomUser() {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const user = data.results[0].login.username;
    return user;
}

const user = await getRandomUser();

chatForm.placeholder = `say something, ${user}...`;

function randomUserColor(user) {
    const savedColor = localStorage.getItem(user);
    if (savedColor) {
        return `<span id='userName' style='color: ${savedColor}'>${user}</span>`;
    }
    const colors = [
        "#FFAB0F", //yellow
        "#247AFD", //blue
        "#FE46A5", //pink
        "#FF073A", //red
        "#32BF84", //green
        "#BE03FD", //purple
        "#CEA2FD", //light purple
        "#F19E8E", //blush
        "#3E82FC", //nice blue
        "#F8481C", //red orange
    ];
    const randomNum = Math.floor(Math.random() * colors.length);
    localStorage.setItem(user, colors[randomNum]);
    return `<span id='userName' style='color: ${colors[randomNum]}'>${user}</span>`;
}
