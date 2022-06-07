UPDATE  [dbo].[COMPONENTS]
SET     [ID] = @ID
       ,[NAME] = @Name       
WHERE   [No] = @No;

SELECT *
FROM	[dbo].[COMPONENTS]