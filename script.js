document.addEventListener('DOMContentLoaded', function () {

    // --- CÁC KHÓA LƯU TRỮ ---
    const EVENT_STORAGE_KEY = 'myCalendarEvents';
    const THEME_STORAGE_KEY = 'myCalendarTheme';

    // --- LẤY RA CÁC PHẦN TỬ HTML ---
    const calendarEl = document.getElementById('calendar');
    const addEventBtn = document.getElementById('add-event-btn');
    const eventTitleInput = document.getElementById('event-title');
    const changeBgBtn = document.getElementById('change-bg-btn');
    const backgroundUrlInput = document.getElementById('background-url');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // ===================================================================
    // --- LOGIC XỬ LÝ GIAO DIỆN (THEME) ---
    // ===================================================================

    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem(THEME_STORAGE_KEY, 'dark');
        } else {
            localStorage.setItem(THEME_STORAGE_KEY, 'light');
        }
    });

    // ===================================================================
    // --- LOGIC XỬ LÝ SỰ KIỆN LỊCH ---
    // ===================================================================

    function saveEvents() {
        const allEvents = calendar.getEvents();
        const storableEvents = allEvents.map(event => ({
            id: event.id,
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay,
        }));
        localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(storableEvents));
    }

    function loadEvents() {
        const eventsJson = localStorage.getItem(EVENT_STORAGE_KEY);
        if (eventsJson) {
            return JSON.parse(eventsJson);
        }
        return [{
            title: 'Chào mừng!',
            start: new Date().toISOString().substring(0, 10) + 'T12:00:00'
        }];
    }

    // --- KHỞI TẠO LỊCH (FULLCALENDAR) ---
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
        locale: 'vi',
        editable: true,
        selectable: true,
        events: loadEvents(),
        eventClick: function (info) {
            const action = prompt("Nhập 'xoa' để xoá. \nNhập tên mới để sửa:", info.event.title);
            if (action !== null) {
                if (action.toLowerCase() === 'xoa') {
                    if (confirm(`Bạn có chắc muốn xóa sự kiện "${info.event.title}" không?`)) {
                        info.event.remove();
                    }
                } else if (action.trim() !== '') {
                    info.event.setProp('title', action);
                }
            }
        },
        eventAdd: saveEvents,
        eventChange: saveEvents,
        eventRemove: saveEvents,
    });

    // --- CÁC HÀM XỬ LÝ KHÁC ---
    addEventBtn.addEventListener('click', function () {
        const title = eventTitleInput.value;
        if (title) {
            calendar.addEvent({ title: title, start: new Date(), allDay: false });
            eventTitleInput.value = '';
        } else {
            alert('Vui lòng nhập tên sự kiện!');
        }
    });

    changeBgBtn.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            alert('Không thể áp dụng hình nền khi đang ở chế độ tối.');
            return;
        }
        const imageUrl = backgroundUrlInput.value;
        if (imageUrl) {
            document.body.style.backgroundImage = `url('${imageUrl}')`;
            backgroundUrlInput.value = '';
        } else {
            alert('Vui lòng nhập URL hình nền!');
        }
    });

    // --- CHẠY CÁC HÀM KHỞI TẠO ---
    loadTheme();
    calendar.render();
});