CREATE VIEW v_max_indexes
AS
SELECT MAX(ID_User) AS max_index, 'House_User' as 'table' FROM House_User
UNION ALL
SELECT MAX(ID_RealEstate) AS max_index, 'RealEstate' as 'table' FROM RealEstate
UNION ALL
SELECT MAX(ID_Room) AS max_index, 'Room' as 'table' FROM Room
UNION ALL
SELECT MAX(ID_Device) AS max_index, 'Device' as 'table' FROM Device
UNION ALL
SELECT MAX(ID_Type) AS max_index, 'Device_Type' as 'table' FROM Device_Type
UNION ALL
SELECT MAX(ID_Settings) AS max_index, 'Settings' as 'table' FROM Settings;

SELECT * FROM v_max_indexes;

CREATE VIEW v_device_type
AS
SELECT 
	t.ID_Type as id_type, 
	t.Name as name, 
	c.Category_name as category 
FROM Device_Type t 
	inner join Category c on t.ID_Category=c.ID_Category;

SELECT * FROM v_device_type;