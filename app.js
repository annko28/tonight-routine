const STORAGE_KEY = "bear-unlock-days-v1";
const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let playlist = [];
let currentVideo = 0;

const dateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const todayKey = dateKey(today);
const days = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

const elements = {
  todayLabel: document.querySelector("#todayLabel"),
  monthLabel: document.querySelector("#monthLabel"),
  calendarGrid: document.querySelector("#calendarGrid"),
  readingButton: document.querySelector("#readingButton"),
  englishButton: document.querySelector("#englishButton"),
  readingState: document.querySelector("#readingState"),
  englishState: document.querySelector("#englishState"),
  lockCard: document.querySelector("#lockCard"),
  lockMark: document.querySelector("#lockMark"),
  lockTitle: document.querySelector("#lockTitle"),
  lockCopy: document.querySelector("#lockCopy"),
  pickLabel: document.querySelector("#pickLabel"),
  videoPicker: document.querySelector("#videoPicker"),
  playlistCount: document.querySelector("#playlistCount"),
  player: document.querySelector("#player"),
  stopButton: document.querySelector("#stopButton"),
  nextButton: document.querySelector("#nextButton"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
};

const formatDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

const formatMonth = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
});

function getDayRecord(key) {
  if (!days[key]) {
    days[key] = { reading: false, english: false };
  }
  return days[key];
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
}

function isUnlocked() {
  const record = getDayRecord(todayKey);
  return record.reading && record.english;
}

function completeTask(task) {
  const record = getDayRecord(todayKey);
  record[task] = true;
  save();
  render();
}

function renderTasks() {
  const record = getDayRecord(todayKey);
  elements.readingButton.classList.toggle("done", record.reading);
  elements.englishButton.classList.toggle("done", record.english);
  elements.readingState.textContent = record.reading ? "Complete" : "Pending";
  elements.englishState.textContent = record.english ? "Complete" : "Pending";
}

function renderLock() {
  const unlocked = isUnlocked();
  elements.lockCard.classList.toggle("unlocked", unlocked);
  elements.lockTitle.textContent = unlocked ? "Unlocked" : "Reward locked";
  elements.lockCopy.textContent = unlocked
    ? "Choose multiple videos from Photos. They will play on repeat."
    : "Complete Reading and English to unlock your videos.";
  elements.videoPicker.disabled = !unlocked;
  elements.pickLabel.classList.toggle("disabled", !unlocked);
}

function renderCalendar() {
  elements.monthLabel.textContent = formatMonth.format(new Date(viewYear, viewMonth, 1));
  elements.calendarGrid.replaceChildren();

  const first = new Date(viewYear, viewMonth, 1);
  const last = new Date(viewYear, viewMonth + 1, 0);
  const offset = first.getDay();

  for (let i = 0; i < offset; i += 1) {
    const blank = document.createElement("div");
    blank.className = "day empty";
    elements.calendarGrid.append(blank);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const cellDate = new Date(viewYear, viewMonth, day);
    const key = dateKey(cellDate);
    const record = days[key];
    const count = Number(Boolean(record?.reading)) + Number(Boolean(record?.english));
    const cell = document.createElement("div");
    cell.className = "day";
    if (key === todayKey) cell.classList.add("today");

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = String(day);
    cell.append(number);

    if (count > 0) {
      const stamp = document.createElement("span");
      stamp.className = "stamp";
      stamp.style.opacity = count === 2 ? ".96" : ".42";
      cell.append(stamp);

      const dots = document.createElement("span");
      dots.className = "progress-dots";
      for (let i = 0; i < count; i += 1) {
        dots.append(document.createElement("span"));
      }
      cell.append(dots);
    }

    elements.calendarGrid.append(cell);
  }
}

function releasePlaylist() {
  playlist.forEach((item) => URL.revokeObjectURL(item.url));
  playlist = [];
  currentVideo = 0;
}

function updateVideoControls() {
  const hasVideos = playlist.length > 0;
  elements.playlistCount.textContent = `${playlist.length}本`;
  elements.stopButton.disabled = !hasVideos;
  elements.nextButton.disabled = !hasVideos;
}

function loadVideo(index, autoplay = true) {
  if (!playlist.length) return;
  currentVideo = (index + playlist.length) % playlist.length;
  elements.player.src = playlist[currentVideo].url;
  elements.player.load();
  if (autoplay) {
    elements.player.play().catch(() => {});
  }
}

function chooseVideos(event) {
  const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("video/"));
  if (!files.length) return;
  releasePlaylist();
  playlist = files.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file),
  }));
  updateVideoControls();
  loadVideo(0, true);
}

function stopPlayback() {
  elements.player.pause();
  elements.player.currentTime = 0;
}

function nextVideo() {
  loadVideo(currentVideo + 1, true);
}

function render() {
  elements.todayLabel.textContent = formatDate.format(today);
  renderTasks();
  renderLock();
  renderCalendar();
  updateVideoControls();
}

elements.readingButton.addEventListener("click", () => completeTask("reading"));
elements.englishButton.addEventListener("click", () => completeTask("english"));
elements.prevMonth.addEventListener("click", () => {
  viewMonth -= 1;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  }
  renderCalendar();
});
elements.nextMonth.addEventListener("click", () => {
  viewMonth += 1;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }
  renderCalendar();
});
elements.videoPicker.addEventListener("change", chooseVideos);
elements.stopButton.addEventListener("click", stopPlayback);
elements.nextButton.addEventListener("click", nextVideo);
elements.player.addEventListener("ended", () => loadVideo(currentVideo + 1, true));

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
