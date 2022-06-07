INSERT INTO [dbo].[COMPONENTS]
([No]
,[ID]
,[NAME]
)
VALUES
(
   @No
   , @ID
   , @Name   
);

SELECT SCOPE_IDENTITY() AS id;