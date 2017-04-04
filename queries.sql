--QUERIES

--Register
--step1. insert a person
INSERT INTO public.person(email, password, secretquestion, secretanswer)
	VALUES ('example@domain.com', 'password', 1, 'answer');
--step2. get the id from the person
SELECT personid
	FROM public.person
    where email='example@domain.com'
--step3. insert a user corresponding to that person
INSERT INTO public.users(
	personid, organization, city)
	VALUES (1, 'DRNA', 'Mayaguez');

--Insert Administrator
--step1. insert a person
INSERT INTO public.person(email, password, secretquestion, secretanswer)
	VALUES ('administrator@domain.com', 'password', 1, 'answer');
--step2. get the id from the person
SELECT personid
	FROM public.person
    where email='administrator@domain.com'	
--step3. insert an administrator corresponding to that person	
INSERT INTO public.administrator(
	personid, securitykey)
	VALUES (2, 0000);	

--Update public user to privileged user

	
--Login	
--Get registered user information by email, check password and check if it is active user
SELECT *
	FROM public.person natural join public.users
    where email='example@domain.com'
    and password='password'
    and activeUser=true
--Get administrator
SELECT *
	FROM public.person natural join public.administrator
    where email='administrator@domain.com'
    and password='password'
	
	
--Verify if user is an administrator by email
SELECT *
	FROM public.person natural join public.administrator
    where email='administrator@domain.com'
----Verify if user is an priviled user by email
SELECT *
	FROM public.person natural join public.users
    where email='example@domain.com'
	and privilege=true
----Verify if user is an public user by email
SELECT *
	FROM public.person natural join public.users
    where email='example@domain.com'
	and privilege=false

--Remove User (set activeUser to false)
UPDATE public.users
	SET activeUser=false
	WHERE personID in(select personID
                      FROM  public.person
                      WHERE email='example@domain.com')

--Add privilege to user (set privilege to true)
UPDATE public.users
	SET privilege=true
	WHERE personID in(select personID
                      FROM  public.person
                      WHERE email='example@domain.com')

--Remove privilege from user (set privilege to true)
UPDATE public.users
	SET privilege=false
	WHERE personID in(select personID
                      FROM  public.person
                      WHERE email='example@domain.com')
	
--Edit settings 
--ALL
--a.Change email
UPDATE public.person
	SET email='newemail@domain.com'
	WHERE personID=1;
--b.Change password
UPDATE public.person
	SET password='password1'
	WHERE personID=1;
--c.Change secretquestion
UPDATE public.person
	SET secretQuestion = '3'
	WHERE personID=1;
--d.Change secretAnswer
UPDATE public.person
	SET secretAnswer = 'newAnswer'
	WHERE personID=1;
--ADMINISTRATOR
--a.securitykey
UPDATE public.administrator
	SET securitykey=1111
	WHERE personID in(select personID
                      FROM  public.person
                      WHERE email='administrator@domain.com')
--USER
--a.organization
UPDATE public.users
	SET organization='DRNA1'
	WHERE personID in(select personID
                      FROM  public.person
                      WHERE email='example@domain.com')
--b.city
UPDATE public.users
	SET city='Arecibo'
	WHERE personID in(select personID
                      FROM  public.person
                      WHERE email='example@domain.com')

--Insert new River
INSERT INTO public.rivers(
	rivername, rivernumber, region, station, description)
	VALUES ('Río Grande de Patillas', 1, 'SUR', 50092000, 'RIO GRANDE DE PATILLAS, PR');
	
--Get riverID by its station number
SELECT riverid
	FROM public.rivers
    WHERE station=50092000

	
--Insert River information
INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, ?, ?);

--Query to calculate sevenDaysAVG
--Same for: threeMonthsAVG, sixMonthsAVG, nineMonthsAVG, oneYearAVG. dateTimeUSGS changes according to what to calculate
select avg(paramStatDesc)
from riversusgs
where dateTimeUSGS between '1985-12-25' and '1985-12-31'

--Query to calculate oneMonthAVG
--Same for: threeMonthsAVG, sixMonthsAVG, nineMonthsAVG, oneYearAVG. dateTimeUSGS changes according to what to calculate
select avg(paramStatDesc)
from riversusgs
where dateTimeUSGS between '1985-12-01' and '1985-12-31'

--
