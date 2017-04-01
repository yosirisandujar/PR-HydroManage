--QUERIES
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
