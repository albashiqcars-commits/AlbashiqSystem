const firebaseConfig = {
  apiKey: "AIzaSyAjxlRr_Ij1shphaL2mOaY1HDUqM6BcYUc",
  authDomain: "al-bashaq-system.firebaseapp.com",
  projectId: "al-bashaq-system",
  storageBucket: "al-bashaq-system.firebasestorage.app",
  messagingSenderId: "982554262765",
  appId: "1:982554262765:web:a372c97a02eade419860e4",
  measurementId: "G-76BEYKK5G3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ----- تسجيل الدخول -----
function login(){
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if(user === "admin" && pass === "albashiq2002"){
        document.getElementById("loginDiv").style.display="none";
        document.getElementById("systemDiv").style.display="block";
        loadCars();
    }else{
        alert("بيانات الدخول غير صحيحة");
    }
}

// ----- إضافة سيارة -----
function addCar(){
    const car = {
        name: document.getElementById("carName").value,
        number: document.getElementById("carNumber").value,
        type: document.getElementById("carType").value,
        owner: document.getElementById("ownerName").value,
        dailyPayment: Number(document.getElementById("dailyPayment").value),
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        ownerPercentage: Number(document.getElementById("ownerPercentage").value),
        officePercentage: Number(document.getElementById("officePercentage").value)
    };

    db.collection("cars").doc(car.number).set(car).then(()=>{
        alert("تم إضافة السيارة");
        loadCars();
    });
}

// ----- إضافة مصروف لكل سيارة -----
function addCarExpense(){
    const carNumber = document.getElementById("expenseCarSelect").value;
    const description = document.getElementById("expenseDescription").value;
    const amount = Number(document.getElementById("expenseAmount").value);

    if(!carNumber) return alert("اختر السيارة");

    db.collection("cars").doc(carNumber).collection("expenses").add({
        description, amount, date: new Date().toISOString().split("T")[0]
    }).then(()=>{
        alert("تم إضافة المصروف");
        loadCars();
    });
}

// ----- إضافة مصروف للمكتب العام -----
function addOfficeExpense(){
    const description = document.getElementById("officeExpenseDescription").value;
    const amount = Number(document.getElementById("officeExpenseAmount").value);

    db.collection("officeExpenses").add({
        description, amount, date: new Date().toISOString().split("T")[0]
    }).then(()=>{
        alert("تم إضافة مصروف المكتب العام");
        loadCars();
    });
}

// ----- تحميل السيارات والمصروفات -----
async function loadCars(){
    const table = document.getElementById("carsTable");
    table.innerHTML = `
<tr>
<th>الاسم</th><th>الرقم</th><th>النوع</th><th>المالك</th><th>اليومي</th>
<th>بداية</th><th>نهاية</th><th>% المالك</th><th>% المكتب</th>
<th>إجمالي الدخل</th><th>مصروف السيارة</th><th>صافي المالك</th><th>صافي المكتب</th>
</tr>
`;

    const expenseSelect = document.getElementById("expenseCarSelect");
    expenseSelect.innerHTML = "<option value=''>اختر السيارة</option>";

    let totalOfficeIncome = 0;

    const snapshot = await db.collection("cars").get();
    for(const doc of snapshot.docs){
        const car = doc.data();
        const carNumber = car.number;
        expenseSelect.innerHTML += `<option value="${carNumber}">${car.name} (${car.number})</option>`;

        // حساب مصروفات السيارة
        let carExpensesSnap = await db.collection("cars").doc(carNumber).collection("expenses").get();
        let totalCarExpenses = 0;
        carExpensesSnap.forEach(exp => totalCarExpenses += exp.data().amount);

        // إجمالي الدخل
        let totalIncome = car.dailyPayment * 1; // يمكن تعديل الأيام لاحقًا
        let ownerShare = totalIncome * car.ownerPercentage / 100;
        let officeShare = totalIncome * car.officePercentage / 100;

        totalOfficeIncome += officeShare;

        const netOwner = ownerShare - totalCarExpenses;
        const netOffice = officeShare;

        const row = table.insertRow();
        row.insertCell(0).innerText = car.name;
        row.insertCell(1).innerText = car.number;
        row.insertCell(2).innerText = car.type;
        row.insertCell(3).innerText = car.owner;
        row.insertCell(4).innerText = car.dailyPayment;
        row.insertCell(5).innerText = car.startDate;
        row.insertCell(6).innerText = car.endDate;
        row.insertCell(7).innerText = car.ownerPercentage;
        row.insertCell(8).innerText = car.officePercentage;
        row.insertCell(9).innerText = totalIncome;
        row.insertCell(10).innerText = totalCarExpenses;
        row.insertCell(11).innerText = netOwner;
        row.insertCell(12).innerText = netOffice;
    }

    // حساب مصروفات المكتب العام
    let officeExpensesSnap = await db.collection("officeExpenses").get();
    let totalOfficeExpenses = 0;
    officeExpensesSnap.forEach(exp => totalOfficeExpenses += exp.data().amount);

    document.getElementById("totalOfficeIncome").innerText = totalOfficeIncome;
    document.getElementById("totalOfficeExpenses").innerText = totalOfficeExpenses;
    document.getElementById("netOffice").innerText = totalOfficeIncome - totalOfficeExpenses;
}