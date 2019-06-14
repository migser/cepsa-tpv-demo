SELECT r.name, r.promocion__r__promo_id__c
FROM salesforce.regla__c AS r
WHERE 
(coalesce(r.combustible__c,'Diesel Plus')='Diesel Plus' ) AND
((r.operador__c ='Mayor' AND 101 > r.importe__c ) OR 
(r.operador__c ='Menor' AND 101 < r.importe__c ) OR
(r.importe__c IS null))
ORDER BY r.prioridad__c
LIMIT 1

CREATE TABLE tickets (promocion varchar(200), promoid varchar(200) PRIMARY KEY, ticketid varchar(200), delivered_date date)

INSERT INTO public.tickets (promocion, promoid) VALUES ('2X1','2X12');



SELECT * FROM public.tickets
UPDATE public.tickets SET ticketid=NULL , delivered_Date = NULL


UPDATE public.tickets SET ticketid='A' , delivered_Date = now()
WHERE promoid = (SELECT promoid FROM public.tickets WHERE promocion='LAVADO' AND ticketid IS NULL ORDER BY promoid LIMIT 1) 
RETURNING promoid