drop table person, administrator, users

create table person(
personID bigserial unique not null,
email varchar(100) not null,
password varchar(50) not null,
secretQuestion int not null,
secretAnswer varchar(100) not null,
primary key(personID,email)
);

create table administrator(
personID bigserial references person(personID) not null,
adminID bigserial not null,
securitykey int,
primary key(personID,adminID)
);

create table users(
personID bigserial references person(personID) not null,
userID bigserial not null,
privilege boolean default false,
organization varchar(50) default null,
city varchar(50) not null,
activeUser boolean default true,
primary key(personID, userID)
);

create table Rivers(
riverID bigserial unique primary key not null,
riverName varchar(100),
riverNumber int unique,
region varchar(5),
station int,
description varchar(100)
);

create table RiversUSGS(
riverID bigserial references Rivers(riverID) not null,
usgsID bigserial not null,
agencyCd varchar (10) default 'usgs',
siteNo int references Rivers(riverNumber) not null, --
dateTimeUSGS date not null, -- time?
paramStatDesc float not null,
paramStatDesc_cd varchar(100),
calendarDay int, --IMPORTANT
sevenDaysAVG_Flow float,
oneMonthAVG_Flow float,
threeMonthsAVG_Flow float,
sixMonthsAVG_Flow float,
nineMonthsAVG_Flow float,
oneYearAVG_Flow float,
oneMonthPER float,
threeMonthsPER float,
sixMonthsPER float,
nineMonthsPER float,
oneYearPER float
primary key(riverID,usgsID)
);

--ARREGLAR!
create table RiversPercentile(
riverID bigserial primary key references Rivers(riverID) not null,
catID bigserial primary key not null,
category float,--
oneMonthCAT varchar(20),
threeMonthsCAT varchar(20),
sixMonthsCAT varchar(20),
nineMonthsCAT varchar(20),
oneYearCAT varchar(20)
);

create table WaterReservoirs(
reservoirID bigserial primary key not null,
reservoirName varchar(100),
constructionYear int,
mostRecentStudyforSedimentation int,
reservoirLength_m float,
spillwayElevation_m_msl float,
originalCapacity_Mm3 float,
normalOperationalLevel_m float,
storageVolume float,
deadVolume_Mm3 float,
activeVolume_Mm3 float,
levelat25PercentofVolume_m float,
at25PercentofVolume_Mm3 float
normalOperationalLevel_ft float,
reasoningApproximateLevel_m_msl float,
reasoningApproximateLevel_ft float,
actualLevel_ft float,--
--uniqueID int,
);

create table WaterReservoirsLevel(
reservoirID bigserial primary key references WaterReservoirs(reservoirID) not null,
reservoirLevelID bigserial primary key not null,
volume_Mm3 float,
volume_percent float,
level_m float, 
volume_m3 float,
date date
);

create table Aquifers(
aquiferID bigserial primary key not null,
aquiferName varchar(100), 
terrainLevelCAT float(10), --
optimalConditionCAT float(10), --
observationCAT float), --
controlsAndAdjustmentsCAT float, --
criticCAT float --
);

create table AquifersLevel(
aquiferID bigserial primary key references Aquifers(aquiferID) not null,
aquiferLevelID bigserial primary key not null,
aquiferLevel float, --
changesInTime float, --
monitoringStation varchar(100), --está (sitenumber)
--city varchar(50) --
);

create table ReservesAndShelters(
rsID bigserial primary key not null,
classification int,
comments varchar(200),
explication varchar(200),
submittedTime timestamp
);

create table ReservesForm(
rsID bigserial primary key references Aquifers(rsID) not null,
listID bigserial primary key not null,
criteria int,
thisWeekPunctuation int,
observations varchar(200),
lastWeekPunctuation int
);



