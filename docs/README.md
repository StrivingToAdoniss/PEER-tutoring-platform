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
        Database-->>AuthService: Return Tutor Data
        alt Tutor Approved
            AuthService->>AuthService: Generate JWT
            AuthService->>ClientApp: Login Successful (JWT)
        else Tutor Not Approved
            AuthService->>ClientApp: 403 Forbidden (Wait for Approval)
        end
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

### View Tutors and Use Filters (Unlogged User)
```mermaid
sequenceDiagram
    participant User
    participant ClientApp
    participant APIService
    participant Database

    User->>ClientApp: Open Tutors Page
    ClientApp->>APIService: Fetch Tutors List
    APIService->>Database: Retrieve Tutors Data
    Database-->>APIService: Return Tutors Data
    APIService-->>ClientApp: Send Tutors List
    ClientApp->>User: Display Tutors List

    User->>ClientApp: Apply Filters (university, subject, location, mode, price)
    ClientApp->>APIService: Fetch Filtered Tutors
    APIService->>Database: Query with Filters
    Database-->>APIService: Return Filtered Tutors
    APIService-->>ClientApp: Send Filtered Tutors List
    ClientApp->>User: Display Filtered Tutors
```