let score = 0;
let userNick = "Сен";
let currentQuestion = 0;
let quizScore = 0;
let mapInitialized = false;

const players = [
    { name: "GreenMaster", score: 950 },
    { name: "EcoWarrior", score: 820 },
    { name: "Aktobe_Clean", score: 750 },
    { name: "NatureLover", score: 610 },
    { name: "Almaty_Eco", score: 540 },
    { name: "ZeroWaste", score: 490 },
    { name: "RecycleHero", score: 430 },
    { name: "GreenCity", score: 380 },
    { name: "EcoFriend", score: 310 },
    { name: "PlantTree", score: 250 },
    { name: "CleanRiver", score: 180 },
    { name: "TazaStep", score: 90 }
];

const quizData = [
    { q: "Үйде қоқысты сұрыптайсыз ба?", a: ["Иә", "Кейде", "Жоқ"], points: [10, 5, 0] },
    { q: "Пластик пакеттерді қолданасыз ба?", a: ["Ешқашан", "Сирек", "Әрқашан"], points: [10, 5, 0] },
    { q: "Батареяларды қайда өткізесіз?", a: ["Арнайы пунктке", "Жинаймын", "Қоқысқа"], points: [10, 5, 0] }
];

const citiesData = [
    { name: "Астана", lat: 51.1605, lon: 71.4277, prob: "ЖЭО-дан келетін түтін.", sol: "Газға көшу және сүзгілер орнату." },
    { name: "Алматы", lat: 43.2389, lon: 76.8897, prob: "Көлік түтіні және түтін (смог).", sol: "Электробустар және көгалдандыру." },
    { name: "Ақтөбе", lat: 50.2839, lon: 57.1669, prob: "Күкіртсутек және зауыт шығарындылары.", sol: "Тазарту қондырғыларын жаңарту." },
    { name: "Шымкент", lat: 42.3417, lon: 69.5901, prob: "Ретсіз қоқыс үйінділері.", sol: "Қоқыс өңдейтін зауыт салу." },
    { name: "Қарағанды", lat: 49.8019, lon: 73.1021, prob: "Көмір шаңы.", sol: "Қалдық қоймаларын тазарту." }
];

function showPage(pageId) {
    // Переключаем страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    // Вызываем нужные функции в зависимости от страницы
    if (pageId === 'rating') updateRatingTable();
    if (pageId === 'kz-map-page') initKZMap();
    if (pageId === 'my-plant-page') updatePlant();

    // Автоматическое закрытие меню на мобильных телефонах после клика
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

function initKZMap() {
    if (mapInitialized) return;
    const map = L.map('map-kz-container').setView([48.0196, 66.9237], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    citiesData.forEach(city => {
        L.marker([city.lat, city.lon]).addTo(map)
            .bindPopup(`<b>${city.name}</b><br><b>Мәселе:</b> ${city.prob}<br><b>Шешімі:</b> ${city.sol}`);
    });
    mapInitialized = true;
}

function updatePlant() {
    const visual = document.getElementById('plant-visual');
    const status = document.getElementById('plant-status');
    const bar = document.getElementById('plant-progress-bar');
    let size = 1, text = "Жаңадан бастаушы", icon = "🌱";

    if (score < 300) { text = "Жаңадан бастаушы"; icon = "🌱"; size = 1; }
    else if (score < 600) { text = "Әуесқой"; icon = "🌿"; size = 1.5; }
    else if (score < 1000) { text = "Шебер"; icon = "🌳"; size = 2; }
    else { text = "Аңыз"; icon = "🌳✨"; size = 2.8; }

    status.innerText = "Мәртебе: " + text;
    visual.innerHTML = icon;
    visual.style.transform = `scale(${size})`;
    let percent = (score / 1000) * 100;
    bar.style.width = (percent > 100 ? 100 : percent) + "%";
}

function showProblem(type) {
    const detail = document.getElementById('problemDetail');
    const title = document.getElementById('probTitle');
    const img = document.getElementById('probImg');
    const desc = document.getElementById('probDesc');

    detail.style.display = 'block';

    if(type === 'park') {
        title.innerText = "Саябақтағы қоқыс";
        img.src = "park.jpg";
        desc.innerText = "Қалалық саябақта пластик жиналып қалған. Сенбілік қажет!";
    } else if(type === 'river') {
        title.innerText = "Өзеннің ластануы";
        img.src = "river.jpg";
        desc.innerText = "Судың ластану деңгейі жоғары. Шомылуға кеңес берілмейді.";
    }

    img.onerror = function() {
        this.src = "https://via.placeholder.com/400x200?text=Сурет+табылмады";
    };
}

function login() {
    const nick = document.getElementById('nickInput').value;
    if(nick) { userNick = nick; showPage('kz-map-page'); }
    else { alert("Никнеймді толтырыңыз!"); }
}

function checkCity(val) {
    document.getElementById('otherCityInput').style.display = (val === 'other') ? 'block' : 'none';
}

function addPoints(pts, msg) {
    score += pts;
    document.getElementById('userScore').innerText = score;
    updatePlant();
    alert(msg + " +" + pts + " ұпай.");
}

function uploadAndEarn(taskId, pts) {
    const fileInput = document.getElementById('file' + taskId);
    if (fileInput.files.length > 0) { addPoints(pts, "Фото жіберілді!"); fileInput.value = ""; }
    else { alert("Суретті тіркеңіз!"); }
}

function submitAddress() {
    const addr = document.getElementById('addressInput').value;
    if (addr.trim().length > 5) { addPoints(30, "Мекенжай қабылданды!"); document.getElementById('addressInput').value = ""; }
    else { alert("Дұрыс мекенжайды енгізіңіз!"); }
}

function submitTeam() {
    const input = document.getElementById('teamInput').value;
    const members = input.split(',').map(m => m.trim()).filter(m => m !== "");
    if (members.length >= 4) { addPoints(50, `Команда құрылды!`); document.getElementById('teamInput').value = ""; }
    else { alert("Кем дегенде 4 адам керек!"); }
}

function updateRatingTable() {
    const tbody = document.getElementById('ratingBody');
    tbody.innerHTML = "";
    let allPlayers = [...players, { name: userNick, score: score, isUser: true }];
    allPlayers.sort((a, b) => b.score - a.score);
    allPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        if (player.isUser) row.className = 'user-row';
        row.innerHTML = `<td>${index + 1}</td><td>${player.isUser ? '<b>' + player.name + ' (Сен)</b>' : player.name}</td><td>${player.score}</td>`;
        tbody.appendChild(row);
    });
}

function buyItem(cost, itemName) {
    if (score >= cost) { score -= cost; document.getElementById('userScore').innerText = score; updatePlant(); alert(`Сатып алынды: ${itemName}`); }
    else { alert("Ұпай жеткіліксіз!"); }
}

function startQuiz() { currentQuestion = 0; quizScore = 0; showQuestion(); }
function showQuestion() {
    const container = document.getElementById('question-area');
    const data = quizData[currentQuestion];
    let html = `<p>${data.q}</p>`;
    data.a.forEach((ans, i) => { html += `<button onclick="nextQuestion(${data.points[i]})">${ans}</button>`; });
    container.innerHTML = html;
}
function nextQuestion(pts) {
    quizScore += pts;
    currentQuestion++;
    if (currentQuestion < quizData.length) { showQuestion(); }
    else { document.getElementById('question-area').innerHTML = `<h3>Нәтижеңіз: ${quizScore}</h3><button onclick="startQuiz()">Қайтадан</button>`; }
}
