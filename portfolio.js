const fillFieldOrHide = function (fieldKey, projectData, fillFunction) {
    if (fieldKey in projectData) {
        fillFunction(projectData);
    }
    else {
        document.getElementById(fieldKey).hidden = true;
        Array.from(document.getElementsByClassName(fieldKey)).forEach(e => e.hidden = true);
    }
}

const fillProjectFields = function (projectData) {
    fillFieldOrHide("name", projectData, d => document.getElementById("name").innerHTML = d.name);
    fillFieldOrHide("date", projectData, d => document.getElementById("date").innerText = "Date: " + d.date);
    fillFieldOrHide("externalLink", projectData, d => document.getElementById("externalLink").innerHTML = `Link: <a href=${projectData.externalLink}>${projectData.externalLink}</a>`);
    fillFieldOrHide("keywords", projectData, d => document.getElementById("keywords").innerText = "Keywords: " + projectData.keywords.join(", "));
    fillFieldOrHide("description", projectData, d => document.getElementById("description").innerText = projectData.description);
    fillFieldOrHide("mainImage", projectData, d => document.getElementById("mainImage").src = projectData.mainImage);
    fillFieldOrHide("contributions", projectData, d => document.getElementById("contributions").innerText = projectData.contributions);
}

const handleProject = function (projectId, contentData) {
    const contentDiv = document.getElementById("content");
    fetch("projectDiv.html")
        .then(response => response.text())
        .then(data => {
            const projectData = contentData.projects.find(p => p.id === projectId);
            if (projectData) {
                contentDiv.innerHTML = data;
                fillProjectFields(projectData);
            } else {
                handleCategory(null, contentData);
            }
        });
}

const compareDates = function (a, b) {
    if (a.date < b.date) {
        return -1;
    }
    else if (a.date > b.date) {
        return 1;
    }
    else {
        return 0;
    }
}

const getShortNameOrFullName = function(projectData) {
    return projectData.shortName == null ? projectData.name : projectData.shortName;
}

const handleCategory = function (category, contentData) {
    const categories = contentData.categories;
    const contentDiv = document.getElementById("content");
    const gridDiv = contentDiv.appendChild(document.createElement("div"));
    gridDiv.id = "grid";
    if (category == null || !(categories.includes(category))) {
        category = categories[0];
    }
    contentData.projects.filter(e => e.category === category).sort(compareDates).reverse().forEach(projectData => {
        let div = document.createElement("div");
        div.innerHTML = `<a href="index.html?id=${projectData.id}">
                <img src="${projectData.thumbnail}" alt="${getShortNameOrFullName(projectData)}">
                <h3>${getShortNameOrFullName(projectData)}</h3>
            </a>`;
        gridDiv.appendChild(div);
    });
}

const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get("cat");
const projectIdParam = urlParams.get("id");

fetch("content.json")
    .then(response => response.json())
    .then(data => {
        if (projectIdParam != null) {
            handleProject(projectIdParam, data);
        }
        else {
            handleCategory(categoryParam, data);
        }
    });