INSERT INTO [dbo].[RECIPE_H]
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