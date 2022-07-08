UPDATE  [dbo].[RECIPE_B]
SET     [componentNo] = @componentNo
       ,[componentSP] = @componentSP
               
WHERE   [recipeNo] = @recipeNo;

SELECT *
FROM	[dbo].[RECIPE_B]