async function fetchRooms(page = 1, limit = 4) {
    try {
        const response = await fetch(`/api/getrooms?page=${page}&limit=${limit}`);
        const data = await response.json();
        const rooms = data.Rooms;
        renderRooms(rooms);
        renderPagination(data.page, data.totalPages);
        filterDate(rooms, renderRooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
}

function renderPagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    if (currentPage > 1) {
        const prevPage = document.createElement('a');
        prevPage.href = `#`;
        prevPage.className = 'pagination-link';
        prevPage.textContent = 'Previous';
        prevPage.onclick = () => fetchRooms(currentPage - 1);
        paginationContainer.appendChild(prevPage);
    }

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    if (currentPage < totalPages) {
        const nextPage = document.createElement('a');
        nextPage.href = `#`;
        nextPage.className = 'pagination-link';
        nextPage.textContent = 'Next';
        nextPage.onclick = () => fetchRooms(currentPage + 1);
        paginationContainer.appendChild(nextPage);
    }
}

fetchRooms();

function filterDate() {
    const checkInDate = new Date(document.getElementById('checkInDate').value);
    const checkOutDate = new Date(document.getElementById('checkOutDate').value);

    const response = fetch('/api/getrooms');
    response.then(data => data.json()).then(data => {
        const rooms = data.Rooms;

        rooms.forEach(room => {
            const roomElement = document.querySelector(`[data-room-id="${room._id}"]`);

            if (roomElement) {
                const overlappingBookings = room.currentBookings.some(booking => {
                    const bookingCheckIn = new Date(booking.checkInDate);
                    const bookingCheckOut = new Date(booking.checkOutDate);
                    bookingCheckOut.setDate(bookingCheckOut.getDate());
                    return (checkInDate <= bookingCheckOut && checkOutDate >= bookingCheckIn);
                });

                const wrapperElement = roomElement.closest('.wrapper');

                if (room.availableRooms > 0 && !overlappingBookings) {
                    wrapperElement.style.display = 'initial';
                } else if (room.availableRooms > 0 && overlappingBookings) {
                    wrapperElement.style.display = 'initial';
                } else if (room.availableRooms < 1 && !overlappingBookings) {
                    wrapperElement.style.display = 'initial';
                } else {
                    wrapperElement.style.display = 'none';
                }
            }
        });

        checkDateInputs();
    });
}

function checkDateInputs() {
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const filterBtn = document.getElementById('filterBtn');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    document.getElementById('checkInDate').min = `${yyyy}-${mm}-${dd}`;

    const chekin = new Date(checkInDate);
    const year = chekin.getFullYear();
    const mnth = String(chekin.getMonth() + 1).padStart(2, '0');
    const dat = String(chekin.getDate()).padStart(2, '0');
    document.getElementById("checkOutDate").min = `${year}-${mnth}-${dat}`;

    if (!checkInDate) {
        document.getElementById('checkOutDate').disabled = true;
    } else {
        document.getElementById('checkOutDate').disabled = false;
    }

    if (!checkInDate || !checkOutDate) {
        filterBtn.disabled = true;
        filterBtn.style.cursor = 'not-allowed';
        document.querySelectorAll('.book-now-button').forEach(a => {
            a.style.display = 'none';
        });
    } else {
        const checkInDateObj = new Date(checkInDate);
        const checkOutDateObj = new Date(checkOutDate);

        if (checkOutDateObj <= checkInDateObj) {
            filterBtn.disabled = true;
            filterBtn.style.cursor = 'not-allowed';
            document.querySelectorAll('.book-now-button').forEach(a => {
                a.style.display = 'none';
            });
        } else {
            filterBtn.disabled = false;
            filterBtn.style.cursor = 'pointer';
            document.querySelectorAll('.book-now-button').forEach(a => {
                a.style.display = 'initial';
            });
        }
    }
}

document.getElementById('checkInDate').oninput = checkDateInputs;
document.getElementById('checkOutDate').oninput = checkDateInputs;

function renderRooms(rooms) {
    const roomContainer = document.getElementById('roomContainer');
    roomContainer.innerHTML = '';
    rooms.forEach(room => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        wrapper.innerHTML = `
            <h1>${room.roomName}</h1>
            <div class="image i3" style="background-image: url(/uploads/${room.roomImg});"></div>
            <div class="details"><h1><em>${room.roomDesc}</em></h1>
            <div class="no-details">
            <p>Available Rooms: ${room.availableRooms}</p></div>
            </div>
            <h1>Rs.${room.price}</h1>
            <a href="#" class="book-now-button" data-room-id="${room._id}">Book Now</a>
        `;
        roomContainer.appendChild(wrapper);
    });
    document.querySelectorAll('.book-now-button').forEach(a => {
        a.addEventListener('click', function (event) {
            event.preventDefault();
            const roomId = this.dataset.roomId;
            const checkInDate = document.getElementById('checkInDate').value;
            const checkOutDate = document.getElementById('checkOutDate').value;
            const url = `/user/bookroom/${roomId}?checkInDate=${encodeURIComponent(checkInDate)}&checkOutDate=${encodeURIComponent(checkOutDate)}`;
            window.location.href = url;
        });
    });
}
