/*users*/

-- show users with their real estate address

CREATE VIEW v_users_realestate
AS
	SELECT 
		u.Name, 
		u.Surname, 
		u.Sex, 
		u.Password, 
		u.HouseEntry, 
		u.Phone, 
		u.Email,
		r.Address, 
		r.Town
	FROM House_User u right join RealEstate r
	on u.ID_RealEstate=r.ID_RealEstate

SELECT * FROM v_users_realestate;

-- show only one user

CREATE PROCEDURE sp_view_one_user(@id_user  NVARCHAR(100))
AS
BEGIN
	SELECT 
		u.Name, 
		u.Surname, 
		u.Sex, 
		u.Password, 
		u.HouseEntry, 
		u.Phone, 
		u.Email,
		r.ID_RealEstate,
		r.Address, 
		r.Town
	FROM House_User u right join RealEstate r
	on u.ID_RealEstate=r.ID_RealEstate
	WHERE CAST(@id_User AS INT) = u.ID_User;
END

exec sp_view_one_user '1'

-- show all users on one address

CREATE PROCEDURE sp_view_users_on_one_address(@real_estate int)
AS
BEGIN
	SELECT 
		u.ID_User as id_user,
		u.Name as name, 
		u.Surname as surname, 
		u.Sex as sex, 
		u.Password as password, 
		u.HouseEntry as houseEntry, 
		u.Phone as phone, 
		u.Email as email
	FROM House_User u 
	WHERE u.ID_RealEstate=@real_estate
	ORDER BY u.Name
END

exec sp_view_users_on_one_address 1

-- show real estate of a user

CREATE PROCEDURE sp_get_real_estate_of_user(@id_user NVARCHAR(100))
AS
BEGIN
	SELECT 
		r.ID_RealEstate as id_real_estate,
		r.Address as address, 
		r.Town as town
	FROM RealEstate r right join  House_User u
	ON r.ID_RealEstate = u.ID_RealEstate
	WHERE u.ID_User = @id_user
END

exec sp_get_real_estate_of_user 5

--create user

CREATE PROCEDURE sp_ins_House_User (@user_json VARCHAR(MAX))
AS
BEGIN
    DECLARE @Name VARCHAR(50);
    DECLARE @Surname VARCHAR(50);
    DECLARE @Sex CHAR(1);
    DECLARE @Email VARCHAR(50);
    DECLARE @Password VARCHAR(50);
    DECLARE @HouseEntry VARCHAR(50);
    DECLARE @Phone VARCHAR(20);
    DECLARE @RealEstate VARCHAR(50);

    SELECT
        @Name = JSON_VALUE(@user_json, '$.name'),
        @Surname = JSON_VALUE(@user_json, '$.surname'),
        @Sex = JSON_VALUE(@user_json, '$.sex'),
        @Email = JSON_VALUE(@user_json, '$.email'),
        @Password = JSON_VALUE(@user_json, '$.password'),
        @HouseEntry = JSON_VALUE(@user_json, '$.houseEntry'),
        @Phone = JSON_VALUE(@user_json, '$.phone'),
        @RealEstate = JSON_VALUE(@user_json, '$.realEstate');

    IF EXISTS (SELECT 1 FROM House_User WHERE Email = @Email)
    BEGIN
        SELECT 'Email already exists' as message;
		RAISERROR('Email already exists', 10, 1)
        RETURN;
    END;
    ELSE IF EXISTS (SELECT 1 FROM House_User WHERE Phone = @Phone)
    BEGIN
        SELECT 'Phone number already exists' as message;
        RAISERROR('Phone number already exists', 10, 1)
		RETURN;
    END;
    ELSE IF LEN(@Name) < 3 OR 
            LEN(@Surname) < 3 OR 
            (@Sex != 'f' AND @Sex != 'm') OR
            @Email NOT LIKE '%_@__%.__%' OR
            LEN(@Password) < 8 OR
            LEN(@HouseEntry) < 8
    BEGIN
        SELECT 'Invalid input' as message;
		RAISERROR('Invalid input', 10, 1)
        RETURN;
    END;
    ELSE
    BEGIN
        INSERT INTO House_User
        VALUES (@Name, @Surname, @Sex, @Email, @Password, @HouseEntry, @Phone, @RealEstate);
		SELECT 'successfully added' AS message;
    END;
END;

exec sp_ins_House_User '{"name":"Petra", "surname": "Petric", "sex": "f", 
"email":"nekapetra@gmail.com", "password": "12345678", "houseEntry":"12345678", 
"phone":"0956345217", "realEstate": 1 }'
select * from House_User;

-- delete user

CREATE PROCEDURE sp_del_House_User (@id_user VARCHAR(MAX))
AS
BEGIN
     SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM House_User WHERE ID_User = @id_user)
    BEGIN
        DELETE FROM House_User WHERE ID_User = @id_user;
        SELECT 'Successfully deleted' AS message;
    END
    ELSE
    BEGIN
        -- Korisnik ne postoji
        SELECT 'User does not exist ' AS Message;
    END
END;

exec sp_del_House_User 3

-- update user 

CREATE PROCEDURE sp_upd_House_User (@user_json VARCHAR(MAX))
AS
BEGIN
	DECLARE @ID_User int;
	DECLARE @Name VARCHAR(50);
    DECLARE @Surname VARCHAR(50);
    DECLARE @Email VARCHAR(50);
	DECLARE @OldPassword VARCHAR(50);
    DECLARE @Password VARCHAR(50);
    DECLARE @HouseEntry VARCHAR(50);
    DECLARE @Phone VARCHAR(20);

	SELECT
		@ID_User = JSON_VALUE(@user_json, '$.id_user'),
		@Name = JSON_VALUE(@user_json, '$.name'),
		@Surname = JSON_VALUE(@user_json, '$.surname'),
		@Email = JSON_VALUE(@user_json, '$.email'),
		@Password = JSON_VALUE(@user_json, '$.password'),
		@OldPassword = JSON_VALUE(@user_json, '$.old_password'),
		@HouseEntry = JSON_VALUE(@user_json, '$.houseEntry'),
		@Phone = JSON_VALUE(@user_json, '$.phone')
	IF EXISTS (SELECT 1 FROM House_User WHERE Email = @Email AND CAST(@ID_User AS INT) != ID_User)
	BEGIN
        SELECT 'Email already exists' as message;
		RAISERROR('Email already exists', 10, 1)
        RETURN;
    END;
	ELSE IF EXISTS (SELECT 1 FROM House_User WHERE Phone = @Phone AND CAST(@ID_User AS INT) != ID_User)
    BEGIN
        SELECT 'Phone number already exists' as message;
        RAISERROR('Phone number already exists', 10, 1)
		RETURN;
    END;
	 ELSE IF LEN(@Name) < 3 OR 
            LEN(@Surname) < 3 OR 
            @Email NOT LIKE '%_@__%.__%' OR
            LEN(@Password) < 8 OR
            LEN(@HouseEntry) < 8
    BEGIN
        SELECT 'Invalid input' as message;
		RAISERROR('Invalid input', 10, 1)
        RETURN;
    END;
	ELSE IF (SELECT Password FROM House_User WHERE ID_User=@ID_User) != @OldPassword
	BEGIN
		SELECT 'Old password dont match!' as message;
		RAISERROR('Old password dont match!', 10, 1)
        RETURN;
	END
	ELSE 
	BEGIN
		UPDATE House_User
		SET
		    Name = @Name,
			Surname = @Surname,
			Email = @Email,
			Password = @Password,
			HouseEntry = @HouseEntry,
			Phone = @Phone
		WHERE ID_User = CAST(@ID_User AS INT);
		SELECT 'successfully updated' as message;
	END
END

exec sp_upd_House_User '{"id_user" : "4", "name" : "Ivan", "surname": "Petric", 
"email":"petric3@gmail.com", "password": "123456789", "old_password": "123456789", "houseEntry":"12345678", 
"phone":"0936345217"}'

-- procedure to login user (check if user exists and check if he entered right password)

CREATE PROCEDURE login_user (@user_json VARCHAR(MAX))
AS
BEGIN
	DECLARE @Email VARCHAR(50);
	DECLARE @Password VARCHAR(50);
	SELECT
		@Email = JSON_VALUE(@user_json, '$.email'),
		@Password = JSON_VALUE(@user_json, '$.password')
	IF EXISTS(SELECT 1 FROM House_User WHERE Email=@Email and Password=@Password)
		BEGIN
			SELECT 
				'User valid' as valid,
				ID_User as user_id,
				Name as name,
				Surname as surname,
				Sex as sex,
				Email as email,
				Password as password,
				HouseEntry as house_entry,
				Phone as phone
			FROM House_User
			WHERE Email = @Email
			    AND Password = @Password;
		END
	ELSE
		BEGIN
			SELECT 'User invalid' as valid
		END 
END

exec login_user '{"email": "ante_antic@gmail.com", "password": "12345"}'

-- show all users
select * from House_User;