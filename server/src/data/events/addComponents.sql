INSERT INTO [dbo].[COMPONENT]
([no]
,[id]
,[name]
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