let employees = [];
let usedPhoneNumbers = []; // Array to keep track of used phone numbers

// List of employees at the Al-Nahda branch
const branchEmployees = [
    'Ahmed Ali',
    'Osama Naji',
    'Ahmed Atia',
    'Mahmoud Khattab',
    'Akbar',
    'Amira Hamad',
    'Mai Rashid',
    'Raha Al-Alaati'
];

// Phone numbers for employees (use real phone numbers in production)
const employeePhoneNumbers = {
    'Ahmed Ali': '0545097653',
    'Osama Naji': '0502345678',
    'Ahmed Atia': '0503456789',
    'Mahmoud Khattab': '0504567890',
    'Akbar': '0505678901',
    'Amira Hamad': '0506789012',
    'Mai Rashid': '0507890123',
    'Raha Al-Alaati': '0508901234'
};

const maxDistance = 0.1; // Maximum allowed distance in kilometers

function handleEmployeeSelection() {
    const employeeDropdown = document.getElementById('employeeDropdown');
    const employeeName = employeeDropdown.value;

    if (employeeName === "") {
        return;
    }

    const phoneNumber = employeePhoneNumbers[employeeName];
    if (usedPhoneNumbers.includes(phoneNumber)) {
        alert("This phone number is already used by another employee.");
        return;
    }

    const existingEmployee = employees.find(employee => employee.name === employeeName);
    if (!existingEmployee) {
        const allowedLocation = getDefaultAllowedLocation(employeeName);
        const employee = {
            name: employeeName,
            checkIn: null,
            checkOut: null,
            notes: "",
            allowedLatitude: allowedLocation.latitude,
            allowedLongitude: allowedLocation.longitude,
            phoneNumber: phoneNumber // Store phone number here
        };
        employees.push(employee);
        usedPhoneNumbers.push(phoneNumber); // Add phone number to used list
        renderTable();
    }
}

function getDefaultAllowedLocation(employeeName) {
    const locations = {
        'Ahmed Ali': { latitude: 24.81390110869565, longitude: 46.77630651539072 },
        'Osama Naji': { latitude: 24.81390110869565, longitude: 46.77630651539072 },
        'Ahmed Atia': { latitude: 24.759014139165632, longitude: 46.81264480100531 },
        'Mahmoud Khattab': { latitude: 24.759014139165632, longitude: 46.81264480100531 },
        'Akbar': { latitude: 24.759014139165632, longitude: 46.81264480100531 },
        'Amira Hamad': { latitude: 24.759014139165632, longitude: 46.81264480100531 },
        'Mai Rashid': { latitude: 24.759014139165632, longitude: 46.81264480100531 },
        'Raha Al-Alaati': { latitude: 24.759014139165632, longitude: 46.81264480100531 }
    };
    return locations[employeeName] || { latitude: 24.7136, longitude: 46.6753 }; // Default location if not found
}

function checkIn(index) {
    getLocation((position) => {
        const employee = employees[index];
        if (isLocationAllowed(position.coords.latitude, position.coords.longitude, employee.allowedLatitude, employee.allowedLongitude)) {
            employees[index].checkIn = new Date().toLocaleTimeString();
            renderTable();
        } else {
            alert("You can only check in at your assigned location.");
        }
    });
}

function checkOut(index) {
    getLocation((position) => {
        const employee = employees[index];
        if (isLocationAllowed(position.coords.latitude, position.coords.longitude, employee.allowedLatitude, employee.allowedLongitude)) {
            employees[index].checkOut = new Date().toLocaleTimeString();
            renderTable();
        } else {
            alert("You can only check out at your assigned location.");
        }
    });
}

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback, () => {
            alert("Unable to access your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function isLocationAllowed(latitude, longitude, allowedLatitude, allowedLongitude) {
    const distance = getDistanceFromLatLonInKm(latitude, longitude, allowedLatitude, allowedLongitude);
    return distance <= maxDistance;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon1 - lon2);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function renderTable() {
    const employeeTable = document.getElementById('employeeTable');
    employeeTable.innerHTML = '';
    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.checkIn ? employee.checkIn : '<button class="check-in" onclick="checkIn(' + index + ')">Check In</button>'}</td>
            <td>${employee.checkOut ? employee.checkOut : '<button class="check-out" onclick="checkOut(' + index + ')">Check Out</button>'}</td>
            <td>${employee.checkIn && !employee.checkOut ? '<textarea placeholder="Enter notes here..." oninput="updateNotes(' + index + ', this.value)"></textarea>' : employee.notes}</td>
        `;
        employeeTable.appendChild(row);
    });
}

function updateNotes(index, value) {
    employees[index].notes = value;
}

document.addEventListener('DOMContentLoaded', () => {
    // Populate the dropdown with branch employees
    const employeeDropdown = document.getElementById('employeeDropdown');
    branchEmployees.forEach(employeeName => {
        const option = document.createElement('option');
        option.value = employeeName;
        option.textContent = employeeName;
        employeeDropdown.appendChild(option);
    });
    
    renderTable();
});
