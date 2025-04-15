const API = "http://localhost:3000";
let editingIndex = null;

document.getElementById("studentForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        group: document.getElementById("groups").value,
        sex: document.querySelector('input[name="sex"]:checked')?.value || "Не вказано"
    };
    

    if (editingIndex == null)
    {
        await fetch(`${API}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
        });
    }
    else
    {
        await fetch(`${API}/students/${editingIndex}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
        editingIndex = null;
    }

    displayStudents();
});

async function displayStudents() {
    const res = await fetch(`${API}/students`);
    const students = await res.json();

    const studentList = document.getElementById("studentList");
    studentList.innerHTML = "";

    students.forEach((student) => {
        const li = document.createElement("li");
        li.innerHTML = `${student.firstname} ${student.lastname} - ${student.phone} - ${student.email} - ${student.group} - ${student.sex} 
            <button onclick="updateStudent(${student.id})">Редагувати</button>
            <button onclick="deleteStudent(${student.id})">Видалити</button>`;
        studentList.appendChild(li);
    });
}

async function updateStudent(id) {
    const res = await fetch(`${API}/students`);
    const students = await res.json();

    const student = students.find(s => s.id === id);
    if (!student) return;

    document.getElementById("firstname").value = student.firstname;
    document.getElementById("lastname").value = student.lastname;
    document.getElementById("phone").value = student.phone;
    document.getElementById("email").value = student.email;
    document.getElementById("groups").value = student.group;
    document.querySelector(`input[name="sex"][value="${student.sex}"]`)?.click();

    editingIndex = id;
}

async function deleteStudent(id) {
    await fetch(`${API}/students/${id}`, { method: "DELETE" });
    displayStudents();
}

function saveToFile(format) {
    const link = document.createElement("a");
    link.href = `${API}/download/${format}`;
    link.download = `students.${format}`;
    link.click();
}

displayStudents();