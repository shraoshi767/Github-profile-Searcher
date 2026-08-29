// script.js

const api = "https://api.github.com/users/";
const main = document.getElementById("main");
const inputForm = document.getElementById("userInput");
const inputBox = document.getElementById("inputBox");

const errorFunction = (error) => {
    main.innerHTML = `
        <div class="card error-card">
            <h2>${error}</h2>
        </div>
    `;
};

const repoCardFunction = (repos) => {
    const reposElement = document.getElementById("repos");
    if (!reposElement) return;

    reposElement.innerHTML = "";

    for (let i = 0; i < 5 && i < repos.length; i++) {
        const repo = repos[i];
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.rel = "noreferrer";
        repoEl.innerText = repo.name;
        reposElement.appendChild(repoEl);
    }
};

const userCard = (user) => {
    const id = user.name || user.login;
    const info = user.bio ? `<p>${user.bio}</p>` : "";

    main.innerHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${id}" class="avatar" />
            </div>

            <div class="user-info">
                <h2>${id}</h2>
                ${info}
                <ul>
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
    `;
};

const loadRepos = async (username) => {
    try {
        const reposResponse = await fetch(`${api}${encodeURIComponent(username)}/repos?sort=created&per_page=6`);
        if (!reposResponse.ok) {
            throw new Error("Problem fetching repos");
        }
        const repos = await reposResponse.json();
        repoCardFunction(repos);
    } catch (err) {
        errorFunction("Problem fetching repos");
    }
};

const userGetFunction = async (name) => {
    const userName = name.trim();
    if (!userName) {
        errorFunction("Please enter a GitHub username");
        return;
    }

    try {
        const response = await fetch(`${api}${encodeURIComponent(userName)}`);
        if (!response.ok) {
            throw new Error(response.status === 404 ? "No profile with this username" : "Unable to fetch profile");
        }

        const user = await response.json();
        userCard(user);
        await loadRepos(user.login);
    } catch (err) {
        errorFunction(err.message || "Something went wrong");
    }
};

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = inputBox.value;
    userGetFunction(user);
    inputBox.value = "";
});