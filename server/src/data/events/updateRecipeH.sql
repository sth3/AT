UPDATE  [dbo].[RECIPE_H]
SET     [id] = @ID
       ,[name] = @Name
       ,[lastUpdate] = GetDate()         
WHERE   [no] = @No;

SELECT *
FROM	[dbo].[RECIPE_H]