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

// --- إضافة سيارة + حساب الأيام ---
function addCar(){ 
    const car={name:document.getElementById("driverName").value, number:document.getElementById("carNumber").value, type:document.getElementById("carType").value, owner:document.getElementById("ownerName").value, dailyPayment:Number(document.getElementById("dailyPayment").value), monthlyDeduction:Number(document.getElementById("monthlyDeduction").value), startDate:document.getElementById("startDate").value, endDate:document.getElementById("endDate").value};
    db.collection("cars").doc(car.number).set(car).then(()=>{ alert("تم إضافة السيارة"); loadCars();});
}

// --- باقي وظائف المصروفات اليومية والمكتب والأرشيف كما في النسخة السابقة ---