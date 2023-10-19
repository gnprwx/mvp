fetch("/cbbs")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        data.forEach((post) => {
            const p = document.createElement('p');
            let monthDay = post.created_at.slice(5,10);
            let time = post.created_at.slice(11);
            p.innerHTML = `${monthDay} / ${time} | ${post.username} :: ${post.message}`;
            document.body.appendChild(p);
        });
    });
