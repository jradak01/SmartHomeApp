/*devices*/

-- get all devices by room with settings
CREATE PROCEDURE sp_get_rooms_devices (@id_real_estate VARCHAR(MAX))
AS
BEGIN
	SELECT 
    r.ID_Room AS id_room,
    r.Name AS name,
    (
        SELECT 
            d.ID_Device AS id_device,
            d.Name AS name,
            t.Name AS type,
            c.Category_name AS category,
            (
                SELECT 
                    s.ID_Settings AS id_settings,
                    s.Name AS settings_name,
                    s.Settings_value AS settings_value
                FROM Settings s
                WHERE s.ID_Device = d.ID_Device
                FOR JSON PATH
            ) AS settings
        FROM Device d 
        INNER JOIN Device_Type t ON d.ID_Type = t.ID_Type
        INNER JOIN Category c ON t.ID_Category = c.ID_Category
        WHERE d.ID_Room = r.ID_Room
        FOR JSON PATH
    ) AS devices
	FROM Room r 
	WHERE r.ID_RealEstate = CAST(@id_real_estate AS INT)
	FOR JSON PATH
END

exec sp_get_rooms_devices 1;

-- get all devices by room with settings

CREATE PROCEDURE sp_get_devices_in_room (@id_room VARCHAR(MAX))
AS
BEGIN
	SELECT 
		d.ID_Device as id_device,
		d.Name as name,
		t.Name as type,
		c.Category_name as category,
		(
			SELECT 
			s.ID_Settings as id_settings,
			s.Name as name,
			s.Settings_value as value
			FROM Settings s
			WHERE s.ID_Device = d.ID_Device
			FOR JSON PATH
		) as settings
	FROM Device d 
		INNER JOIN Device_Type t ON d.ID_Type = t.ID_Type
		INNER JOIN Category c ON t.ID_Category = c.ID_Category 
	WHERE d.ID_Room = CAST(@id_room AS INT)
	FOR JSON PATH
END

-- get one device

CREATE PROCEDURE sp_get_device (@id_device VARCHAR(MAX))
AS
BEGIN
	SELECT 
		d.ID_Device as 'id_device',
		d.Name as 'name',
		r.Name as 'room',
		t.Name as 'type',
		c.Category_name as 'category',
		(
			SELECT 
			s.ID_Settings as id_settings,
			s.Name as name,
			s.Settings_value as value
				FROM Settings s
				WHERE s.ID_Device = d.ID_Device
			FOR JSON PATH
		) as settings
	FROM Device d 
		INNER JOIN Room r on d.ID_Room = r.ID_Room
		INNER JOIN Device_Type t on d.ID_Type = t.ID_Type
		INNER JOIN Category c on t.ID_Category=c.ID_Category
	WHERE d.ID_Device=@id_device
	FOR JSON PATH
END

EXEC sp_get_device 5;

-- add device

CREATE PROCEDURE sp_ins_device (@json VARCHAR(MAX))
AS
BEGIN
	DECLARE @Name VARCHAR(50);
	DECLARE @type VARCHAR(50);
	DECLARE @room VARCHAR(50);
    DECLARE @ID_Type INT;
    DECLARE @ID_Room INT;
	DECLARE @estate VARCHAR(50); 
	SELECT
		@Name = JSON_VALUE(@json, '$.name'),
        @type = JSON_VALUE(@json, '$.type'),
        @room = JSON_VALUE(@json, '$.room'),
		@estate = CAST(JSON_VALUE(@json, '$.estate') AS INT)
	
	SET @ID_Type = (SELECT ID_Type FROM Device_Type WHERE LOWER(Name) = LOWER(@type))
	SET @ID_Room = (SELECT ID_Room FROM Room r 
		WHERE LOWER(r.Name)=LOWER(@room)
			AND r.ID_RealEstate=@estate)
	
	IF @ID_Type IS NULL OR @ID_Room IS NULL
		BEGIN
			SELECT 'There is no such room and type' AS message;
		END
	ELSE
		BEGIN
			INSERT INTO Device 
			VALUES (
				@Name,
				@ID_Type,
				@ID_Room
			)
			SELECT 'Succefuly added' AS message,
			IDENT_CURRENT('Device') AS 'id_device';
		END
END

-- delete device

CREATE PROCEDURE sp_del_device (@id_device VARCHAR(MAX))
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Device WHERE ID_Device = CAST(@id_device AS INT))
    BEGIN
        DELETE FROM Device WHERE ID_Device = CAST(@id_device AS INT);
        SELECT 'Successfully deleted' AS message;
    END
    ELSE
    BEGIN
        SELECT 'device does not exist ' AS message;
    END
END

exec sp_del_device 2;
--select * from Device

-- update device

CREATE PROCEDURE sp_upd_device (@json NVARCHAR(MAX))
AS
BEGIN
	DECLARE @ID_Device INT;
	DECLARE @Name VARCHAR(50);
	DECLARE @room VARCHAR(50);
    DECLARE @ID_Room INT;
	DECLARE @estate VARCHAR(50); 

	SELECT
		@ID_Device = CAST(JSON_VALUE(@json, '$.id_device') AS INT),
		@Name = JSON_VALUE(@json, '$.name'),
        @room = JSON_VALUE(@json, '$.room'),
		@estate = CAST(JSON_VALUE(@json, '$.estate') AS INT)
	
	SET @ID_Room = (SELECT ID_Room FROM Room r 
		WHERE LOWER(r.Name)=LOWER(@room)
			AND r.ID_RealEstate=@estate)

	IF  @ID_Room IS NOT NULL AND 
		EXISTS (SELECT 1 FROM Device d WHERE d.ID_Device = @ID_Device)
		BEGIN
			UPDATE Device 
				SET
					Name = @Name,
					ID_Room = @ID_Room
				WHERE ID_Device = @ID_Device 
			SELECT 'Succefuly updated' AS message;
		END
	ELSE
		BEGIN
			SELECT 'There is no such room or device' AS message;
		END
END

-- create settings for device

CREATE PROCEDURE sp_ins_settigs (@json VARCHAR(MAX))
AS
BEGIN
	DECLARE @Name VARCHAR(50);
    DECLARE @Value VARCHAR(50);
    DECLARE @ID_Device INT;

	SELECT
		@Name = JSON_VALUE(@json, '$.name'),
        @Value = JSON_VALUE(@json, '$.value'),
        @ID_Device = CAST(JSON_VALUE(@json, '$.device') AS INT)
	IF EXISTS (SELECT 1 FROM Device d WHERE d.ID_Device = @ID_Device)
		BEGIN
			INSERT INTO Settings 
			VALUES (
				@Name,
				@Value,
				@ID_Device
			)
			SELECT 'Succefuly added' AS message;
		END
	ELSE
		BEGIN
			SELECT 'There is no such device' AS message;
		END
END

select * from Device;
-- update settings for the device

CREATE PROCEDURE sp_upd_settings (@json VARCHAR(MAX))
AS
BEGIN
	DECLARE @ID_Settings INT;
	DECLARE @Name VARCHAR(50);
    DECLARE @Value VARCHAR(50);

	SELECT
		@ID_Settings = CAST(JSON_VALUE(@json, '$.id_settings') AS INT),
		@Name = JSON_VALUE(@json, '$.name'),
		@Value = JSON_VALUE(@json, '$.value')	
	IF EXISTS (SELECT 1 FROM Settings s WHERE s.ID_Settings = @ID_Settings) 
		BEGIN
			UPDATE Settings 
				SET
					Name = @Name,
					Settings_value = @Value
				WHERE ID_Settings = @ID_Settings 
			SELECT 'Succefuly updated' AS message;
		END
	ELSE
		BEGIN
			SELECT 'There is no such room or device' AS message;
		END
END

select * from Settings;
--delete settings for device 

CREATE PROCEDURE sp_del_settings (@id_settings VARCHAR(MAX))
AS
BEGIN
	SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Settings WHERE ID_Settings = @id_settings)
    BEGIN
        DELETE FROM Settings WHERE ID_Settings = @id_settings;
        SELECT 'Successfully deleted' AS message;
    END
    ELSE
    BEGIN
        SELECT 'settings does not exist ' AS message;
    END
END

--ins add device type

CREATE PROCEDURE sp_ins_device_type (@json VARCHAR(MAX))
AS
BEGIN
	DECLARE @Name VARCHAR(50);
    DECLARE @Category VARCHAR(50);
	DECLARE @CategoryId INT;

	SELECT
		@Name = JSON_VALUE(@json, '$.name'),
		@Category = JSON_VALUE(@json, '$.category')	
	SELECT @CategoryId = 
		CASE 
			WHEN @Category = 'Device' THEN 1
			WHEN @Category = 'Sensor' THEN 2
			ELSE 1 
		END;
	INSERT INTO Device_Type
	VALUES (
		@Name,
		@CategoryId 
	)
	SELECT 'added successfully' as message
END

select  * from  Device_Type

-- inserted categories

BEGIN TRANSACTION;
BEGIN TRY
	IF EXISTS(SELECT 1 FROM Category c WHERE c.Category_name = 'Sensor' or c.Category_name = 'Device')
		BEGIN
			ROLLBACK;
			RAISERROR('Category already exists', 10, 1)
		END
	ELSE
		BEGIN
			INSERT INTO Category
			VALUES
				('Device'),
				('Sensor')
			COMMIT;
		END
END TRY
BEGIN CATCH
    ROLLBACK;
	RAISERROR('Something went wrong', 10, 1)
END CATCH;

SELECT * FROM Settings;


/*getlocks*/

CREATE PROCEDURE sp_get_locks (@id_real_estate VARCHAR(50))
AS
BEGIN
	SELECT 
		d.ID_Device as id_device,
		d.ID_Room as room
	FROM Device d 
		INNER JOIN Room r on d.ID_Room=r.ID_Room
		INNER JOIN Device_Type t on d.ID_Type=t.ID_Type
	WHERE r.ID_RealEstate= CAST(@id_real_estate AS INT) AND t.Name='Lock';
END

EXEC sp_get_locks '13'

CREATE PROCEDURE sp_get_device_specific (@id_real_estate VARCHAR(50), @type VARCHAR(50))
AS
BEGIN
	SELECT
	d.ID_Device as id_device,
	r.ID_Room as room
	FROM Device d
	INNER JOIN Device_Type t on d.ID_Type = t.ID_Type
	INNER JOIN Room r on d.ID_Room = r.ID_Room
	WHERE r.ID_RealEstate = CAST(@id_real_estate AS INT) AND LOWER(t.Name)=LOWER(@type);
END

EXEC sp_get_device_specific '13', 'Humidity Sensor'