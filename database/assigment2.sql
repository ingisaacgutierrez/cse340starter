-- INSERT new record in account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--UPDATE the new record in account table
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- DELETE the new record
DELETE FROM public.account
WHERE account_id = 1;

--UPDATE only part of the description 
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

--INNER JOIN make and model for classificatin Sport
SELECT 
    inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM 
    public.inventory
INNER JOIN 
    public.classification
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_id = 2;

--UPDATE to add only a word '/vehicles' to the middle of the file path
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
