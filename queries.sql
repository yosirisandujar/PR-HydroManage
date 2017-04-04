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

	
--Login	
--Get registered user information by email, check password and check if it is active user
SELECT *
	FROM public.person natural join public.users
    where email='example@domain.com'
    and password='password'
    and activeUser=true

	
--Verify if user is an administrator/priviled user/public user



--Remove User (set activeUser to false)
UPDATE public.users
	SET activeUser=false
	WHERE personID in(select personID
                      FROM  public.person
                      WHERE email='example@domain.com')


	
--Insert new River
INSERT INTO public.rivers(
	rivername, rivernumber, region, station, description)
	VALUES ('Río Grande de Patillas', 'SUR', 50092000, 'RIO GRANDE DE PATILLAS, PR');
	
--Insert River information
insert into riversusgs(riverID,agencyCd, dateTimeUSGS, paramStatDesc)
values (2, 'usgs', '1985-12-01', 44)

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
