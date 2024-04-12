/*real estate and rooms*/

-- get all rooms in one real estate 
--added
CREATE PROCEDURE sp_get_rooms (@real_estate int)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM RealEstate WHERE ID_RealEstate = @real_estate)
		BEGIN
			SELECT 
				ID_Room as room_id,
				Name as name
			FROM Room 
			WHERE ID_RealEstate=@real_estate;
		END
	ELSE
		BEGIN
			SELECT 'There is no such real estate' AS message;
		END
END

exec sp_get_rooms 1

-- get one real estate

CREATE PROCEDURE sp_get_one_real_estate (@id VARCHAR(MAX), @from VARCHAR(MAX))
AS
BEGIN
	IF @from = 'realestate'
		BEGIN
			SELECT 
				Address as address,
				Town as town,
				Phone as phone
			FROM RealEstate WHERE ID_RealEstate = CAST(@id AS INT)
		END
	ELSE IF @from = 'room'
		BEGIN
			SELECT 
				r.ID_RealEstate as realestate_id,
				r.Address as address,
				r.Town as town,
				r.Phone as phone
			FROM RealEstate r left join Room ro on r.ID_RealEstate = ro.ID_RealEstate
			WHERE ro.ID_Room = CAST(@id AS INT)
		END

	ELSE
		BEGIN
			SELECT 'Room can not be reached' as message
		END
END

-- add real estate
-- added
CREATE PROCEDURE sp_ins_real_estate (@json VARCHAR(MAX))
AS
BEGIN
	DECLARE @Address VARCHAR(50);
    DECLARE @Town VARCHAR(50);
    DECLARE @Phone VARCHAR(20);

	SELECT
		@Address = JSON_VALUE(@json, '$.address'),
        @Town = JSON_VALUE(@json, '$.town'),
        @Phone = JSON_VALUE(@json, '$.phone')
	IF EXISTS (SELECT 1 FROM RealEstate WHERE Address = @Address AND Town = @Town)
		BEGIN
			SELECT 'There are already registered properties at that address' AS message;
		END
	ELSE
		BEGIN
			INSERT INTO RealEstate 
			VALUES (
				@Address,
				@Town,
				@Phone
			)
			SELECT 'Succefuly added' AS message;
		END
END

exec sp_ins_real_estate '{"address": "Sparinska 12", "town": "Split", "phone": "021553652"}'
SELECT * FROM RealEstate;

-- update real estate

CREATE PROCEDURE sp_upd_real_estate (@json VARCHAR(MAX))
AS
BEGIN
	DECLARE @ID_RealEstate int;
	DECLARE @Address VARCHAR(50);
    DECLARE @Town VARCHAR(50);
    DECLARE @Phone VARCHAR(20);
	DECLARE @ExistingCount int;
	SELECT
		@ID_RealEstate = CAST(JSON_VALUE(@json, '$.id_realestate') AS INT),
		@Address = JSON_VALUE(@json, '$.address'),
        @Town = JSON_VALUE(@json, '$.town'),
        @Phone = JSON_VALUE(@json, '$.phone')
	SELECT @ExistingCount = COUNT(*) 
		FROM RealEstate 
		WHERE (Address = @Address AND Phone = @Phone)
		AND ID_RealEstate <> @ID_RealEstate;
	IF @ExistingCount > 0
		BEGIN
			SELECT 'There are already registered properties at that address' AS message;
		END
	ELSE
		BEGIN
			UPDATE RealEstate
				SET
					Address = @Address,
					Town = @Town,
					Phone = @Phone
				WHERE @ID_RealEstate = ID_RealEstate
			SELECT 'Succefuly updated' AS message;
		END
END

exec sp_upd_real_estate '{"id_realestate": "4", "town": "Split", "address":"Moranciceva 72", "phone": "021559672"}'

-- delete real estate

CREATE PROCEDURE sp_del_real_estate (@id_real_estate VARCHAR(MAX))
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM RealEstate WHERE ID_RealEstate = @id_real_estate)
    BEGIN
        DELETE FROM RealEstate WHERE ID_RealEstate = @id_real_estate;
        SELECT 'Successfully deleted' AS message;
    END
    ELSE
    BEGIN
        SELECT 'real estate does not exist ' AS message;
    END
END;


--exec sp_del_real_estate '4'

-- get one room

CREATE PROCEDURE sp_get_one_room (@id VARCHAR(MAX), @from VARCHAR(MAX))
AS
BEGIN
	IF @from = 'room'
		BEGIN
			SELECT 
				Name as name,
				Surface as surface,
				ID_RealEstate as real_estate
			FROM Room WHERE ID_Room = CAST(@id AS INT)
		END
	ELSE IF @from = 'device'
		BEGIN
			SELECT 
				r.ID_Room as room_id,
				r.Name as name,
				r.Surface as surface,
				r.ID_RealEstate as real_estate
			FROM Room r left join Device d on r.ID_Room = d.ID_Room
			WHERE d.ID_Device = CAST(@id AS INT)
		END
	ELSE
		BEGIN
			SELECT 'Room can not be reached' as message
		END
END

-- add rooms

CREATE PROCEDURE sp_ins_rooms(@json NVARCHAR(MAX))
AS
BEGIN
	DECLARE @Name VARCHAR(20);
	DECLARE @Surface int;
    DECLARE @RealEstate int;
	SELECT
		@Name = JSON_VALUE(@json, '$.name'),
		@Surface = CAST(JSON_VALUE(@json, '$.surface') AS INT),
        @RealEstate = CAST(JSON_VALUE(@json, '$.id_realestate') AS INT)
	IF EXISTS (SELECT 1 FROM RealEstate WHERE ID_RealEstate = @RealEstate)
		BEGIN
			INSERT INTO Room 
			VALUES (
				@Name,
				@Surface,
				@RealEstate
			)
			SELECT 'Succefuly added' AS message;
		END
	ELSE
		BEGIN
			SELECT 'There is no such real estate' AS message;
		END

END

exec sp_ins_rooms '{"name": "Livingroom", "surface": 56, "id_realestate": 1}'
-- update rooms

CREATE PROCEDURE sp_upd_rooms(@json VARCHAR(50))
AS
BEGIN
	DECLARE @ID_Room int;
	DECLARE @Name VARCHAR(20);
	DECLARE @Surface int;
	SELECT
		@ID_Room = JSON_VALUE(@json, '$.id_room'),
		@Name = JSON_VALUE(@json, '$.name'),
		@Surface = CAST(JSON_VALUE(@json, '$.surface') AS INT)
	IF EXISTS (SELECT 1 FROM Room WHERE @ID_Room=ID_Room)
		BEGIN
			UPDATE Room 
				SET
					Name = @Name,
					Surface = @Surface
				WHERE ID_Room = @ID_Room
			SELECT 'Succefuly updated' AS message;
		END
	ELSE
		BEGIN
			SELECT 'Room does not exists' AS message;
		END
END

-- delete rooms 

CREATE PROCEDURE sp_del_rooms(@id_room VARCHAR(50))
AS
BEGIN
	SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Room WHERE ID_Room = @id_room)
    BEGIN
        DELETE FROM Room WHERE ID_Room = @id_room;
        SELECT 'Successfully deleted' AS message;
    END
    ELSE
    BEGIN
        SELECT 'room does not exist ' AS message;
    END
        
END

select * from Room;