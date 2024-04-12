/*triggers*/

-- -- delete all settings for the device (trigger)

CREATE TRIGGER trg_del_device
ON Device
INSTEAD OF DELETE
AS
BEGIN
    DELETE s
    FROM Settings s
    JOIN deleted d ON s.ID_Device = d.ID_Device;
	DELETE de
	FROM Device de
	JOIN deleted d ON d.ID_Device = d.ID_Device;
END

CREATE TRIGGER trg_del_realestate
ON RealEstate
INSTEAD OF DELETE
AS
BEGIN
    DELETE hu
    FROM House_User hu
    JOIN deleted de ON hu.ID_RealEstate = de.ID_RealEstate;
	DELETE r
    FROM Room r
    JOIN deleted de ON r.ID_RealEstate = de.ID_RealEstate;
	DELETE re
	FROM RealEstate re
	JOIN deleted de ON re.ID_RealEstate = de.ID_RealEstate
END

-- -- trigger to delete rooms

CREATE TRIGGER trg_del_room
ON Room
INSTEAD OF DELETE
AS
BEGIN
    DELETE d
    FROM Device d
    JOIN deleted de ON d.ID_Room = de.ID_Room
	DELETE r
	FROM Room r
	JOIN deleted de ON r.ID_Room = de.ID_Room
END