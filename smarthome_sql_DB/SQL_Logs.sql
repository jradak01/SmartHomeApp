/*logs*/

-- stavljanje logova na kraju dana 

CREATE PROCEDURE sp_ins_logs (@json VARCHAR(max))
AS
BEGIN
    DECLARE @ID_Device INT;
    DECLARE @ID_RealEstate INT;
    DECLARE @Content VARCHAR(50);
    DECLARE @Updated_at DATETIME;
    DECLARE @Content_type VARCHAR(50);
    DECLARE @Content_type_LOG CHAR(3);
    
    SELECT
        @ID_Device =  NULLIF(CAST(JSON_VALUE(@json, '$.id_device') AS INT), 0),
        @Content = JSON_VALUE(@json, '$.content'),
        @Updated_at = CAST(JSON_VALUE(@json, '$.updated_at') AS DATETIME),
        @Content_type = JSON_VALUE(@json, '$.content_type'),
        @ID_RealEstate = CAST(JSON_VALUE(@json, '$.estate') AS INT);
    
    SELECT @Content_type_LOG = 
        CASE 
            WHEN @Content_type = 'Info' THEN 'INF' 
            WHEN @Content_type = 'Warning' THEN 'WAR'
            WHEN @Content_type = 'Danger' THEN 'DAN'
            ELSE 'INF' 
        END;
    INSERT INTO RealEstate_LOG (ID_RealEstate, ID_Device, Content, Updated_at, Content_type)
    VALUES (@ID_RealEstate, @ID_Device, @Content, @Updated_at, @Content_type_LOG);
END

DECLARE @json VARCHAR(MAX);
SET @json = '
{
  "id_device": 123,
  "content": "Some content",
  "updated_at": "2023-06-18",
  "content_type": "Info",
  "estate": 456
}';
EXEC sp_ins_logs @json;

-- dohvacanje logova

CREATE PROCEDURE get_logs (@date VARCHAR(50), @realEstate VARCHAR(50))
AS
BEGIN
    SELECT
		l.ID_RealEstate as estate,
        l.Content as content,
        l.Content_type as content_type,
		l.Updated_at as updated_at,
		d.Name as device
    FROM
        RealEstate_LOG l
        CROSS APPLY (
            SELECT TOP 1
				d.Name
			FROM Device d
			INNER JOIN Room r ON d.ID_Room = r.ID_Room
			WHERE r.ID_RealEstate = CONVERT(INT, @realEstate)
        ) AS d
    WHERE l.Updated_at = CONVERT(DATE, @date);
END