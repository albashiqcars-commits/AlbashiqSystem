let cars = JSON.parse(localStorage.getItem("cars")) || [];

const form = document.getElementById("carForm");
const table = document.getElementById("carTable");

function saveData() {
    localStorage.setItem("cars", JSON.stringify(cars));
}

function renderTable() {
    table.innerHTML = "";
    cars.forEach((car, index) => {
        table.innerHTML += `
        <tr>
            <td>${car.driverName}</td>
            <td>${car.carNumber}</td>
            <td>${car.remaining}</td>
            <td>
                <button onclick="editCar(${index})">تعديل</button>
                <button onclick="deleteCar(${index})">حذف</button>
            </td>
        </tr>
        `;
    });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("carId").value;
    const driverName = document.getElementById("driverName").value;
    const carNumber = document.getElementById("carNumber").value;
    const dailyAmount = Number(document.getElementById("dailyAmount").value);

    if (id === "") {
        cars.push({
            driverName,
            carNumber,
            dailyAmount,
            remaining: 0
        });
    } else {
        cars[id].driverName = driverName;
        cars[id].carNumber = carNumber;
        cars[id].dailyAmount = dailyAmount;
    }

    saveData();
    renderTable();
    form.reset();
});

function deleteCar(index) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        cars.splice(index, 1);
        saveData();
        renderTable();
    }
}

function editCar(index) {
    const car = cars[index];
    document.getElementById("carId").value = index;
    document.getElementById("driverName").value = car.driverName;
    document.getElementById("carNumber").value = car.carNumber;
    document.getElementById("dailyAmount").value = car.dailyAmount;
}

renderTable();