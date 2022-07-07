UPDATE  [dbo].[COMPONENT]
SET     [ID] = @ID
       ,[NAME] = @Name
       ,[lastUpdate] = GetDate()         
WHERE   [No] = @No;

SELECT *
FROM	[dbo].[COMPONENT]