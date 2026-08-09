# Online Examination System

A full-stack Online Examination System built with **Spring Boot**, **MySQL**, and **HTML/CSS/JavaScript**.

## Features
- User registration/login with two roles: **ADMIN** and **STUDENT**
- Admin: create exams, add/delete multiple-choice questions
- Student: browse exams, take exam with a live countdown timer, auto-submit when time runs out
- Automatic grading and result storage
- Student can view their past results

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Data JPA
- **Database:** MySQL
- **Frontend:** Plain HTML, CSS, JavaScript (fetch API, no framework)

## Project Structure
```
online-exam-system/
├── pom.xml
├── schema.sql                  # reference schema (auto-created by JPA anyway)
├── src/main/java/com/exam/onlineexamsystem/
│   ├── entity/                 # User, Exam, Question, Result
│   ├── repository/             # Spring Data JPA repositories
│   ├── controller/             # REST controllers
│   └── dto/                    # request DTOs
└── src/main/resources/
    ├── application.properties  # DB config
    └── static/                 # frontend: index.html, student.html, exam.html, admin.html
```

## Setup Instructions

1. **Install prerequisites:** JDK 17+, Maven, MySQL Server.

2. **Create the database (optional — Spring Boot auto-creates it):**
   MySQL will auto-create `online_exam_db` on first run because of
   `createDatabaseIfNotExist=true` in the connection URL. You only need to
   run `schema.sql` manually if you want to inspect/pre-create tables yourself.

3. **Configure your DB credentials** in
   `src/main/resources/application.properties`:
   ```
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

4. **Run the app:**
   ```
   mvn spring-boot:run
   ```
   Or import as a Maven project into Eclipse/IntelliJ and run
   `OnlineExamSystemApplication.java`.

5. **Open the app:**
   Go to `http://localhost:8080` in your browser.

## How to Use
1. Register an account — choose role **Admin** to create/manage exams, or
   **Student** to take them.
2. As Admin: create an exam (title, description, duration), then add
   multiple-choice questions to it.
3. As Student: log in, pick an exam from the list, answer questions before
   the timer runs out (or it auto-submits), and view your score immediately.

## Notes / Possible Improvements
- Passwords are stored in plain text for simplicity — for a production-grade
  version, add Spring Security with BCrypt password hashing and JWT-based auth.
- Currently any logged-in student can access any exam — you could add an
  "assigned exams" table to restrict access.
- Could add pagination for large question banks and exam history.
