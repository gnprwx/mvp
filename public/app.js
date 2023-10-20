const chat = document.querySelector("#chat");
const chatForm = document.querySelector("#chat-input");
const submitForm = document.querySelector("form");

async function getPosts() {
    try {
        const response = await fetch("/cbbs");
        const posts = await response.json();
        chat.innerHTML = "";
        chat.innerHTML = posts
            .map((post) => {
                const serverTime = new Date(post.created_at);
                const localTime = serverTime.toLocaleString("en-US");
                const userTime = localTime.slice(11);
                const userDay = localTime.slice(0, 10);
                const userPost = `${post.username} >> ${post.message}`;
                return `
            <div id ='box'>
                <div id ='timeBox'>
                    <p>${userDay}</p>
                    <p>${userTime}</p>
                </div>
                <div id ='chatBox'>
                    <p>${userPost}</p>
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

const response = await fetch("https://randomuser.me/api/");
const data = await response.json();
const user = data.results[0].login.username;

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
