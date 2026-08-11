/* =========================================================
   STUDENT PERFORMANCE ANALYTICS SYSTEM
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const form =
    document.getElementById("studentForm");

const table =
    document.querySelector("#studentTable tbody");

const search =
    document.getElementById("search");

const studentSelect =
    document.getElementById("studentSelect");

const reportStudentSelect =
    document.getElementById("reportStudentSelect");


/* =========================================================
   LOAD STUDENTS
========================================================= */

let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


/* =========================================================
   CHART VARIABLES
========================================================= */

let gradeChart = null;
let subjectChart = null;
let attendanceChart = null;
let studentChart = null;


/* =========================================================
   INITIAL LOAD
========================================================= */

refreshAll();


/* =========================================================
   REFRESH ALL
========================================================= */

function refreshAll() {

    displayStudents(students);

    updateDashboard();

    updateStudentSelect();

    updateReportSelect();

    updateAnalytics();

    updateAttendance();

    updatePerformers();

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


/* =========================================================
   ADD STUDENT
========================================================= */

form.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const id =
            document
                .getElementById("id")
                .value
                .trim();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const dept =
            document
                .getElementById("dept")
                .value
                .trim();


        const attendance =
            Number(
                document
                    .getElementById("attendance")
                    .value
            );


        const math =
            Number(
                document
                    .getElementById("math")
                    .value
            );


        const python =
            Number(
                document
                    .getElementById("python")
                    .value
            );


        const java =
            Number(
                document
                    .getElementById("java")
                    .value
            );


        /* VALIDATION */

        if (
            attendance < 0 ||
            attendance > 100 ||
            math < 0 ||
            math > 100 ||
            python < 0 ||
            python > 100 ||
            java < 0 ||
            java > 100
        ) {

            alert(
                "Marks and attendance must be between 0 and 100."
            );

            return;
        }


        /* DUPLICATE ID */

        const exists =
            students.some(
                student =>
                    student.id.toLowerCase() ===
                    id.toLowerCase()
            );


        if (exists) {

            alert(
                "Student ID already exists."
            );

            return;
        }


        /* AVERAGE */

        const average =
            Number(
                (
                    (math + python + java) / 3
                ).toFixed(2)
            );


        /* GRADE */

        let grade;


        if (average >= 90) {

            grade = "A";

        } else if (average >= 75) {

            grade = "B";

        } else if (average >= 60) {

            grade = "C";

        } else {

            grade = "Fail";

        }


        /* STUDENT OBJECT */

        const student = {

            id: id,

            name: name,

            dept: dept,

            attendance: attendance,

            math: math,

            python: python,

            java: java,

            average: average,

            grade: grade

        };


        students.push(student);


        saveStudents();


        refreshAll();


        form.reset();


        alert(
            "Student added successfully!"
        );

    }
);


/* =========================================================
   DISPLAY STUDENTS
========================================================= */

function displayStudents(
    list = students
) {

    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="10">
                    No students found
                </td>

            </tr>

        `;

        return;
    }


    list.forEach(
        function (student) {

            const index =
                students.indexOf(student);


            table.innerHTML += `

                <tr>

                    <td>
                        ${student.id}
                    </td>

                    <td>
                        ${student.name}
                    </td>

                    <td>
                        ${student.dept}
                    </td>

                    <td>
                        ${student.attendance}%
                    </td>

                    <td>
                        ${student.math}
                    </td>

                    <td>
                        ${student.python}
                    </td>

                    <td>
                        ${student.java}
                    </td>

                    <td>
                        ${student.average}
                    </td>

                    <td>
                        ${student.grade}
                    </td>

                    <td>

                        <button
                            onclick="viewStudent('${student.id}')">
                            View
                        </button>

                        <button
                            onclick="editStudent(${index})">
                            Edit
                        </button>

                        <button
                            onclick="deleteStudent(${index})">
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

search.addEventListener(
    "keyup",
    function () {

        const value =
            this.value
                .trim()
                .toLowerCase();


        const filtered =
            students.filter(
                student =>

                    student.id
                        .toLowerCase()
                        .includes(value)

                    ||

                    student.name
                        .toLowerCase()
                        .includes(value)

            );


        displayStudents(filtered);

    }
);


/* =========================================================
   DELETE
========================================================= */

function deleteStudent(index) {

    const student =
        students[index];


    if (
        !confirm(
            `Delete ${student.name}?`
        )
    ) {

        return;
    }


    students.splice(index, 1);


    saveStudents();


    refreshAll();

}


/* =========================================================
   EDIT
========================================================= */

function editStudent(index) {

    const student =
        students[index];


    document.getElementById("id").value =
        student.id;

    document.getElementById("name").value =
        student.name;

    document.getElementById("dept").value =
        student.dept;

    document.getElementById("attendance").value =
        student.attendance;

    document.getElementById("math").value =
        student.math;

    document.getElementById("python").value =
        student.python;

    document.getElementById("java").value =
        student.java;


    students.splice(index, 1);


    saveStudents();


    refreshAll();


    document
        .getElementById("students")
        .scrollIntoView({
            behavior: "smooth"
        });


    alert(
        "Student details loaded. Make your changes and click Add Student."
    );

}


/* =========================================================
   VIEW STUDENT
========================================================= */

function viewStudent(id) {

    studentSelect.value = id;

    showStudentProfile(id);


    document
        .getElementById("analytics")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        students.length;


    document.getElementById(
        "totalStudents"
    ).textContent =
        total;


    if (total === 0) {

        document.getElementById(
            "classAverage"
        ).textContent = "0";

        document.getElementById(
            "highestScore"
        ).textContent = "0";

        document.getElementById(
            "aGrades"
        ).textContent = "0";

        document.getElementById(
            "lowAttendance"
        ).textContent = "0";

        document.getElementById(
            "averagePercentage"
        ).textContent = "0%";

        document.getElementById(
            "attendancePercentage"
        ).textContent = "0%";

        document.getElementById(
            "averageProgress"
        ).style.width = "0%";

        document.getElementById(
            "attendanceProgress"
        ).style.width = "0%";

        return;
    }


    const classAverage =
        students.reduce(
            (sum, student) =>
                sum + Number(student.average),
            0
        ) / total;


    document.getElementById(
        "classAverage"
    ).textContent =
        classAverage.toFixed(2);


    document.getElementById(
        "averagePercentage"
    ).textContent =
        classAverage.toFixed(2) + "%";


    document.getElementById(
        "averageProgress"
    ).style.width =
        Math.min(
            classAverage,
            100
        ) + "%";


    const highest =
        Math.max(
            ...students.map(
                student =>
                    Number(student.average)
            )
        );


    document.getElementById(
        "highestScore"
    ).textContent =
        highest.toFixed(2);


    const aGrades =
        students.filter(
            student =>
                student.grade === "A"
        ).length;


    document.getElementById(
        "aGrades"
    ).textContent =
        aGrades;


    const lowAttendance =
        students.filter(
            student =>
                Number(student.attendance) < 75
        ).length;


    document.getElementById(
        "lowAttendance"
    ).textContent =
        lowAttendance;


    const attendance =
        students.reduce(
            (sum, student) =>
                sum +
                Number(student.attendance),
            0
        ) / total;


    document.getElementById(
        "attendancePercentage"
    ).textContent =
        attendance.toFixed(2) + "%";


    document.getElementById(
        "attendanceProgress"
    ).style.width =
        Math.min(
            attendance,
            100
        ) + "%";

}


/* =========================================================
   STUDENT DROPDOWN
========================================================= */

function updateStudentSelect() {

    studentSelect.innerHTML = `

        <option value="">
            Select Student
        </option>

    `;


    students.forEach(
        student => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =
                `${student.id} - ${student.name}`;


            studentSelect.appendChild(
                option
            );

        }
    );

}


studentSelect.addEventListener(
    "change",
    function () {

        showStudentProfile(
            this.value
        );

    }
);


/* =========================================================
   STUDENT PROFILE
========================================================= */

function showStudentProfile(id) {

    const profile =
        document.getElementById(
            "studentProfile"
        );


    if (!id) {

        profile.classList.add(
            "hidden"
        );

        return;
    }


    const student =
        students.find(
            s => s.id === id
        );


    if (!student) {

        profile.classList.add(
            "hidden"
        );

        return;
    }


    profile.classList.remove(
        "hidden"
    );


    document.getElementById(
        "profileName"
    ).textContent =
        student.name;


    document.getElementById(
        "profileId"
    ).textContent =
        "ID: " + student.id;


    document.getElementById(
        "profileDept"
    ).textContent =
        student.dept;


    document.getElementById(
        "profileAttendance"
    ).textContent =
        student.attendance + "%";


    document.getElementById(
        "profileAverage"
    ).textContent =
        student.average;


    document.getElementById(
        "profileGrade"
    ).textContent =
        student.grade;


    document.getElementById(
        "profileMath"
    ).textContent =
        student.math;


    document.getElementById(
        "profilePython"
    ).textContent =
        student.python;


    document.getElementById(
        "profileJava"
    ).textContent =
        student.java;


    let status;


    if (student.average >= 75) {

        status = "Good";

    } else if (student.average >= 60) {

        status = "Average";

    } else {

        status = "Needs Improvement";

    }


    document.getElementById(
        "profileStatus"
    ).textContent =
        status;


    createStudentChart(student);

}


/* =========================================================
   ANALYTICS
========================================================= */

function updateAnalytics() {

    createGradeChart();

    createSubjectChart();

}


/* =========================================================
   GRADE CHART
========================================================= */

function createGradeChart() {

    const counts = {

        A: 0,
        B: 0,
        C: 0,
        Fail: 0

    };


    students.forEach(
        student => {

            if (
                counts.hasOwnProperty(
                    student.grade
                )
            ) {

                counts[student.grade]++;

            }

        }
    );


    const ctx =
        document
            .getElementById(
                "gradeChart"
            )
            .getContext("2d");


    if (gradeChart) {

        gradeChart.destroy();

    }


    gradeChart =
        new Chart(
            ctx,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "A",
                        "B",
                        "C",
                        "Fail"
                    ],

                    datasets: [{

                        data: [
                            counts.A,
                            counts.B,
                            counts.C,
                            counts.Fail
                        ]

                    }]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }
        );

}


/* =========================================================
   SUBJECT CHART
========================================================= */

function createSubjectChart() {

    if (students.length === 0) {

        if (subjectChart) {

            subjectChart.destroy();

            subjectChart = null;

        }

        return;
    }


    const math =
        students.reduce(
            (sum, student) =>
                sum + Number(student.math),
            0
        ) / students.length;


    const python =
        students.reduce(
            (sum, student) =>
                sum + Number(student.python),
            0
        ) / students.length;


    const java =
        students.reduce(
            (sum, student) =>
                sum + Number(student.java),
            0
        ) / students.length;


    const ctx =
        document
            .getElementById(
                "subjectChart"
            )
            .getContext("2d");


    if (subjectChart) {

        subjectChart.destroy();

    }


    subjectChart =
        new Chart(
            ctx,
            {

                type: "bar",

                data: {

                    labels: [
                        "Math",
                        "Python",
                        "Java"
                    ],

                    datasets: [{

                        label:
                            "Class Average",

                        data: [

                            math,

                            python,

                            java

                        ]

                    }]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100

                        }

                    }

                }

            }
        );

}


/* =========================================================
   STUDENT CHART
========================================================= */

function createStudentChart(student) {

    const ctx =
        document
            .getElementById(
                "studentChart"
            )
            .getContext("2d");


    if (studentChart) {

        studentChart.destroy();

    }


    studentChart =
        new Chart(
            ctx,
            {

                type: "bar",

                data: {

                    labels: [
                        "Math",
                        "Python",
                        "Java"
                    ],

                    datasets: [{

                        label:
                            student.name,

                        data: [

                            student.math,

                            student.python,

                            student.java

                        ]

                    }]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100

                        }

                    }

                }

            }
        );

}


/* =========================================================
   ATTENDANCE
========================================================= */

function updateAttendance() {

    const tbody =
        document.querySelector(
            "#attendanceTable tbody"
        );


    tbody.innerHTML = "";


    if (students.length === 0) {

        document.getElementById(
            "attendanceAverage"
        ).textContent =
            "0%";


        document.getElementById(
            "goodAttendance"
        ).textContent =
            "0";


        document.getElementById(
            "attendanceWarning"
        ).textContent =
            "0";


        createAttendanceChart();

        return;
    }


    const average =
        students.reduce(
            (sum, student) =>
                sum +
                Number(student.attendance),
            0
        ) / students.length;


    document.getElementById(
        "attendanceAverage"
    ).textContent =
        average.toFixed(2) + "%";


    const good =
        students.filter(
            student =>
                Number(student.attendance) >= 75
        ).length;


    const low =
        students.filter(
            student =>
                Number(student.attendance) < 75
        ).length;


    document.getElementById(
        "goodAttendance"
    ).textContent =
        good;


    document.getElementById(
        "attendanceWarning"
    ).textContent =
        low;


    students
        .filter(
            student =>
                Number(student.attendance) < 75
        )
        .forEach(
            student => {

                tbody.innerHTML += `

                    <tr>

                        <td>${student.id}</td>

                        <td>${student.name}</td>

                        <td>${student.dept}</td>

                        <td>${student.attendance}%</td>

                        <td>${student.average}</td>

                        <td>${student.grade}</td>

                        <td>
                            Low Attendance
                        </td>

                    </tr>

                `;

            }
        );


    createAttendanceChart();

}


/* =========================================================
   ATTENDANCE CHART
========================================================= */

function createAttendanceChart() {

    const good =
        students.filter(
            student =>
                Number(student.attendance) >= 75
        ).length;


    const low =
        students.filter(
            student =>
                Number(student.attendance) < 75
        ).length;


    const ctx =
        document
            .getElementById(
                "attendanceChart"
            )
            .getContext("2d");


    if (attendanceChart) {

        attendanceChart.destroy();

    }


    attendanceChart =
        new Chart(
            ctx,
            {

                type: "pie",

                data: {

                    labels: [
                        "Good Attendance",
                        "Low Attendance"
                    ],

                    datasets: [{

                        data: [
                            good,
                            low
                        ]

                    }]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }
        );

}


/* =========================================================
   PERFORMERS
========================================================= */

function updatePerformers() {

    const top =
        document.getElementById(
            "topPerformers"
        );

    const weak =
        document.getElementById(
            "weakStudents"
        );

    const subjects =
        document.getElementById(
            "subjectAnalysis"
        );


    top.innerHTML = "";

    weak.innerHTML = "";

    subjects.innerHTML = "";


    if (students.length === 0) {

        top.innerHTML =
            "<p>No student data available.</p>";

        weak.innerHTML =
            "<p>No student data available.</p>";

        subjects.innerHTML =
            "<p>No student data available.</p>";

        return;
    }


    const sorted =
        [...students].sort(
            (a, b) =>
                Number(b.average) -
                Number(a.average)
        );


    sorted
        .slice(0, 3)
        .forEach(
            (student, index) => {

                top.innerHTML += `

                    <div class="performer-item">

                        <div>

                            <strong>
                                #${index + 1}
                                ${student.name}
                            </strong>

                            <br>

                            <small>
                                ${student.id}
                            </small>

                        </div>

                        <div class="performer-score">
                            ${student.average}
                        </div>

                    </div>

                `;

            }
        );


    sorted
        .slice()
        .reverse()
        .slice(0, 5)
        .forEach(
            student => {

                weak.innerHTML += `

                    <div class="weak-item">

                        <div>

                            <strong>
                                ${student.name}
                            </strong>

                            <br>

                            <small>
                                ${student.id}
                            </small>

                        </div>

                        <strong>
                            ${student.average}
                        </strong>

                    </div>

                `;

            }
        );


    const subjectList = [

        {
            name: "Math",
            key: "math"
        },

        {
            name: "Python",
            key: "python"
        },

        {
            name: "Java",
            key: "java"
        }

    ];


    subjectList.forEach(
        subject => {

            const average =
                students.reduce(
                    (sum, student) =>
                        sum +
                        Number(
                            student[
                                subject.key
                            ]
                        ),
                    0
                ) / students.length;


            let status;


            if (average >= 75) {

                status =
                    "Strong Performance";

            } else if (average >= 60) {

                status =
                    "Average Performance";

            } else {

                status =
                    "Needs Improvement";

            }


            subjects.innerHTML += `

                <div class="subject-item">

                    <h3>
                        ${subject.name}
                    </h3>

                    <p>
                        Average Score:
                        <strong>
                            ${average.toFixed(2)}
                        </strong>
                    </p>

                    <p>
                        Status:
                        <strong>
                            ${status}
                        </strong>
                    </p>

                </div>

            `;

        }
    );

}


/* =========================================================
   REPORT DROPDOWN
========================================================= */

function updateReportSelect() {

    reportStudentSelect.innerHTML = `

        <option value="">
            Select Student
        </option>

    `;


    students.forEach(
        student => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =
                `${student.id} - ${student.name}`;


            reportStudentSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   EXCEL EXPORT
========================================================= */

document
    .getElementById("exportBtn")
    .addEventListener(
        "click",
        function () {

            if (students.length === 0) {

                alert(
                    "No student data available."
                );

                return;
            }


            const excelData =
                students.map(
                    student => ({

                        "Student ID":
                            student.id,

                        "Student Name":
                            student.name,

                        "Department":
                            student.dept,

                        "Attendance (%)":
                            student.attendance,

                        "Math":
                            student.math,

                        "Python":
                            student.python,

                        "Java":
                            student.java,

                        "Average":
                            student.average,

                        "Grade":
                            student.grade

                    })
                );


            const worksheet =
                XLSX.utils.json_to_sheet(
                    excelData
                );


            worksheet["!cols"] = [

                { wch: 15 },
                { wch: 25 },
                { wch: 18 },
                { wch: 18 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 }

            ];


            const workbook =
                XLSX.utils.book_new();


            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Students"
            );


            XLSX.writeFile(
                workbook,
                "Student_Performance_Analytics.xlsx"
            );


            alert(
                "Excel file downloaded successfully!"
            );

        }
    );


/* =========================================================
   PROFESSIONAL PDF REPORT
========================================================= */

document
    .getElementById("reportBtn")
    .addEventListener(
        "click",
        function () {

            const id =
                reportStudentSelect.value;


            if (!id) {

                alert(
                    "Please select a student."
                );

                return;
            }


            const student =
                students.find(
                    s => s.id === id
                );


            if (!student) {

                alert(
                    "Student not found."
                );

                return;
            }


            /* GET jsPDF */

            const {
                jsPDF
            } = window.jspdf;


            const doc =
                new jsPDF();


            const pageWidth =
                doc.internal.pageSize.getWidth();


            /* =====================================
               HEADER
            ===================================== */

            doc.setFontSize(22);

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "STUDENT PERFORMANCE REPORT",
                pageWidth / 2,
                25,
                {
                    align: "center"
                }
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                "Student Performance Analytics System",
                pageWidth / 2,
                33,
                {
                    align: "center"
                }
            );


            doc.line(
                20,
                40,
                pageWidth - 20,
                40
            );


            /* =====================================
               STUDENT INFORMATION
            ===================================== */

            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "Student Information",
                20,
                55
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Student ID : ${student.id}`,
                20,
                66
            );


            doc.text(
                `Name : ${student.name}`,
                20,
                75
            );


            doc.text(
                `Department : ${student.dept}`,
                20,
                84
            );


            doc.text(
                `Attendance : ${student.attendance}%`,
                20,
                93
            );


            /* =====================================
               ACADEMIC PERFORMANCE
            ===================================== */

            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "Academic Performance",
                20,
                112
            );


            /* TABLE HEADER */

            doc.setFillColor(
                230,
                230,
                230
            );


            doc.rect(
                20,
                120,
                170,
                10,
                "F"
            );


            doc.setFontSize(10);

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "Subject",
                30,
                127
            );


            doc.text(
                "Marks",
                150,
                127
            );


            /* MATH */

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.rect(
                20,
                130,
                170,
                12
            );


            doc.text(
                "Mathematics",
                30,
                138
            );


            doc.text(
                String(student.math),
                150,
                138
            );


            /* PYTHON */

            doc.rect(
                20,
                142,
                170,
                12
            );


            doc.text(
                "Python",
                30,
                150
            );


            doc.text(
                String(student.python),
                150,
                150
            );


            /* JAVA */

            doc.rect(
                20,
                154,
                170,
                12
            );


            doc.text(
                "Java",
                30,
                162
            );


            doc.text(
                String(student.java),
                150,
                162
            );


            /* =====================================
               PERFORMANCE SUMMARY
            ===================================== */

            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "Performance Summary",
                20,
                185
            );


            doc.setFontSize(12);

            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                `Average Score : ${student.average}`,
                25,
                198
            );


            doc.text(
                `Grade : ${student.grade}`,
                25,
                208
            );


            /* =====================================
               STATUS
            ===================================== */

            let status;


            if (
                Number(student.average) >= 75
            ) {

                status =
                    "Good Performance";

            } else if (
                Number(student.average) >= 60
            ) {

                status =
                    "Average Performance";

            } else {

                status =
                    "Needs Improvement";

            }


            doc.text(
                `Status : ${status}`,
                25,
                218
            );


            /* =====================================
               ATTENDANCE STATUS
            ===================================== */

            let attendanceStatus;


            if (
                Number(student.attendance) >= 75
            ) {

                attendanceStatus =
                    "Satisfactory";

            } else {

                attendanceStatus =
                    "Low Attendance - Attention Required";

            }


            doc.text(
                `Attendance Status : ${attendanceStatus}`,
                25,
                228
            );


            /* =====================================
               RECOMMENDATION
            ===================================== */

            doc.setFontSize(15);

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "Recommendation",
                20,
                250
            );


            doc.setFontSize(11);

            doc.setFont(
                "helvetica",
                "normal"
            );


            let recommendation;


            if (
                Number(student.average) >= 75 &&
                Number(student.attendance) >= 75
            ) {

                recommendation =
                    "Student is performing well. Continue the current study strategy.";

            } else if (
                Number(student.average) < 60
            ) {

                recommendation =
                    "Student should focus on improving subject fundamentals and practice regularly.";

            } else if (
                Number(student.attendance) < 75
            ) {

                recommendation =
                    "Student should improve attendance to support better academic performance.";

            } else {

                recommendation =
                    "Student should continue practicing to improve overall performance.";

            }


            const lines =
                doc.splitTextToSize(
                    recommendation,
                    165
                );


            doc.text(
                lines,
                25,
                262
            );


            /* =====================================
               FOOTER
            ===================================== */

            doc.line(
                20,
                280,
                pageWidth - 20,
                280
            );


            doc.setFontSize(9);


            doc.text(
                "Generated by Student Performance Analytics System",
                pageWidth / 2,
                288,
                {
                    align: "center"
                }
            );


            /* =====================================
               DOWNLOAD
            ===================================== */

            doc.save(
                `${student.id}_Performance_Report.pdf`
            );


            alert(
                "PDF report generated successfully!"
            );

        }
    );