// =============================
// 🌙 THEME TOGGLE (Dark / Light)
// =============================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-theme');
    themeToggle.textContent = '☀️';
} else {
    body.classList.add('light-theme');
    body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
}

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-theme');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// =============================
// 🔥 FADE-IN ON SCROLL
// =============================
const fadeElems = document.querySelectorAll('.fade-in');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
fadeElems.forEach(el => appearOnScroll.observe(el));

// =============================
// 🚀 ACTIVE NAV LINK
// =============================
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// =============================
// 🔔 TOAST NOTIFICATION
// =============================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =============================
// ✉️ CONTACT FORM HANDLER (DEBUG-FRIENDLY)
// =============================
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const feedbackTab = document.getElementById("feedback-tab");
    const csrfInput = document.getElementById("csrf_token");

    if (!contactForm || !feedbackTab || !csrfInput) {
        console.error("❌ Contact form elements not found");
        return;
    }

    // ----------------------------
    // 1️⃣ Lấy CSRF token từ server (JSON)
    // ----------------------------
    async function fetchToken() {
        try {
            const res = await fetch("contact.php");
            const data = await res.json();       // JSON-ready
            csrfInput.value = data.csrf_token;   // Set token vào input hidden
            console.log("CSRF token loaded:", data.csrf_token);
        } catch (err) {
            feedbackTab.textContent = "⚠ Failed to get CSRF token";
            feedbackTab.className = "feedback-tab error";
            feedbackTab.style.display = "block";
            console.error("Error fetching CSRF token:", err);
        }
    }

    fetchToken(); // Lấy token khi load trang

    // ----------------------------
    // 2️⃣ Submit form
    // ----------------------------
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Form submit triggered");

        const formData = new FormData(contactForm);
        formData.append("ajax", "1");

        try {
            const res = await fetch("contact.php", {
                method: "POST",
                body: formData
            });

            const data = await res.json(); // JSON response
            console.log("Server response:", data);

            if (data.status === "success") {
                feedbackTab.textContent = "✅ " + data.message;
                feedbackTab.className = "feedback-tab success";
                feedbackTab.style.display = "block";
                contactForm.reset();
                fetchToken(); // refresh CSRF token sau khi gửi thành công
                return;
            }

            // Nếu lỗi (CSRF hoặc validation)
            feedbackTab.textContent = "⚠ " + data.message;
            feedbackTab.className = "feedback-tab error";
            feedbackTab.style.display = "block";

        } catch (err) {
            feedbackTab.textContent = "⚠ Network error while sending message";
            feedbackTab.className = "feedback-tab error";
            feedbackTab.style.display = "block";
            console.error("Submit error:", err);
        }
    });
});



// =============================
// 📂 LOAD PROJECTS FROM JSON
// =============================
fetch('projects.json')
    .then(res => res.json())
    .then(data => {
        const container = document.querySelector('.projects-grid');
        if (!container) return;
        container.innerHTML = data.map(p => `
            <div class="project-card fade-in">
                <img src="${p.img}" alt="${p.title}">
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <a href="${p.demo}" class="btn" target="_blank">Demo</a>
                <a href="${p.video}" class="btn" target="_blank">Video</a>
            </div>
        `).join('');

        // Re-apply fade-in to new elements
        document.querySelectorAll('.fade-in').forEach(el => appearOnScroll.observe(el));
    });

// =============================
// 🎆 FIREWORKS CANVAS
// =============================
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let cw, ch;
function resizeCanvas() {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle class
class Particle {
    constructor(x, y, color, speed, angle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.alpha = 1;
    }
    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.alpha -= 0.02;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Firework class
class Firework {
    constructor(x, y) {
        this.particles = [];
        const colors = ['#ff0055','#fa8231','#ffdd00','#00ff99','#00ddff','#ff00ff'];
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;
            const color = colors[Math.floor(Math.random()*colors.length)];
            this.particles.push(new Particle(x, y, color, speed, angle));
        }
    }
    update() {
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.alpha > 0);
    }
    draw() {
        this.particles.forEach(p => p.draw());
    }
}

let fireworks = [];
function animate() {
    ctx.clearRect(0,0,cw,ch);
    fireworks.forEach(fw => {
        fw.update();
        fw.draw();
    });
    fireworks = fireworks.filter(fw => fw.particles.length > 0);
    requestAnimationFrame(animate);
}
animate();

setInterval(() => {
    const x = Math.random() * cw;
    const y = Math.random() * ch/2; // trên nửa màn hình
    fireworks.push(new Firework(x, y));
}, 800);

// =============================
// 💬 AI CHATBOX
// =============================
const chatBox = document.getElementById("ai-chatbox");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const toggleBtn = document.getElementById("toggle-chatbox");
const toggleDarkBtn = document.getElementById("toggle-dark");

const OPENAI_API_KEY = "API_KEY_HERE"; // <-- Gắn API key

// Send message
    const sendMessage = async (message) => {
      if (!chatMessages) return;
    const userMsg = document.createElement("div");
    userMsg.className="chat-message user";
    userMsg.innerText=message;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const learnedAnswer = getLearnedAnswer(message);
    if (learnedAnswer) {
        const botMsg = document.createElement("div");
        botMsg.className="chat-message bot";
        botMsg.innerText = learnedAnswer;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return;
    }

    const typingMsg = document.createElement("div");
    typingMsg.className="chat-message bot typing";
    typingMsg.innerText = "AI is typing...";
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try{
        const response = await fetch("https://api.openai.com/v1/chat/completions",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages:[{role:"user",content:message}],
                temperature:0.7
            })
        });
        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content || "⚠️ No reply";
        typingMsg.classList.remove("typing");
        typingMsg.innerText = botReply;
    }catch{
        typingMsg.classList.remove("typing");
        typingMsg.innerText = "⚠️ Server error";
    }
}

// Event listeners
chatSend.addEventListener("click", ()=>{
    const msg = chatInput.value.trim();
    if(!msg) return;
    sendMessage(msg);
    chatInput.value="";
});
chatInput.addEventListener("keypress",(e)=>{
    if(e.key==="Enter") chatSend.click();
});
document.getElementById("toggle-dark").addEventListener("click", ()=>{
    chatBox.classList.toggle("dark");
});

// =============================
// 🌐 LANGUAGE TRANSLATE
// =============================
document.getElementById("language-switch").addEventListener("click", async () => {
    const msg = chatInput.value.trim();
    if (!msg) return alert("⚠️ Enter the content you want to translate!");
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user";
    userMsg.innerText = msg;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typingMsg = document.createElement("div");
    typingMsg.className = "chat-message bot typing";
    typingMsg.innerText = "🌐 Translating...";
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [ { role: "user", content: `Translate the following text to English: ${msg}` } ],
                temperature: 0.3
            })
        });
        const data = await response.json();
        const translatedText = data.choices?.[0]?.message?.content || "⚠️ Unable to translate";
        typingMsg.classList.remove("typing");
        typingMsg.innerText = translatedText;
    } catch {
        typingMsg.classList.remove("typing");
        typingMsg.innerText = "⚠️ Server error";
    }
    chatInput.value = "";
});
// =============================
// ✅ SAFE EVENT BINDINGS FOR NEW BUTTONS
// =============================

// Helper: gắn sự kiện click nếu nút tồn tại
function bindClick(id, callback){
    const el = document.getElementById(id);
    if(el) el.addEventListener("click", callback);
}

// =============================
// 🧮 CALCULATOR
// =============================
bindClick("calculator", ()=>{
    const expr = prompt("Enter the calculation (e.g., 5+3*2):");
    if(!expr) return;
    try { alert("Result: " + eval(expr)); }
    catch { alert("Invalid calculation!"); }
});

// =============================
// 🎥 CAMERA
// =============================
document.getElementById("camera").addEventListener("click", async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return alert("Camera not supported!");

    let overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        z-index: 99999;
    `;
    let status = document.createElement("div");
    status.innerText = "🎥 The camera is on...";
    status.style.color = "#fff";
    status.style.marginBottom = "10px";
    overlay.appendChild(status);

    let video = document.createElement("video");
    video.autoplay = true;
    video.style.width = "360px";
    video.style.borderRadius = "10px";
    overlay.appendChild(video);

    let captureBtn = document.createElement("button");
    captureBtn.innerText = "📸 Take a photo";
    captureBtn.style.marginTop = "10px";
    overlay.appendChild(captureBtn);

    let closeBtn = document.createElement("button");
    closeBtn.innerText = "❌ Close the camera.";
    closeBtn.style.marginTop = "5px";
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch {
        status.innerText = "⚠️ Unable to access the camera!";
        return;
    }

    captureBtn.addEventListener("click", () => {
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        const imgData = canvas.toDataURL("image/png");
        const imgMsg = document.createElement("div");
        imgMsg.className = "chat-message user";
        const imgEl = document.createElement("img");
        imgEl.src = imgData;
        imgEl.style.maxWidth = "150px";
        imgMsg.appendChild(imgEl);
        chatMessages.appendChild(imgMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    closeBtn.addEventListener("click", () => {
        stream.getTracks().forEach(track => track.stop());
        overlay.remove();
    });
});

// =============================
// 🎤 AUDIO RECORD
// =============================
document.getElementById("attach-audio").addEventListener("click", async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return alert("Microphone not supported!");

    let overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        z-index: 99999;
    `;
    let status = document.createElement("div");
    status.innerText = "🎤 Press Record to start recording.";
    status.style.color = "#fff";
    status.style.marginBottom = "10px";
    overlay.appendChild(status);

    let recordBtn = document.createElement("button");
    recordBtn.innerText = "⏺️ Record";
    recordBtn.style.marginTop = "10px";
    overlay.appendChild(recordBtn);

    let stopBtn = document.createElement("button");
    stopBtn.innerText = "⏹️ Stop";
    stopBtn.style.marginTop = "5px";
    overlay.appendChild(stopBtn);

    let closeBtn = document.createElement("button");
    closeBtn.innerText = "❌ recording closed";
    closeBtn.style.marginTop = "5px";
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    let mediaRecorder, audioChunks = [];
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstart = () => { status.innerText = "🎤 recording..."; };
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const audioURL = URL.createObjectURL(audioBlob);
            const audioMsg = document.createElement("div");
            audioMsg.className = "chat-message user";
            const audioEl = document.createElement("audio");
            audioEl.controls = true;
            audioEl.src = audioURL;
            audioMsg.appendChild(audioEl);
            chatMessages.appendChild(audioMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            status.innerText = "🎤 recording finished!";
        };

        recordBtn.onclick = () => { audioChunks = []; mediaRecorder.start(); };
        stopBtn.onclick = () => { if(mediaRecorder.state === "recording") mediaRecorder.stop(); };
        closeBtn.onclick = () => { if(mediaRecorder.state !== "inactive") mediaRecorder.stop(); stream.getTracks().forEach(track => track.stop()); overlay.remove(); };
    } catch {
        status.innerText = "⚠️ Cannot get access the micro";
    }
});

// =============================
// 💬 CHATBOX TOGGLE
// =============================
const toggleChatBtn = document.getElementById("toggle-chatbox");
toggleChatBtn.addEventListener("click", () => {
    chatBox.style.display = (chatBox.style.display === "none") ? "flex" : "none";
});

// =============================
// 🧠 LEARNING AI Q&A
// =============================
function learnQuestionAnswer(question, answer, role="user") {
    let learned = JSON.parse(localStorage.getItem("learnedQA") || "[]");
    learned.push({ question, answer, role });
    localStorage.setItem("learnedQA", JSON.stringify(learned));
    console.log("Learned:", question, "→", answer);
}

function getLearnedAnswer(message) {
    const learned = JSON.parse(localStorage.getItem("learnedQA") || "[]");
    for (let item of learned) {
        if (item.question.toLowerCase() === message.toLowerCase()) return item.answer;
    }
    return null;
}


// ===== Ví dụ: học hỏi =====
learnQuestionAnswer("Who was created this Project?", 
"This Project was created by Do Nguyen Tin Tin, a Vietnamese programmer. He is currently studying at Drew University,  Madison, New Jersey.", 
"user");
// ==================== Faculty Q&A Training ====================
// Chris Apelian
learnQuestionAnswer(
  "Who is Chris Apelian?",
  "Chris Apelian is a Professor of Mathematics at Drew University. He earned his B.S. in mathematics and chemistry from Rutgers University and completed his Ph.D. in Mathematics at the Courant Institute of Mathematical Sciences, NYU. His research includes applied mathematics, probability, stochastic processes, and modeling turbulent transport. He co-authored an undergraduate text on real and complex analysis, and his current interests include agent-based modeling and simulation in science.",
  "user"
);

// Barry Burd
learnQuestionAnswer(
  "Who is Barry Burd?",
  "Barry Burd is a Professor of Mathematics and Computer Science at Drew University. He holds an M.S. in Computer Science from Rutgers University and a Ph.D. in Mathematics from the University of Illinois. He has lectured internationally and is the author of well-known books such as Java For Dummies and Android Application Development All-in-One For Dummies.",
  "user"
);

// Valerie Siyuan Feng
learnQuestionAnswer(
  "Who is Valerie Siyuan Feng?",
  "Valerie Siyuan Feng is an Assistant Professor of Mathematics and Computer Science at Drew University. She holds multiple degrees from The George Washington University, including a Ph.D. in Computer Science, an M.S. in Applied Mathematics, an M.S. in Computer Science, and a B.A. in Computer Science & Mathematics. Her research focuses on Information Assurance, algorithms for secure systems, cryptography, and related fields.",
  "user"
);

// Seth Harris
learnQuestionAnswer(
  "Who is Seth Harris?",
  "Seth Harris is an Assistant Teaching Professor of Mathematics at Drew University. He holds a Ph.D. in Mathematics from Dartmouth College. His research interests include mathematical logic, computability theory, and Reverse Mathematics, which studies which axioms are required to prove specific theorems.",
  "user"
);

// Prasad Kothapalli
learnQuestionAnswer(
  "Who is Prasad Kothapalli?",
  "Prasad Kothapalli is an Adjunct Professor of Data Analytics at Drew University. He earned an M.S. in Applied Data Analytics from Boston University and an M.S. in Computer Science from the University of Hyderabad, India. He specializes in Machine Learning, Digital Transformation, and Database Programming, and has over 30 years of industry experience.",
  "user"
);

// Steve Kass
learnQuestionAnswer(
  "Who is Steve Kass?",
  "Steve Kass is an Emeritus Professor of Mathematics and Computer Science at Drew University. He holds degrees from Pomona College and the University of Wisconsin–Madison, and completed postdoctoral work at the University of Montreal and Los Alamos National Laboratory. His research includes Dynamical Systems, Lie Algebras, database programming, and computer science education.",
  "user"
);

// Diane Liporace
learnQuestionAnswer(
  "Who is Diane Liporace?",
  "Diane Liporace is an Assistant Teaching Professor of Mathematics and Computer Science at Drew University. She holds an M.S. in Computer Science from Montclair State University and a B.S. in Mathematics from Mercy College. She has co-authored research in data analytics applied to urban legislation.",
  "user"
);

// Yi Lu
learnQuestionAnswer(
  "Who is Yi Lu?",
  "Yi Lu is the Norma Gilbert Junior Assistant Professor of Mathematics and Computer Science and the Chair of the Department at Drew University. She earned her Ph.D. in Statistics from The Ohio State University. Her research focuses on Bayesian methods, functional data, and statistical analysis of curves and images.",
  "user"
);

// Adam Michlin
learnQuestionAnswer(
  "Who is Adam Michlin?",
  "Adam Michlin is an Assistant Professor of Cybersecurity at Drew University. He holds an M.S. in Computer Science with a cybersecurity focus from Monmouth University and a B.S. in Computer Science from the University of California, Santa Cruz. He has over 20 years of experience teaching Computer Science and specializes in offensive and defensive cybersecurity, computer architecture, and CS education.",
  "user"
);

// Alex Rudniy
learnQuestionAnswer(
  "Who is Alex Rudniy?",
  "Alex Rudniy is an Associate Professor of Computer Science at Drew University. He earned his Ph.D. in Computer Science from NJIT and previously taught at the University of Scranton and Fairleigh Dickinson University. His research includes artificial intelligence, machine learning, natural language processing, time series forecasting, and cybersecurity.",
  "user"
);

// Steve Surace
learnQuestionAnswer(
  "Who is Steve Surace?",
  "Steve Surace is an Emeritus Professor of Mathematics at Drew University and the Associate Director of the New Jersey Governor's School in the Sciences. He holds a Ph.D. in Mathematics from the Courant Institute at New York University. His interests include analysis, mathematical physics, cosmology, and mathematics education.",
  "user"
);

// ==================== End of Faculty Q&A Training ====================

// ==================== Nguyen Tin Tin Do Q&A Training ====================
// Basic Profile
learnQuestionAnswer(
  "Who is Nguyen Tin Tin Do?",
  "Nguyen Tin Tin Do is a Data Scientist specializing in MLOps, machine learning automation, and production-level AI systems. He builds and deploys end-to-end machine learning pipelines using Python, TensorFlow, Scikit-learn, FastAPI, Docker, and cloud technologies. He is passionate about automated workflows and scalable AI solutions.",
  "user"
);

learnQuestionAnswer(
  "What is the contact information of Nguyen Tin Tin Do?",
  "Phone: (862) 579-6543 | Email: email@drew.edu | LinkedIn: linkedin.com/in/nguyen-tin-tin-do | GitHub: github.com/NguyenTin",
  "user"
);

// Professional Summary
learnQuestionAnswer(
  "What is the professional summary of Nguyen Tin Tin Do?",
  "Nguyen Tin Tin Do is a Data Scientist focused on MLOps and automation of machine learning workflows. He is experienced in building end-to-end ML models, optimizing performance, and deploying scalable solutions with Python, TensorFlow, Scikit-learn, FastAPI, Docker, and cloud platforms. He is committed to creating reliable, production-ready AI systems that deliver real business value.",
  "user"
);

// Education
learnQuestionAnswer(
  "What is the education background of Nguyen Tin Tin Do?",
  "He is pursuing a Bachelor of Science in Computer Science with a Minor in Data Science at Drew University in Madison, New Jersey, with a GPA of 3.7/4.0. Expected graduation: May 2027. He received a Merit Scholarship of $15,000 (Fall 2025 – Spring 2026). Relevant coursework includes Artificial Intelligence, Data Science, and Database Systems.",
  "user"
);

// Projects
learnQuestionAnswer(
  "What projects has Nguyen Tin Tin Do worked on?",
  "He has completed several major projects: (1) Real-time Face Recognition using OpenCV and Haar Cascades with 95% accuracy and 30–60 FPS performance optimization. (2) API Testing & Projects using FastAPI, Postman, Git, GitHub, and Bitbucket. (3) Data Analysis & Visualization with Python, Pandas, NumPy, Matplotlib, and PostgreSQL. (4) Titanic Survival Prediction using Logistic Regression and Random Forest achieving ~85% accuracy.",
  "user"
);

learnQuestionAnswer(
  "What is the Face Recognition project by Nguyen Tin Tin Do?",
  "He built a real-time face detection and recognition system using OpenCV and Haar Cascade classifiers with over 95% accuracy. The project supported webcam, image, and video inputs and achieved 30FPS on CPU and 60FPS on GPU, with a 25% latency reduction through optimization.",
  "user"
);

// Work Experience
learnQuestionAnswer(
  "What is the work experience of Nguyen Tin Tin Do?",
  "He works as a Freelance AI Developer and Independent Researcher, building object detection systems using YOLOv5 and OpenCV, and performing data analysis with Pandas, Matplotlib, and Seaborn. He also worked as a Social Media Content Creator from 2021 to 2025, managing multiple accounts such as TikTok (22K followers), Instagram (12K), Threads (1K), and Facebook (18K).",
  "user"
);

learnQuestionAnswer(
  "What did Nguyen Tin Tin Do do as a freelance AI developer?",
  "He developed real-time object detection systems with YOLOv5 and OpenCV and performed dataset processing, cleaning, and visualization using Pandas and Matplotlib to extract actionable insights.",
  "user"
);

// Leadership & Activities
learnQuestionAnswer(
  "What leadership roles has Nguyen Tin Tin Do held?",
  "He founded and managed two free English learning platforms with over 900 followers. He volunteered as an English instructor, delivered presentations, conducted tutoring sessions, and organized weekly online learning programs for English and Mathematics.",
  "user"
);

// Technical Skills
learnQuestionAnswer(
  "What technical skills does Nguyen Tin Tin Do have?",
  "Programming & Data Science: Python, R, Java, C++, TypeScript, JavaScript, HTML, CSS, SQL (PostgreSQL). Libraries: NumPy, Pandas, SciPy, Matplotlib, Seaborn, TensorFlow, Scikit-learn, OpenCV, PyTorch, Keras, YOLO, Streamlit. Tools: Git, GitHub, GitLab, Bitbucket, Docker. Cloud: GCP, Microsoft Azure. Environments: Jupyter Notebook, VS Code, Anaconda, Google Colab, Sublime Text, PyCharm, Kaggle.",
  "user"
);

// Other Skills
learnQuestionAnswer(
  "What other skills does Nguyen Tin Tin Do have?",
  "He is experienced with Google Workspace, Microsoft Office, CapCut, Adobe Photoshop, and Canva. Soft skills include teamwork, communication, critical thinking, and problem solving. Languages: English (Proficient), Vietnamese (Native), Spanish (Basic).",
  "user"
);
learnQuestionAnswer(
  "What is Tin Tin Do passionate about?",
  "He is passionate about real-time computer vision systems that combine AI, mathematics, and data to solve impactful real-world problems.",
  "user"
);

learnQuestionAnswer(
  "What technical skills does Tin Tin have?",
  "His skills include Python, R, HTML, CSS, JavaScript, SQL, Machine Learning, Deep Learning, Computer Vision, NLP, GenAI, Pandas, NumPy, Matplotlib, TensorFlow, Keras, PyTorch, OpenCV, Streamlit, Docker, GitLab, Azure, and Hugging Face.",
  "user"
);

learnQuestionAnswer(
  "What tools does Tin Tin use for AI development?",
  "He uses Scikit-learn, TensorFlow, PyTorch, Keras, YOLO, OpenCV, Streamlit, and cloud tools like Azure and Hugging Face.",
  "user"
);
learnQuestionAnswer(
  "What is Tin Tin Do studying?",
  "He is studying Computer Science with a minor in Data Science at Drew University, with a GPA of 3.7.",
  "user"
);

learnQuestionAnswer(
  "What is Tin Tin Do's career focus?",
  "He focuses on Deep Learning, Computer Vision, ML pipelines, and MLOps deployment for real-world AI systems.",
  "user"
);

learnQuestionAnswer(
  "What are Tin Tin's main strengths?",
  "His strengths include building ML pipelines, deploying AI systems, optimizing models, and creating end-to-end solutions using Streamlit and Hugging Face.",
  "user"
);

learnQuestionAnswer(
  "What programming languages does Tin Tin know?",
  "He knows Python, R, Java, C++, HTML, CSS, JavaScript, and SQL.",
  "user"
);
learnQuestionAnswer(
  "What AI work has Tin Tin done?",
  "He built and deployed real-time object detection and face recognition systems using YOLOv5, OpenCV, TensorFlow, and PyTorch.",
  "user"
);

learnQuestionAnswer(
  "What experience does Tin Tin have as a content creator?",
  "He managed social media accounts with thousands of followers across TikTok, Instagram, Threads, and Facebook, improving engagement and video performance.",
  "user"
);

learnQuestionAnswer(
  "Has Tin Tin done any teaching or leadership work?",
  "Yes, he founded two free English learning platforms with 900+ followers and conducted weekly English and Math tutoring sessions.",
  "user"
);
learnQuestionAnswer(
  "Where did Tin Tin Do study?",
  "He studied at Drew University (Computer Science, Data Science), Ho Chi Minh City University of Technology and Education, Binh Chieu High School, and Le Quy Don Secondary School.",
  "user"
);

learnQuestionAnswer(
  "What certificates does Tin Tin have?",
  "He holds certifications in Data Science and Python from W3Schools, and completed AI courses such as CNNs, RNNs, and deployment with Python and OpenCV.",
  "user"
);
learnQuestionAnswer(
  "What AI projects has Tin Tin built?",
  "His projects include real-time Face Recognition, YOLO Object Detection, Streamlit AI Web Apps, and Data Analysis Dashboards.",
  "user"
);

learnQuestionAnswer(
  "What YOLO projects has Tin Tin completed?",
  "He built real-time object detection systems using YOLOv5 and YOLOv8 for images, videos, and webcams.",
  "user"
);

learnQuestionAnswer(
  "What is Tin Tin's Face Recognition Project?",
  "It is a deep-learning-based real-time face detection and recognition system using OpenCV and neural networks.",
  "user"
);
learnQuestionAnswer(
  "How can I contact Nguyen Tin Tin Do?",
  "You can reach him via email at email@drew.edu, LinkedIn, GitHub, or phone at (+1) XXX-XXX-XXXX.",
  "user"
);

learnQuestionAnswer(
  "What collaborations is Tin Tin open to?",
  "He is open to collaborations in AI, Machine Learning, Deep Learning, Computer Vision, and Data Science.",
  "user"
);


// ======================= Web Application Development – CSCI 250 (Fall 2025) =======================

learnQuestionAnswer("What is the course title for CSCI 250?", 
"Web Application Development.", "user");

learnQuestionAnswer("Who is the professor for Web Application Development CSCI 250?", 
"Professor Adam Michlin.", "user");

learnQuestionAnswer("What semester is this syllabus for?", 
"Fall 2025.", "user");

learnQuestionAnswer("When does the class meet?", 
"The class meets on Tuesday and Thursday from 1:15pm to 2:30pm.", "user");

learnQuestionAnswer("Where is the professor's office for CSCI 250?", 
"Professor Adam Michlin's office is HS309.", "user");

learnQuestionAnswer("What is the professor's phone number for the course?", 
"TBA (To Be Announced).", "user");

learnQuestionAnswer("What is Professor Adam Michlin's email address?", 
"amichlin@drew.edu", "user");

learnQuestionAnswer("When are the professor's office hours?", 
"HS307 (Team Space): Wednesday 12:30–2:30pm. HS4: Tuesday and Thursday 5:30–6:00pm. Additional meetings by appointment, in person or via Zoom.", "user");

learnQuestionAnswer("What textbook is required for Web Application Development?", 
"Book information, including links to free PDFs, is available at http://code.ceos.io/ebooks/web", "user");

learnQuestionAnswer("Do students need to bring a laptop to class?", 
"Yes. Students must bring a laptop running Windows, Linux, or MacOS.", "user");

learnQuestionAnswer("What is the Google Classroom code for CSCI 250?", 
"The Google Classroom code is c7wrw5fu.", "user");

learnQuestionAnswer("What topics does the course cover?", 
"The course surveys technologies for web software development, including client-server computing, UI/UX, front-end and back-end development, databases, and web security.", "user");

learnQuestionAnswer("How is the course structured?", 
"The course is divided into three components: (1) HTML, (2) Client-Side Programming, and (3) Server-Side Programming.", "user");

learnQuestionAnswer("How is the course graded?", 
"Projects/Homework: 30%, Exams: 30%, Final Exam: 40%.", "user");

learnQuestionAnswer("What is the rule about final grade limits?", 
"A student's final letter grade cannot be more than one full letter higher than their average on exams and the final.", "user");

learnQuestionAnswer("What are the grade cutoffs for the class?", 
"A = 92–100; A- = 90–92; B+ = 88–90; B = 82–88; B- = 80–82; C+ = 78–80; C = 72–78; C- = 70–72; D+ = 68–70; D = 62–68; D- = 60–62; F = 0–60.", "user");

learnQuestionAnswer("What is the late policy for projects and homework?", 
"Projects must be complete and turned in on time. Late submissions lose 10% per class meeting, up to 30%. After three class meetings late, the grade is zero.", "user");

learnQuestionAnswer("Can partially completed projects be submitted?", 
"No. Partially completed projects are not accepted.", "user");

learnQuestionAnswer("Why does the course have a strict late policy?", 
"To encourage mastery of material rather than minimal partial credit, while still offering flexibility.", "user");

learnQuestionAnswer("What should a student do if they are turning in assignments late?", 
"They should meet with the professor as soon as possible for help.", "user");

learnQuestionAnswer("What is the academic integrity policy for this course?", 
"All students must follow Drew University's Standards of Academic Integrity. Any violations are reported to the Dean.", "user");

learnQuestionAnswer("Is collaboration allowed on quizzes or exams?", 
"No collaboration is permitted on quizzes, exams, or the final exam.", "user");

learnQuestionAnswer("What counts as cheating in this course?", 
"Submitting nearly identical work, turning in someone else’s work, using downloaded code as your own, or being unable to explain your submitted solution.", "user");

learnQuestionAnswer("Are students allowed to study together?", 
"Yes, group studying for exams is allowed and encouraged.", "user");

learnQuestionAnswer("What is the AI policy for the class?", 
"AI tools like ChatGPT are encouraged as learning aids. However, assessments are paper-based with no AI assistance, so students must fully understand the concepts.", "user");

learnQuestionAnswer("What is the class attendance policy?", 
"Attendance is mandatory. The first unexcused absence reduces the semester grade by 1%. Absences 2–5 also deduct 1% each. More than five unexcused absences results in failure.", "user");

learnQuestionAnswer("How are excused absences handled?", 
"Excused absences must be approved by the Center for Academic Excellence.", "user");

learnQuestionAnswer("Can makeup exams be taken?", 
"Only for absences approved by the Center for Academic Excellence.", "user");

learnQuestionAnswer("What are legitimate planned absences?", 
"Religious holidays, NCAA competition, academic conferences, or Drew-sanctioned events.", "user");

learnQuestionAnswer("When must students notify professors of planned absences?", 
"Within the first week of the semester.", "user");

learnQuestionAnswer("Where will course materials be posted?", 
"All course materials will be posted on Google Classroom.", "user");

learnQuestionAnswer("How often should students check their email?", 
"Students should check their Drew email every day.", "user");

learnQuestionAnswer("How do students request accommodations at Drew?", 
"They must contact the Office of Accessibility Resources (BC 119C, 973-408-3962) for a confidential appointment.", "user");

learnQuestionAnswer("When must accommodation letters be given to the professor?", 
"At least one week before the accommodation is needed. They cannot be applied retroactively.", "user");

learnQuestionAnswer("When should accommodation requests be submitted?", 
"Within the first two weeks of the course.", "user");

learnQuestionAnswer("Where can students find the final exam schedule?", 
"On the Registrar’s website, available at the beginning of the semester.", "user");

learnQuestionAnswer("Can students negotiate final exam dates directly with the instructor?", 
"No. Rescheduling must be submitted to the Associate Provost.", "user");

learnQuestionAnswer("What reasons allow a final exam to be rescheduled?", 
"Two exams at the same time, three exams in one day, serious illness, or personal emergency.", "user");

learnQuestionAnswer("What is the deadline to submit Final Exam Reschedule requests?", 
"The last day of classes for the term.", "user");

// ======================= Computer Networks & Security – CSCI 350 (Fall 2025) =======================

learnQuestionAnswer("What is the course title for CSCI 350?", 
"Computer Networks and Security.", "user");

learnQuestionAnswer("Who is the professor for CSCI 350?", 
"Professor Adam Michlin.", "user");

learnQuestionAnswer("When does CSCI 350 meet?", 
"The class meets on Tuesday and Thursday from 2:40pm to 3:55pm.", "user");

learnQuestionAnswer("Where is the professor's office?", 
"Professor Adam Michlin's office is HS309.", "user");

learnQuestionAnswer("What is the professor's phone number for CSCI 350?", 
"TBA (To Be Announced).", "user");

learnQuestionAnswer("What is Professor Adam Michlin's email address?", 
"amichlin@drew.edu", "user");

learnQuestionAnswer("What are the office hours for CSCI 350?", 
"HS307 Team Space: Wednesday 12:30–2:30pm. HS4: Tuesday and Thursday 5:30–6:00pm. Additional meetings by appointment (in person or via Zoom).", "user");

learnQuestionAnswer("What textbook is required for CSCI 350?", 
"Book information, including free PDF links, is available at http://code.ceos.io/ebooks/networks", "user");

learnQuestionAnswer("Do students need to bring a laptop for CSCI 350?", 
"Yes. Students must bring a laptop running Windows, Linux, or MacOS.", "user");

learnQuestionAnswer("What is the Google Classroom code for CSCI 350?", 
"The Google Classroom code is u2r6cn4y.", "user");

learnQuestionAnswer("What does the catalog entry for CSCI 350 describe?", 
"The course surveys internet technologies and the five-layer network model: Application Layer (HTTP, REST, DNS), Transport (TCP, UDP, flow control, congestion control, sockets), Network (routing algorithms, IP, DHCP, NAT), Data Link (Ethernet, ARP, switches, CDMA), and Physical Layer (transmission, packet/circuit switching, multiplexing, delays). It also covers security vulnerabilities and cryptography.", "user");

learnQuestionAnswer("What are the three components of the course?", 
"(1) Network Basics, (2) Lower Level Networking, (3) Network Programming.", "user");

learnQuestionAnswer("How is CSCI 350 graded?", 
"Projects/Homework: 30%. Exam 1 (Network Basics): 15%. Exam 2 (Lower Level Networking): 15%. Final Exam: 40%.", "user");

learnQuestionAnswer("Is there a limit on how much the final letter grade can exceed exam averages?", 
"Yes. A student's final letter grade cannot be more than one letter higher than their average on the exams and final.", "user");

learnQuestionAnswer("What are the grade cutoffs for CSCI 350?", 
"A = 92–100; A- = 90–92; B+ = 88–90; B = 82–88; B- = 80–82; C+ = 78–80; C = 72–78; C- = 70–72; D+ = 68–70; D = 62–68; D- = 60–62; F = 0–60.", "user");

learnQuestionAnswer("What is the late policy for projects and homework?", 
"Projects must be complete and submitted on time. Students may submit up to three class meetings late with a 10% deduction per meeting, up to 30% total. After more than three late class meetings, the project receives a zero.", "user");

learnQuestionAnswer("Can partially completed projects be submitted in CSCI 350?", 
"No. Partially completed projects are not accepted.", "user");

learnQuestionAnswer("Why does the course enforce a strict late policy?", 
"To encourage full mastery of course material and prevent students from relying on partial credit.", "user");

learnQuestionAnswer("What should students do if assignments become consistently late?", 
"They should arrange to meet with the professor as soon as possible for help.", "user");

learnQuestionAnswer("What is the academic integrity policy for this course?", 
"Students must uphold Drew University's Standards of Academic Integrity. Any violations will be reported to the Dean with no exceptions.", "user");

learnQuestionAnswer("Is collaboration allowed on quizzes or exams?", 
"No. Collaboration is prohibited on quizzes, exams, and the final exam.", "user");

learnQuestionAnswer("What counts as cheating in CSCI 350?", 
"Submitting nearly identical work, using another student’s work, turning in downloaded code, or being unable to explain your submitted work.", "user");

learnQuestionAnswer("Are students allowed to study together?", 
"Yes. Group study for exams is allowed and encouraged.", "user");

learnQuestionAnswer("What is the AI policy for CSCI 350?", 
"AI tools like ChatGPT are encouraged as learning aids, but assessments are paper-based with no AI assistance. Students must genuinely understand concepts.", "user");

learnQuestionAnswer("What is the attendance policy for CSCI 350?", 
"Attendance is mandatory. First unexcused absence reduces the semester grade by 1%. Absences 2–5 deduct another 1% each. More than five unexcused absences results in failure.", "user");

learnQuestionAnswer("How are excused absences handled?", 
"They must be processed through the Center for Academic Excellence.", "user");

learnQuestionAnswer("Are makeup exams allowed?", 
"Only for approved absences from the Center for Academic Excellence.", "user");

learnQuestionAnswer("What are legitimate planned absences?", 
"Religious holidays, NCAA events, academic conferences, or other Drew-sanctioned activities.", "user");

learnQuestionAnswer("When must students notify the professor of planned absences?", 
"During the first week of the semester.", "user");

learnQuestionAnswer("Where will course materials be posted?", 
"On the Google Classroom for the course.", "user");

learnQuestionAnswer("How often should students check email for this course?", 
"Students should check their Drew email every day.", "user");

learnQuestionAnswer("How do students request accommodations at Drew?", 
"They must contact the Office of Accessibility Resources (BC 119C, 973-408-3962) for a confidential appointment.", "user");

learnQuestionAnswer("When must accommodation letters be given to the professor?", 
"At least one week before the accommodation is needed. They cannot be applied retroactively.", "user");

learnQuestionAnswer("When should students submit accommodation requests?", 
"Within the first two weeks of the semester.", "user");

learnQuestionAnswer("Where can students find the final exam schedule?", 
"On the Registrar's website at the start of the semester.", "user");

learnQuestionAnswer("Can students negotiate final exam rescheduling directly with the professor?", 
"No. Rescheduling requests must be submitted to the Associate Provost.", "user");

learnQuestionAnswer("What situations justify rescheduling a final exam?", 
"Two finals at the same time, three finals in one day, serious illness, or a personal emergency.", "user");

learnQuestionAnswer("What is the deadline for final exam reschedule requests?", 
"The last day of classes for the term.", "user");
