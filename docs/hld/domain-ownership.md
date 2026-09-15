DOMAIN               OWNER                    DATA

Tenant               Core/Tenant Module       tenant_db
Identity             Core/Identity Module     user_db
Student              Core/Student Module      student_db
Course               Core/Course Module       course_db
Trainer              Core/Trainer Module      trainer_db
Batch                Core/Batch Module        batch_db

Enrollment            Core initially           enrollment_db later
Attendance            Core initially           attendance ownership later
Fee                   Core initially           fee ownership later

Audit                 Audit Service            audit_db later
Notification          Notification Service     notification data
AI / Analytics        Python Service           own analytical storage later