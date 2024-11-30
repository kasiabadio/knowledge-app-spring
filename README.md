## Table of contents

* General info
* Sequence Diagrams
* Technologies
* Sources

## General info

Component requirements (functional and non-functional).

a.	Functional requirements

- 	The system must allow users to log in with an email and password.
-	The system must allow to register with an email, password, name, surname.
-	User can logout.	
    There must be confirmation of  registration sent to an email.	There must be password reset functionality.
-	User can add his/her own knowledge through forms.
-	User can edit and delete his/her knowledge.
-	User can view all his/her knowledge in form of a list.
-	User can view detail page of a knowledge.


b.	Non-functional requirements
-	The application interface should be user-friendly and intuitive.
-	Passwords must be encrypted in the database.

## Sequence Diagrams 
 
* ### Registration & activation account  
<img src="Registration & activation account.png" alt="Registration & activation account" width="1000"/>

* ### Login  
<img src="Login.png" alt="Login" width="1000"/>

* ### Password reset  
<img src="Password-reset diagram .png" alt="Password reset" width="1000"/>


## Technologies

* Java
* Spring Boot
* Angular
* Postgresql

## Sources
* JWT user login and registration: https://www.youtube.com/watch?v=xqhdRrFzLFY,
https://github.com/ali-bouali/book-social-network
* password reset: https://www.baeldung.com/spring-security-registration-i-forgot-my-password