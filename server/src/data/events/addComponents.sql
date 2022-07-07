INSERT INTO [dbo].[COMPONENT]
([No]
,[ID]
,[NAME]
,[lastUpdate]
)
VALUES
(
   @No
   , @ID
   , @Name
   , GetDate()  
);

SELECT SCOPE_IDENTITY() AS id;