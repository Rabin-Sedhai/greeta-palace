async function fetchRooms() {
    try {
        const response = await fetch('/api/getrooms');
        const data = await response.json();
        const rooms = data.Rooms;
        renderRooms(rooms);

        // Pass the renderRooms function as a callback to filterDate
        filterDate(rooms, renderRooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
}

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
                    bookingCheckOut.setDate(bookingCheckOut.getDate() + 1);
                    return (checkInDate <= bookingCheckOut && checkOutDate >= bookingCheckIn);
                });

                const wrapperElement = roomElement.closest('.wrapper');

                if (room.availableRooms > 0 && !overlappingBookings) {
                    // Render room if available and not booked
                    wrapperElement.style.display = 'initial';
                } else if (room.availableRooms > 0 && overlappingBookings) {
                    // Render room if available and already booked but has available rooms
                    wrapperElement.style.display = 'initial';
                }
                else if (room.availableRooms < 1 && !overlappingBookings) {
                    //Render room if no rooms available and not booked for selected date
                    wrapperElement.style.display = 'initial';
                }
                else {
                    // Hide room if not available or booked
                    wrapperElement.style.display = 'none';
                }
            }
        });

        // Call checkDateInputs function after filtering rooms
        checkDateInputs();
    });
}



// Define checkDateInputs function
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
    const mnth = String(chekin.getMonth() + 1).padStart(2,'0');
    const dat = String(chekin.getDate()).padStart(2,'0');
    document.getElementById("checkOutDate").min = `${year}-${mnth}-${dat}`;


    if(!checkInDate){
        document.getElementById('checkOutDate').disabled = true;
    }else{
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
            // Check-out date should be after check-in date
            filterBtn.disabled = true;
            filterBtn.style.cursor = 'not-allowed';
            document.querySelectorAll('.book-now-button').forEach(a => {
                a.style.display = 'none';
            });
        } else {
            filterBtn.disabled = false;
            filterBtn.style.cursor = 'pointer'
            document.querySelectorAll('.book-now-button').forEach(a => {
                a.style.display = 'initial';
            });
        }
    }
}

// Bind checkDateInputs function to input events
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

fetchRooms();