![Alt](https://repobeats.axiom.co/api/embed/0669df06effc7d3a51f33af27173d88f26e7c291.svg "Repobeats analytics image")
# NguyenTin2026 — My Portfolio Website Integrated (with Chatbox AI + NLWeb Protocol) 💼

This repo contains my personal portfolio website. I built it with plain **HTML, CSS, and JavaScript**, and I added a **chatbox** so visitors can interact with the site instead of only reading static pages. The goal is simple: make it easy for someone to understand who I am, what I’ve built, and how to contact me. ✨

---

## What’s inside this project 📌

### Portfolio pages 🧭
The website is split into multiple pages so everything stays clean and easy to navigate:

- `index.html` — landing/home page 🏠
- `about.html` — background + quick intro 👋
- `education.html` — education history 🎓
- `work.html` — work/experience section 🧑‍💻
- `projects.html` — projects page 🛠️
- `contact.html` — contact page 📬

### Styling + behavior 🎨⚙️
- `style.css` controls the look and layout of the whole site 🎨
- `script.js` handles the interactive parts (UI behavior and the chatbox) ⚙️

### Projects data (easy to update) 🗂️
Instead of hard-coding all project info directly in HTML, I keep project data in:
- `projects.json` 🧾

That way, I can add/edit projects in one place and keep the UI consistent. ✅

### Chatbox content 💬
- `questions.txt` is where I keep common questions/answers (or notes) that the chatbox can use 📝

### Contact form (server-side) 📩
- `contact.php` handles contact form logic 📨
- `test.php` is used for testing/debugging the PHP side 🧪

> ⚠️ Note: PHP files won’t run on GitHub Pages. If you want the contact form to work, you need a PHP-capable host.

---

## Folder / file layout 🗃️

```text

├── index.html
├── about.html
├── education.html
├── work.html
├── projects.html
├── contact.html
├── style.css
├── script.js
├── projects.json
├── questions.txt
├── contact.php
├── test.php
├── Images/
├── videos/
├── Resume - Mr. Tin Tin.pdf
├── package.json
├── package-lock.json
└── .gitignore

How to run it locally 🚀
1) Quick way (static preview) 🌐
If you only need to preview the website:
Open index.html directly in a browser, or run a simple local server:
python -m http.server 8000

Then visit:
http://localhost:8000 ✅

2) If you need PHP working (contact form) 🐘
Run a local PHP server from the project folder:
php -S localhost:8080

Then visit:
http://localhost:8080 ✅

3) Clone the repo 📥
git clone https://github.com/<your-username>/NguyenTin2026.git
cd NguyenTin2026
