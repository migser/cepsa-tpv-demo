SELECT r.name, r.promocion__r__promo_id__c
FROM salesforce.regla__c AS r
WHERE 
(coalesce(r.combustible__c,'Diesel Plus')='Diesel Plus' ) AND
((r.operador__c ='Mayor' AND 101 > r.importe__c ) OR 
(r.operador__c ='Menor' AND 101 < r.importe__c ) OR
(r.importe__c IS null))
ORDER BY r.prioridad__c
LIMIT 1

CREATE TABLE tickets (promocion varchar(200), promoid varchar(200) PRIMARY KEY, ticketid varchar(200), reglaid varchar(200) delivered_date date)

INSERT INTO public.tickets (promocion, promoid) VALUES ('2X1','2X12');



SELECT * FROM public.tickets
UPDATE public.tickets SET ticketid=NULL , delivered_Date = NULL


UPDATE public.tickets SET ticketid='A' , delivered_Date = now()
WHERE promoid = (SELECT promoid FROM public.tickets WHERE promocion='LAVADO' AND ticketid IS NULL ORDER BY promoid LIMIT 1) 
RETURNING promoid

UPDATE public.tickets AS t
 SET ticketid=r.name , delivered_Date = now()
WHERE promoid = (
SELECT t.promoid 
FROM public.tickets AS T, salesforce.regla__c AS R
WHERE t.promocion = r.promocion__r__promo_id__c AND 
t.ticketid IS NULL AND 
(coalesce(r.combustible__c,'Diesel Plus')='Diesel Plus' ) AND
((r.operador__c ='Mayor' AND 101 > r.importe__c ) OR 
(r.operador__c ='Menor' AND 101 < r.importe__c ) OR
(r.importe__c IS null))
ORDER BY r.prioridad__c, t.promoid 
LIMIT 1) 
RETURNING promoid

UPDATE public.tickets AS t2
 SET ticketid=(
SELECT r.Regla_ID__c
FROM salesforce.regla__c AS R,public.tickets AS t
WHERE t.promocion = r.promocion__r__promo_id__c AND 
t.ticketid IS NULL AND 
(coalesce(r.combustible__c,'Diesel Plus')='Diesel Plus' ) AND
((r.operador__c ='Mayor' AND 101 > r.importe__c ) OR 
(r.operador__c ='Menor' AND 101 < r.importe__c ) OR
(r.importe__c IS null)) AND
t.promoid = t2.promoid
ORDER BY r.prioridad__c, t.promoid 
LIMIT 1) , delivered_Date = now()
WHERE t2.promoid = (
SELECT t.promoid 
FROM public.tickets AS T, salesforce.regla__c AS R
WHERE t.promocion = r.promocion__r__promo_id__c AND 
t.ticketid IS NULL AND 
(coalesce(r.combustible__c,'Diesel Plus')='Diesel Plus' ) AND
((r.operador__c ='Mayor' AND 101 > r.importe__c ) OR 
(r.operador__c ='Menor' AND 101 < r.importe__c ) OR
(r.importe__c IS null))
ORDER BY r.prioridad__c, t.promoid 
LIMIT 1) 
RETURNING t2.promoid, t2.ticketid


'UPDATE public.tickets AS t2 SET ticketid=$1, reglaid=(SELECT r.Regla_ID__c FROM salesforce.regla__c AS R,public.tickets AS t WHERE t.promocion = r.promocion__r__promo_id__c AND t.ticketid IS NULL AND (coalesce(r.combustible__c,cast($2 as varchar)=cast($2 as varchar) ) AND ((r.operador__c =\'Mayor\' AND $3 > r.importe__c ) OR (r.operador__c =\'Menor\' AND $3 < r.importe__c ) OR (r.importe__c IS null)) AND t.promoid = t2.promoid ORDER BY r.prioridad__c, t.promoid LIMIT 1) , delivered_Date = now() WHERE t2.promoid = ( SELECT t.promoid FROM public.tickets AS T, salesforce.regla__c AS R WHERE t.promocion = r.promocion__r__promo_id__c AND t.ticketid IS NULL AND (coalesce(r.combustible__c,cast($2 as varchar))=cast($2 as varchar) ) AND ((r.operador__c =\'Mayor\' AND $3 > r.importe__c ) OR (r.operador__c =\'Menor\' AND $3 < r.importe__c ) OR (r.importe__c IS null)) ORDER BY r.prioridad__c, t.promoid LIMIT 1) RETURNING t2.promoid AS PROMOID, t2.ticketid AS TICKETID'


Con funcion SQL:


CREATE TYPE salida AS (promoid varchar(200), ticketid varchar(200), reglaid varchar(200));

CREATE OR REPLACE FUNCTION actualiza(varchar, varchar, double precision) RETURNS salida AS $$
UPDATE public.tickets AS t2
 SET ticketid=$1, reglaid=(
SELECT r.Regla_ID__c
FROM salesforce.regla__c AS R,public.tickets AS t
WHERE t.promocion = r.promocion__r__promo_id__c AND 
t.ticketid IS NULL AND 
(coalesce(r.combustible__c,$2)=$2 ) AND
((r.operador__c ='Mayor' AND $3 > r.importe__c ) OR 
(r.operador__c ='Menor' AND $3 < r.importe__c ) OR
(r.importe__c IS null)) AND
t.promoid = t2.promoid
ORDER BY r.prioridad__c, t.promoid 
LIMIT 1) , delivered_Date = now()
WHERE t2.promoid = (
SELECT t.promoid 
FROM public.tickets AS T, salesforce.regla__c AS R
WHERE t.promocion = r.promocion__r__promo_id__c AND 
t.ticketid IS NULL AND 
(coalesce(r.combustible__c,$2)=$2 ) AND
((r.operador__c ='Mayor' AND $3 > r.importe__c ) OR 
(r.operador__c ='Menor' AND $3 < r.importe__c ) OR
(r.importe__c IS null))
ORDER BY r.prioridad__c, t.promoid 
LIMIT 1) 
RETURNING t2.promoid, t2.ticketid, t2.reglaid;
$$ LANGUAGE SQL;

select * from actualiza('ticket1','Diesel Plus',12);