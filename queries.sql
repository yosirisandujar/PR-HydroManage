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
SELECT riverID
	FROM public.rivers
    WHERE station=50092000

--Insert River information (example inserting 7 days )
INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, '1985-12-25', 44);

INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, '1985-12-26', 41);
	
INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, '1985-12-27', 33);
	
INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, '1985-12-28', 34);
	
INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, '1985-12-29', 31);
	
INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, '1985-12-30', 32);
	
INSERT INTO public.riversusgs(
	riverID, siteno, datetimeusgs, paramstatdesc)
	VALUES (1, 50092000, '1985-12-31', 29);

--Query to calculate sevenDaysAVG
--Same for: oneMonthAVG, threeMonthsAVG, sixMonthsAVG, nineMonthsAVG, oneYearAVG. dateTimeUSGS changes according to what to calculate
select avg(paramStatDesc)
from riversusgs
where dateTimeUSGS between '1985-12-25' and '1985-12-31'

--Query to calculate oneMonthAVG
--Same for: threeMonthsAVG, sixMonthsAVG, nineMonthsAVG, oneYearAVG. dateTimeUSGS changes according to what to calculate
select avg(paramStatDesc)
from riversusgs
where dateTimeUSGS between '1985-12-01' and '1985-12-31'

--Update riversUSGS
UPDATE public.riversusgs
	SET  sevendaysavg_flow=?
	WHERE usgsid=?
    and datetimeusgs=?

--Insert new WaterReservoir
INSERT INTO public.waterreservoirs(
	reservoirname, constructionyear, mostrecentstudyforsedimentation, reservoirlength_m, spillwayelevation_m_msl, originalcapacity_mm3, normaloperationallevel_m, storagevolume, deadvolume_mm3, activevolume_mm3, levelat25percentofvolume_m, at25percentofvolume_mm3, normaloperationallevel_ft, reasoningapproximatelevel_m_msl, reasoningapproximatelevel_ft, actuallevel_ft, uniqueid)
	VALUES ('Carraizo', 1953, 2004, 95.4, 31, 26.8, 134.95, 17.53, 0.25, 17.28, 33.97, 4.57, 134.95, 33.9, 111, 133.42, 50059000);
	
--Update WaterReservoir
UPDATE public.waterreservoirs
	SET mostrecentstudyforsedimentation=2004
	WHERE uniqueID=50059000;

--Get WaterReservoir by uniqueID
SELECT *
	FROM public.waterreservoirs
    WHERE uniqueID=50059000;

--Insert WaterReservoirsLevel
INSERT INTO public.waterreservoirslevel(
	reservoirid, volume_mm3, volume_percent, level_m, volume_m3, date)
	VALUES (1, 15, 35, 134.95, 17.53, '2016-12-30');


--Insert new Aquifer
INSERT INTO public.aquifers(
	aquifername, terrainlevelcat, optimalconditioncat, observationcat, controlsandadjustmentscat, criticcat)
	VALUES ('Pozo Constancia', 0, -8.60, -10.49, -12, -13.65);
	
--Insert new AquifersLevel
INSERT INTO public.aquiferslevel(
	aquiferid, aquiferlevel, changesintime, monitoringstation)
	VALUES (1, -11.23, -0.1, 181352066025300);
	
--Get AquiferLevel by monitoring station
SELECT *
	FROM public.aquiferslevel
    WHERE monitoringstation = 181352066025300;

--Add Form (ReservesAndShelters)


