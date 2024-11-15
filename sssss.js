// AuthenticatorAssertionResponse



let isLoggedIn = false;
let currentUser = null;

// Tizimga kirish
function login() {
    const inputUsername = document.getElementById('username').value;
    const inputPassword = document.getElementById('password').value;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const user = data.users.find(user => user.username === inputUsername && user.password === inputPassword);
            if (user) {
                isLoggedIn = true;
                currentUser = user;
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('app').style.display = 'block';
            } else {
                alert("Noto'g'ri login yoki parol!");
            }
        })
        .catch(error => console.error("Ma'lumotlarni yuklashda xatolik:", error));
}

// Profil sahifasiga o'tish
function viewProfile() {
    const totalCredits = currentUser.credits.reduce((sum, credit) => sum + credit.amount, 0); // Jami kredit miqdori

    document.getElementById('content').innerHTML = `
        <h3>Profil</h3>
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
            <p><strong>ID:</strong> ${currentUser.id}</p>
            <p><strong>Ism:</strong> ${currentUser.username}</p>
            <p><strong>Parol:</strong> ${currentUser.password}</p>
            <p><strong>Jami kredit miqdori:</strong> ${totalCredits}</p>
        </div>
    `;
}

// Ro'yhatdan o'tish sahifasiga yo'naltirish
function register() {
    window.location.href = "https://sizningvebsahifangiz.com/register"; // O'zingizning ro'yhatdan o'tish sahifasiga yo'naltiring
}

// Kredit olish sahifasiga o'tish
function applyCredit() {
    window.location.href = "apply_credit.html";
}

// Kreditlar ro'yxati sahifasi
function viewCredits() {
    document.getElementById('content').innerHTML = `<h3>Kreditlarim</h3>`;

    // Foydalanuvchi kreditlari sonini ko'rsatish
    currentUser.credits.forEach((credit, index) => {
        const creditButton = `
            <button onclick="showCreditDetails(${index})">
                ${index + 1}-Kredit
            </button>
        `;
        document.getElementById('content').innerHTML += creditButton;
    });
}

// Kreditning batafsil ma'lumotlarini ko'rsatish
function showCreditDetails(creditIndex) {
    const credit = currentUser.credits[creditIndex];
    const totalWithInterest = credit.amount * 1.15; // 15% foiz qo'shamiz
    const weeklyPayment = (totalWithInterest / 8).toFixed(2); // 8 qismga bo'lamiz

    let creditDetails = `
        <h4>${creditIndex + 1}-Kredit Batafsil</h4>
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
            <strong>Jami summa:</strong> ${credit.amount}
        </div>
        <table>
            <tr>
                <th>Hafta</th>
                <th>To'lash miqdori</th>
                <th>Holati</th>
                <th>To'lash</th>
            </tr>
    `;

    // 8 haftalik to'lovlar holati bilan
    for (let i = 0; i < 8; i++) {
        const status = credit.payments[i] ? "To'langan" : "To'lanmagan";
        const statusColor = credit.payments[i] ? "green" : "red"; // true -> qizil, false -> yashil
        let row = `
            <tr>
                <td>${i + 1}</td>
                <td>${weeklyPayment}</td>
                <td style="color: ${statusColor}; font-weight: bold;">${status}</td>
                <td><button onclick="payRedirect()">To'lash</button></td>
            </tr>
        `;
        creditDetails += row;
    }

    creditDetails += "</table>";
    document.getElementById('content').innerHTML = creditDetails;
}





// Top 5 reytingni ko'rsatish
function viewTopRatings() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Foydalanuvchilarni jami kredit miqdori bo'yicha tartiblang
            const sortedUsers = data.users.sort((a, b) => {
                const totalCreditsA = a.credits.reduce((sum, credit) => sum + credit.amount, 0);
                const totalCreditsB = b.credits.reduce((sum, credit) => sum + credit.amount, 0);
                return totalCreditsB - totalCreditsA; // Yuqori kredit miqdori birinchi o'rinda
            }).slice(0, 5); // Faqat eng yuqori 5 foydalanuvchi

            let topRatingsHtml = `<h3>Top 5 Reyting</h3>`;

            // Foydalanuvchilarni box ichida ko'rsatish
            sortedUsers.forEach((user, index) => {
                const totalCredits = user.credits.reduce((sum, credit) => sum + credit.amount, 0);
                topRatingsHtml += `
                    <div style="border: 2px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 10px; background-color: #f9f9f9;">
                        <span style="font-size: 15px; font-weight: bold; color: #333; margin-right: 500px;">#${index + 1}</span>
                        <h4 style="display: inline;">ID: ${user.id} - ${user.username}</h4>
                        <p><strong>Jami kredit miqdori:</strong> ${totalCredits}</p>
                    </div>
                `;
            });

            // Reytingni ko'rsatish
            document.getElementById('content').innerHTML = topRatingsHtml;
        })
        .catch(error => console.log("Top reytingni yuklashda xatolik:", error));
}



// To'lov sahifasiga yo'naltirish
function payRedirect() {
    window.location.href = "https://sizningvebsahifangiz.com/pay"; // O'zingizning to'lov sahifasiga yo'naltiring
}

// Donat sahifasiga yo'naltirish
function donate() {
    window.location.href = "https://sizningvebsahifangiz.com/donate"; // O'zingizning donat sahifasiga yo'naltiring
}