## Use cases

## Student Sequence Diagrams

### Student Registration
```mermaid
sequenceDiagram
    participant User
    participant ClientApp
    participant AuthService
    participant Database

    User->>ClientApp: Fill Registration Form
    ClientApp->>AuthService: Submit Registration Data
    AuthService->>Database: Check if User Exists
    alt User Exists
        AuthService->>ClientApp: HTTP 400 Bad Request (User Already Registered)
    else New User
        AuthService->>Database: Save New User Data
        Database-->>AuthService: User Saved
        AuthService->>ClientApp: HTTP 201 Created (Registration Successful)
    end
    ClientApp->>User: Display Registration Status
```

### Student Login
```mermaid
sequenceDiagram
    participant User
    participant ClientApp
    participant AuthService
    participant Database

    User->>ClientApp: Enter Username & Password
    ClientApp->>AuthService: Submit Login Credentials
    AuthService->>Database: Retrieve User Data
    alt Valid Credentials
        AuthService->>AuthService: Generate JWT
        AuthService->>ClientApp: Login Successful (JWT)
    else Invalid Credentials
        AuthService->>ClientApp: Login Failed
    end
    ClientApp->>User: Display Login Status
```

### Student Search Tutor
```mermaid
sequenceDiagram
    participant Student
    participant ClientApp
    participant System
    participant Database

    Student->>ClientApp: Uses filters and clicks "Search" button
    ClientApp->>System: Submit search request
    System->>Database: Perform search query
    alt Tutors Found
        System->>ClientApp: Display list of tutors
    else Data Search Error
        System->>ClientApp: USER.DATA_SEARCH_ERROR
    end
    ClientApp->>Student: Display search results or error message
```

### Tutor Registration
```mermaid
sequenceDiagram
    participant Tutor
    participant ClientApp
    participant System
    participant Admin

    Tutor->>ClientApp: Goes to registration page and selects "Tutor" user type
    Tutor->>ClientApp: Enters registration data (name, email, password, phone)
    Tutor->>ClientApp: Enters education details (Institution name, specialty)
    Tutor->>ClientApp: Uploads profile photo and certified document
    Tutor->>ClientApp: Lists teaching subjects and levels
    Tutor->>ClientApp: Specifies class location (online or offline) and place
    Tutor->>ClientApp: Specifies cost per subject

    ClientApp->>System: Submit registration data
    System->>System: Validate data for correctness
    alt Data Validation Error
        System->>ClientApp: USER.REGISTRATION_ERROR
    else Data Valid
        System->>Admin: Submit account for admin approval
    end

    Admin->>Admin: Review and verify certified document
    alt Document Rejected
        Admin->>ClientApp: USER.DOCUMENT_REJECTED_ERROR
    else Document Approved
        Admin->>System: Approve tutor's account
        System->>ClientApp: Confirm registration success
    end
    ClientApp->>Tutor: Display registration confirmation
```


### Tutor Login
```mermaid
sequenceDiagram
    participant Tutor
    participant ClientApp
    participant AuthService
    participant Database

    Tutor->>ClientApp: Enter Username & Password
    ClientApp->>AuthService: Submit Login Credentials
    AuthService->>Database: Retrieve Tutor Data
    alt Valid Credentials
        AuthService->>AuthService: Generate JWT
        AuthService->>ClientApp: Login Successful (JWT)
    else Invalid Credentials
        AuthService->>ClientApp: Login Failed
    end
    ClientApp->>Tutor: Display Login Status
```

### Admin Approve or Disapprove Tutor
```mermaid
sequenceDiagram
    participant Admin
    participant ClientApp
    participant System
    participant Database
    participant EmailService

    Admin->>ClientApp: Access Admin Dashboard
    ClientApp->>System: Load TutorAdminApproval and UserAdmin models
    System->>Database: Retrieve Tutor and User data

    alt Admin Approves Tutor
        Admin->>System: Select tutor(s) and click "Approve User"
        System->>Database: Update tutor's approval status
        System->>EmailService: Trigger send_result_email_to_tutor (is_approved=True)
        EmailService->>Admin: Confirmation email sent to tutor(s)
    end

    alt Admin Disapproves Tutor
        Admin->>System: Select tutor(s) and click "Disapprove User"
        System->>Database: Delete selected tutor(s)
        System->>EmailService: Trigger send_result_email_to_tutor (is_approved=False)
        EmailService->>Admin: Confirmation email sent to tutor(s)
    end

    alt Admin Saves User Model
        Admin->>System: Modify user details and click "Save"
        System->>System: Check for changes in 'is_approved' field
        System->>Database: Update User and Tutor/StudentMore data
    end

    ClientApp->>Admin: Display actions confirmation or error message
```
