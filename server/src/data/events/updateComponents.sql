UPDATE  [dbo].[COMPONENT]
SET     [id] = @ID
       ,[name] = @Name
       ,[lastUpdate] = GetDate()         
WHERE   [no] = @No;

SELECT *
FROM	[dbo].[COMPONENT]