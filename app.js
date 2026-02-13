// Firebase setup
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

// --- UI Sections ---
function showCars(){ document.getElementById("carsSection").style.display="block"; document.getElementById("archiveSection").style.display="none"; document.getElementById("expensesSection").style.display="none"; }
function showArchive(){ document.getElementById("carsSection").style.display="none"; document.getElementById("archiveSection").style.display="block"; document.getElementById("expensesSection").style.display="none"; }
function showExpenses(){ document.getElementById("carsSection").style.display="none"; document.getElementById("archiveSection").style.display="none"; document.getElementById("expensesSection").style.display="block"; }

// --- تسجيل الدخول ---
function login(){
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if(user==="admin" && pass==="123456"){ document.getElementById("loginDiv").style.display="none"; document.getElementById("systemDiv").style.display="block"; loadCars();}
    else alert("بيانات الدخول غير صحيحة");
}

// --- كلمة المرور ---
function togglePassword(){ const pw = document.getElementById("password"); const btn=document.getElementById("togglePassword"); if(pw.type==="password"){ pw.type="text"; btn.innerText="اخفاء"; } else{ pw.type="password"; btn.innerText="اظهار";}}

// --- إضافة سيارة ---
function addCar(){ 
    const car={name:document.getElementById("driverName").value, number:document.getElementById("carNumber").value, type:document.getElementById("carType").value, owner:document.getElementById("ownerName").value, dailyPayment:Number(document.getElementById("dailyPayment").value), monthlyDeduction:Number(document.getElementById("monthlyDeduction").value), startDate:document.getElementById("startDate").value, endDate:document.getElementById("endDate").value, expenses:[], dailyPayments:[]};
    db.collection("cars").doc(car.number).set(car).then(()=>{ alert("تم إضافة السيارة"); loadCars();});
}

// --- تسجيل الدفع اليومي ---
function recordDailyPayment(){
    const carNumber = document.getElementById("paymentCarSelect").value;
    const amount = Number(document.getElementById("paidToday").value);
    db.collection("cars").doc(carNumber).get().then(doc=>{
        if(doc.exists){
            let car = doc.data();
            car.dailyPayments.push({date:new Date().toLocaleDateString(), amount:amount});
            db.collection("cars").doc(carNumber).set(car).then(()=>{ alert("تم تسجيل الدفع اليومي"); loadCars(); });
        }
    });
}

// --- إضافة مصروف سيارة ---
function addCarExpense(){
    const carNumber = document.getElementById("expenseCarSelect").value;
    const desc = document.getElementById("expenseDescription").value;
    const amount = Number(document.getElementById("expenseAmount").value);
    db.collection("cars").doc(carNumber).get().then(doc=>{
        if(doc.exists){
            let car = doc.data();
            car.expenses.push({desc:desc, amount:amount});
            db.collection("cars").doc(carNumber).set(car).then(()=>{ alert("تم إضافة المصروف"); loadCars(); });
        }
    });
}

// --- إضافة مصروف المكتب ---
let officeExpenses=[];
function addOfficeExpense(){
    const desc = document.getElementById("officeExpenseDescription").value;
    const amount = Number(document.getElementById("officeExpenseAmount").value);
    officeExpenses.push({desc:desc, amount:amount});
    updateOfficeSummary();
}

// --- تحديث ملخص المكتب ---
function updateOfficeSummary(){
    let totalIncome = 0;
    db.collection("cars").get().then(snapshot=>{
        snapshot.forEach(doc=>{ let car = doc.data(); totalIncome+=car.dailyPayment*30; }); // تقريباً دخل شهري
        let totalExpenses = officeExpenses.reduce((a,b)=>a+b.amount,0);
        document.getElementById("totalOfficeIncome").innerText=totalIncome;
        document.getElementById("totalOfficeExpenses").innerText=totalExpenses;
        document.getElementById("netOffice").innerText=totalIncome-totalExpenses;
        document.getElementById("officeExpenseDetails").innerText=officeExpenses.map(e=>e.desc+":"+e.amount).join(", ");
    });
}

// --- تحميل السيارات ---
function loadCars(){
    const carsTable = document.getElementById("carsTable");
    const carSelect = document.getElementById("paymentCarSelect");
    const expenseSelect = document.getElementById("expenseCarSelect");
    carsTable.innerHTML='<tr><th>اسم السائق</th><th>الرقم</th><th>النوع</th><th>المالك</th><th>اليومي</th><th>بداية العقد</th><th>نهاية العقد</th><th>الاستقطاع الشهري</th><th>إجمالي الدخل الشهري</th><th>مصروف المركبة</th><th>المتبقي</th><th>صافي المالك</th><th>صافي المكتب</th><th>تفاصيل المصاريف</th><th>إنذار العقد</th><th>خيارات</th></tr>';
    carSelect.innerHTML='';
    expenseSelect.innerHTML='';
    db.collection("cars").get().then(snapshot=>{
        snapshot.forEach(doc=>{
            let car = doc.data();
            let totalExpense = car.expenses.reduce((a,b)=>a+b.amount,0);
            let totalPaid = car.dailyPayments.reduce((a,b)=>a+b.amount,0);
            let totalIncome = car.dailyPayment*30;
            let netOwner = totalIncome - totalExpense - car.monthlyDeduction;
            let netOffice = totalExpense + car.monthlyDeduction;
            let warn = "";
            let today = new Date();
            let end = new Date(car.endDate);
            if((end-today)/(1000*3600*24)<=10) warn="⚠️"; 
            carsTable.innerHTML+=`<tr class="carmInfo"><td>${car.name}</td><td>${car.number}</td><td>${car.type}</td><td>${car.owner}</td><td>${car.dailyPayment}</td><td>${car.startDate}</td><td>${car.endDate}</td><td>${car.monthlyDeduction}</td><td>${totalIncome}</td><td>${totalExpense}</td><td>${totalIncome-totalPaid}</td><td>${netOwner}</td><td>${netOffice}</td><td>${car.expenses.map(e=>e.desc+":"+e.amount).join(", ")}</td><td>${warn}</td><td><button onclick="deleteCar('${car.number}')">حذف</button></td></tr>`;
            carSelect.innerHTML+=`<option value="${car.number}">${car.name} - ${car.number}</option>`;
            expenseSelect.innerHTML+=`<option value="${car.number}">${car.name} - ${car.number}</option>`;
        });
        updateOfficeSummary();
    });
}

// --- حذف سيارة ---
function deleteCar(num){ if(confirm("هل تريد حذف السيارة؟")){ db.collection("cars").doc(num).delete().then(()=>{ alert("تم الحذف"); loadCars(); }); }}