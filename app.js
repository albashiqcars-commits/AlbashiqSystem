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

    db.collection("cars").add(car).then(()=>{
        alert("تم إضافة السيارة");
        loadCars();
    });
}

function loadCars(){
    const table = document.getElementById("carsTable");
    table.innerHTML = `
<tr>
<th>الاسم</th>
<th>الرقم</th>
<th>النوع</th>
<th>المالك</th>
<th>اليومي</th>
<th>بداية</th>
<th>نهاية</th>
<th>% المالك</th>
<th>% المكتب</th>
</tr>
`;

    db.collection("cars").get().then(snapshot=>{
        snapshot.forEach(doc=>{
            const car = doc.data();
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
        });
    });
}